# cron 格式与执行日志

## 作用

cron 用于按固定时间执行命令或脚本，例如定时备份、日志清理、健康检查、文件同步、报表生成。学习 cron 的重点不是只记住五段时间格式，而是让任务执行可观测：知道什么时候执行、由谁执行、输出写到哪里、失败如何发现、如何避免重复执行。

这一节重点解决：

- crontab 时间格式怎么写。
- 系统级 cron 和用户级 crontab 的区别。
- cron 输出如何记录到日志。
- 如何检查 cron 是否执行过。
- 什么时候考虑 systemd timer 替代 cron。

## 痛点

- cron 没执行，但没有日志，无法判断原因。
- 手工执行脚本成功，cron 执行失败。
- 把任务写到错误用户的 crontab，权限不符合预期。
- 输出没有重定向，错误被邮件系统吞掉或根本没人看。
- 时间表达式写错，任务执行频率不符合预期。

## crontab 基础

查看当前用户任务：

```bash
crontab -l
```

编辑当前用户任务：

```bash
crontab -e
```

删除当前用户全部任务：

```bash
crontab -r
```

`crontab -r` 风险很高，执行前要先备份：

```bash
crontab -l > crontab.bak.$(date +%F-%H%M%S)
```

查看某个用户任务：

```bash
sudo crontab -u app -l
```

编辑某个用户任务：

```bash
sudo crontab -u app -e
```

## 时间格式

格式：

```text
分 时 日 月 周 命令
```

字段范围：

| 字段 | 范围 | 示例 |
| --- | --- | --- |
| 分 | 0-59 | `*/5` 每 5 分钟 |
| 时 | 0-23 | `2` 凌晨 2 点 |
| 日 | 1-31 | `1` 每月 1 日 |
| 月 | 1-12 | `*` 每月 |
| 周 | 0-7 | `0` 或 `7` 通常表示周日 |

常见示例：

```text
* * * * * 每分钟执行
*/5 * * * * 每 5 分钟执行
0 * * * * 每小时整点执行
0 2 * * * 每天 02:00 执行
30 2 * * 1 每周一 02:30 执行
0 3 1 * * 每月 1 日 03:00 执行
```

注意：不同 cron 实现对“日”和“周”同时指定时的行为可能让人误解。复杂日历规则建议用 systemd timer 或调度系统。

## 任务日志

cron 中必须重定向输出：

```text
*/5 * * * * /opt/scripts/check-demo-api.sh >> /var/log/check-demo-api.log 2>&1
```

含义：

- `>>` 追加标准输出。
- `2>&1` 把标准错误也写入同一日志。

更推荐脚本内部自己写日志，同时 crontab 兜底：

```text
*/5 * * * * /opt/scripts/check-demo-api.sh >> /var/log/check-demo-api.cron.log 2>&1
```

日志文件权限：

```bash
sudo touch /var/log/check-demo-api.log
sudo chown app:app /var/log/check-demo-api.log
sudo chmod 640 /var/log/check-demo-api.log
```

如果任务日志持续增长，要配置 logrotate。

## cron 执行记录

不同发行版日志位置不同。

Ubuntu/Debian：

```bash
grep CRON /var/log/syslog
grep CRON /var/log/syslog | tail
```

RHEL 系：

```bash
grep CRON /var/log/cron
tail -n 100 /var/log/cron
```

systemd 管理 cron 时：

```bash
journalctl -u cron --since "1 hour ago" --no-pager
journalctl -u crond --since "1 hour ago" --no-pager
```

注意：cron 系统日志只能证明 cron 尝试执行命令，不一定证明脚本内部成功完成。脚本自己的日志仍然必要。

## 系统级 cron

常见位置：

```bash
/etc/crontab
/etc/cron.d/
/etc/cron.hourly/
/etc/cron.daily/
/etc/cron.weekly/
/etc/cron.monthly/
```

`/etc/crontab` 和 `/etc/cron.d/*` 通常有用户字段：

```text
分 时 日 月 周 用户 命令
```

示例：

```text
*/5 * * * * app /opt/scripts/check-demo-api.sh >> /var/log/check-demo-api.log 2>&1
```

用户 crontab 没有用户字段：

```text
*/5 * * * * /opt/scripts/check-demo-api.sh >> /var/log/check-demo-api.log 2>&1
```

不要把两种格式混用。

## cron 服务状态

Ubuntu/Debian：

```bash
systemctl status cron --no-pager
```

RHEL 系：

```bash
systemctl status crond --no-pager
```

如果 cron 服务没运行，任务不会执行。

## 常见错误

### 1. 脚本没有执行权限

检查：

```bash
ls -l /opt/scripts/check-demo-api.sh
```

修复：

```bash
chmod 750 /opt/scripts/check-demo-api.sh
```

或者在 cron 中显式用 bash：

```text
*/5 * * * * /usr/bin/bash /opt/scripts/check-demo-api.sh >> /var/log/check.log 2>&1
```

### 2. 命令找不到

cron 环境 PATH 很少。解决：

```text
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

或脚本中使用绝对路径。

### 3. 工作目录不对

cron 默认工作目录通常不是脚本所在目录。脚本中显式：

```bash
cd /opt/apps/demo-api/current
```

并检查：

```bash
[[ -d /opt/apps/demo-api/current ]] || exit 1
```

### 4. 百分号问题

cron 命令中的 `%` 有特殊含义，复杂命令建议写进脚本，不要直接塞在 crontab 一行里。

## systemd timer 替代方案

对于需要更好日志、状态、依赖管理的任务，可以使用 systemd timer。

service 示例：

```ini
[Unit]
Description=Demo backup task

[Service]
Type=oneshot
User=app
ExecStart=/opt/scripts/backup-demo.sh
```

timer 示例：

```ini
[Unit]
Description=Run demo backup daily

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

启用：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now demo-backup.timer
systemctl list-timers | grep demo
```

优点：

- 能用 `journalctl -u` 看日志。
- 能查看上次和下次执行时间。
- 支持错过后补执行 `Persistent=true`。
- 和 systemd 权限、依赖、资源限制统一。

cron 仍适合简单任务，systemd timer 更适合生产关键任务。

## 好用工具

- `crontab.guru`：在线解释 cron 表达式，离线生产环境不要依赖它执行。
- `shellcheck`：检查脚本质量。
- `flock`：防止重复执行。
- `systemd timer`：更强的定时任务管理。
- `at`：一次性定时任务。

`at` 示例：

```bash
echo "/opt/scripts/restart-demo.sh" | at 03:00
```

## 使用技巧

- 每条 cron 都要有日志重定向。
- 关键任务写到专用用户下，不要默认 root。
- 复杂逻辑写脚本，不要塞进 crontab 一行。
- 修改 crontab 前先备份。
- 生产关键定时任务优先考虑 systemd timer 或调度平台。

## 难点

- 用户 crontab 和系统 crontab 格式不同。
- cron 执行日志不等于脚本成功日志。
- cron 环境变量少，手工成功不代表 cron 成功。
- 时间表达式复杂时容易误判执行频率。

## 重点

- cron 表达式要能明确解释执行时间。
- 输出必须写入日志。
- 修改前备份，执行后验证。
- 对关键任务，要能回答：上次何时执行、是否成功、失败如何告警。

## 练习

1. 写一个每分钟输出时间到日志的 cron，验证系统日志和脚本日志。
2. 把任务写到 `/etc/cron.d/`，注意增加用户字段。
3. 故意去掉脚本执行权限，观察 cron 日志和任务日志。
4. 用 systemd timer 实现每天凌晨 2 点执行一次脚本。
