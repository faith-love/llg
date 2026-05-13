# logrotate 日志轮转

## 作用

`logrotate` 用于按时间或大小轮转日志文件，压缩旧日志，限制保留数量，避免日志无限增长把磁盘撑满。线上很多故障不是业务代码导致的，而是日志持续增长导致磁盘满，进而引发服务写文件失败、数据库异常、Nginx 失败、部署失败。

这一节重点掌握：

- logrotate 配置文件放在哪里。
- 常用配置项含义。
- `copytruncate` 和重载日志文件的区别。
- 如何测试轮转配置。
- 如何为应用日志、Nginx 日志设计保留策略。

## 痛点

- 应用日志一天几十 GB，几天后磁盘满。
- 手工删除正在写入的日志文件，磁盘空间没有释放。
- 日志轮转后应用仍写旧文件，导致新日志为空。
- 配置了 logrotate，但没有验证是否执行。
- 压缩和保留策略不清楚，排障时找不到历史日志。

## 配置位置

主配置：

```bash
/etc/logrotate.conf
```

子配置目录：

```bash
/etc/logrotate.d/
```

查看：

```bash
ls -l /etc/logrotate.d/
cat /etc/logrotate.conf
```

系统通常通过 cron 或 systemd timer 定期运行 logrotate。

查看定时器：

```bash
systemctl list-timers | grep logrotate
systemctl status logrotate.timer --no-pager
```

如果没有 systemd timer，查看：

```bash
ls -l /etc/cron.daily/logrotate
```

## 基础配置示例

应用日志：

```text
/opt/apps/demo-api/shared/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    dateext
}
```

含义：

| 配置 | 作用 |
| --- | --- |
| `daily` | 每天轮转 |
| `weekly` | 每周轮转 |
| `rotate 14` | 保留 14 份旧日志 |
| `compress` | 压缩旧日志 |
| `delaycompress` | 延迟一轮压缩，避免正在写入 |
| `missingok` | 文件不存在不报错 |
| `notifempty` | 空文件不轮转 |
| `copytruncate` | 复制后清空原文件 |
| `dateext` | 文件名加日期后缀 |
| `size 100M` | 超过指定大小轮转 |

## 按大小轮转

如果日志增长快，可以使用：

```text
/opt/apps/demo-api/shared/logs/*.log {
    size 200M
    rotate 10
    compress
    missingok
    notifempty
    copytruncate
}
```

注意：

- `daily` 是按周期。
- `size` 是按大小。
- 不同版本 logrotate 对组合策略的行为细节可能有差异，配置后要用 debug 和 force 测试。

## copytruncate

`copytruncate` 的做法：

1. 复制当前日志为旧日志文件。
2. 清空原日志文件。
3. 应用继续写同一个文件句柄。

优点：

- 不需要通知应用重新打开日志文件。
- 对很多普通应用简单有效。

缺点：

- 复制和清空之间极短时间内可能丢少量日志。
- 超大日志复制成本高。

适合：

- 应用不支持重新打开日志文件。
- 简单文件日志。

## create + postrotate

更规范的方式是轮转后创建新文件，并通知服务重新打开日志。

Nginx 示例：

```text
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -s /run/nginx.pid ] && kill -USR1 $(cat /run/nginx.pid)
    endscript
}
```

说明：

- `create 0640 www-data adm`：轮转后创建新日志文件并设置权限。
- `postrotate`：轮转后执行命令。
- `kill -USR1`：通知 Nginx 重新打开日志文件。
- `sharedscripts`：多个日志匹配时脚本只执行一次。

不同发行版 Nginx 用户可能是 `nginx` 或 `www-data`，要根据实际情况调整。

## 测试配置

### 1. debug 模式

```bash
sudo logrotate -d /etc/logrotate.d/demo-api
```

`-d` 只模拟，不真正执行。

### 2. 强制执行

```bash
sudo logrotate -f /etc/logrotate.d/demo-api
```

执行后检查：

```bash
ls -lh /opt/apps/demo-api/shared/logs/
```

### 3. 查看状态文件

```bash
sudo cat /var/lib/logrotate/status
```

logrotate 通过状态文件记录上次轮转时间。

## 正在写入的删除文件

如果删除了正在被进程写入的日志文件，磁盘空间可能不会释放，因为进程仍持有文件句柄。

检查：

```bash
sudo lsof | grep deleted
sudo lsof +L1
```

处理：

- 优先重启或 reload 对应服务，让进程释放句柄。
- 不要盲目 kill 核心进程。
- 后续用 logrotate 代替手工删除。

## 应用日志策略

建议：

```text
普通业务日志：保留 7 到 14 天，压缩
错误日志：保留 14 到 30 天，压缩
审计日志：按合规要求保留更久，最好集中存储
调试日志：默认关闭，需要时短期开启
```

示例：

```text
/opt/apps/demo-api/shared/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    dateext
    maxage 30
}
```

## Nginx 日志策略

Nginx 包通常自带 logrotate 配置：

```bash
cat /etc/logrotate.d/nginx
```

如果自定义站点日志，也要确认是否被匹配：

```bash
ls /var/log/nginx/*.log
sudo logrotate -d /etc/logrotate.d/nginx
```

如果自定义日志路径不在 `/var/log/nginx/*.log`，需要新增配置。

## 磁盘告警和清理

查看磁盘：

```bash
df -h
sudo du -h --max-depth=1 /var/log | sort -h
sudo du -h --max-depth=1 /opt/apps | sort -h
```

找大日志：

```bash
sudo find /var/log /opt/apps -type f -name "*.log" -size +500M -ls
```

清理原则：

- 先确认文件用途。
- 优先清理已轮转压缩的旧日志。
- 不要直接删除正在写入的日志。
- 对生产日志先确认是否还有排障或合规价值。

## 好用工具

- `logrotate`：日志轮转。
- `lsof +L1`：找被删除但仍占空间的文件。
- `du`、`df`：磁盘占用定位。
- `ncdu`：交互式查看目录占用。
- `journalctl --vacuum-time`：清理 journal 日志。

journal 清理示例：

```bash
sudo journalctl --disk-usage
sudo journalctl --vacuum-time=14d
sudo journalctl --vacuum-size=1G
```

## 使用技巧

- 应用日志上线时就配置轮转，不要等磁盘满。
- 轮转策略要同时考虑保留天数和磁盘容量。
- 对不支持重新打开日志的应用，用 `copytruncate`。
- 对 Nginx 这类支持 reopen 的服务，用 postrotate 通知更稳。
- 配置后用 `logrotate -d` 和 `logrotate -f` 验证。

## 难点

- 删除大日志不释放空间，通常是进程仍持有文件句柄。
- `copytruncate` 简单但可能丢极少量日志。
- 自定义日志路径可能没有被系统默认 logrotate 覆盖。
- 日志保留太短会影响复盘，太长会占用磁盘。

## 重点

- 日志轮转是生产服务的基础配置。
- 磁盘满会引发大量连锁故障。
- logrotate 配置必须测试，不要只写文件。
- 清理日志前先判断是否正在写入和是否仍有排障价值。

## 练习

1. 为 `/opt/apps/demo-api/shared/logs/*.log` 写一份 logrotate 配置。
2. 使用 `logrotate -d` 模拟轮转，再用 `-f` 强制执行。
3. 制造一个被删除但仍占用的测试文件，用 `lsof +L1` 找到它。
4. 查看 journal 占用，并用 vacuum 命令限制保留空间。
