# 06 磁盘满、内存不足、cron 不执行与回滚

资源故障、定时任务故障和发布回滚经常发生在生产运维中。它们看似不是同一类问题，但排查方法相同：先确认现象和影响范围，再保留现场，最后止血、修复、验证和复盘。

## 作用

- 掌握磁盘满、内存不足、cron 不执行和发布回滚的排查顺序。
- 避免误删文件、误杀进程、误回滚。
- 建立资源监控、任务日志和回滚预案。
- 把故障处理变成可重复执行的流程。

## 一、磁盘满

### 常见现象

- 日志写入失败。
- 数据库无法写入。
- 应用报 `No space left on device`。
- SSH 登录慢或命令执行异常。
- Docker 构建或拉镜像失败。

### 快速检查

```bash
df -h
df -ih
```

`df -h` 看磁盘空间，`df -ih` 看 inode。空间没满但 inode 满了，也会无法创建新文件。

找大目录：

```bash
sudo du -h --max-depth=1 /var | sort -h
sudo du -h --max-depth=1 /opt | sort -h
sudo du -h --max-depth=1 / | sort -h
```

找大文件：

```bash
sudo find /var -type f -size +500M -exec ls -lh {} \;
```

查已删除但仍被进程占用的文件：

```bash
sudo lsof | grep deleted
```

### 安全清理思路

优先清理可确认的文件：

- 旧应用发布包。
- 旧日志压缩包。
- 过期备份。
- 包管理缓存。
- Docker 未使用镜像和Docker。

谨慎处理：

- 数据库目录。
- 当前日志文件。
- `/var/lib` 下不明文件。
- 业务上传文件。
- 证书和配置。

常用命令：

```bash
sudo journalctl --vacuum-time=7d
sudo apt clean
sudo dnf clean all
Docker system df
```

Docker 清理前要确认影响：

```bash
Docker system prune
```

不要随意加 `-a`，它会删除未被Docker使用的镜像，可能影响回滚。

### 删除后空间未释放

原因：文件已删除，但进程仍打开着文件句柄。

检查：

```bash
sudo lsof | grep deleted
```

处理：

- 重启对应服务。
- 对日志文件，优先使用 日志rotate 或让服务重新打开日志。

验证：

```bash
df -h
```

### 预防

- 配置 `日志rotate`。
- 部署目录只保留固定数量版本。
- 备份设置保留周期。
- 监控磁盘和 inode。
- 日志不要无限写单个文件。

## 二、内存不足和 OOM

### 常见现象

- 服务突然退出。
- 日志出现 `Killed`。
- 系统响应变慢。
- swap 使用很高。
- 内核日志出现 `Out of memory`。

### 快速检查

```bash
free -h
top
ps aux --sort=-%mem | head -n 20
```

查看 OOM：

```bash
dmesg | grep -i "out of memory"
journalctl -k | grep -i "killed process"
```

看服务日志：

```bash
journalctl -u demo-接口 -n 200 --no-分页r
```

### 判断类型

| 类型 | 特征 | 处理 |
| --- | --- | --- |
| 瞬时高峰 | 某个批任务期间升高 | 限制并发、错峰 |
| 内存泄漏 | 进程内存持续增长 | 重启止血，修代码 |
| 配置过大 | JVM/Node 参数超过机器能力 | 调整内存上限 |
| 系统资源不足 | 多服务争抢 | 扩容或拆分 |

### JVM 常见处理

查看启动参数：

```bash
ps -ef | grep Java学习资料
```

示例：

```bash
JAVA_OPTS="-Xms512m -Xmx1024m"
```

如果机器只有 2GB 内存，不要给单个 Java 服务设置过大的 `-Xmx`。

### Node.脚本 常见处理

设置上限：

```bash
node --max-old-space-size=1024 app.脚本
```

### 预防

- 给服务设置合理内存上限。
- 监控内存、swap、OOM。
- 批任务设置并发和单批数据量。
- Docker设置 memory nofile。
- 对内存泄漏做 heap dump 和代码修复。

## 三、cron 不执行

### 常见现象

- 手动执行脚本成功，定时不执行。
- cron 执行了但结果不对。
- 脚本依赖的命令找不到。
- 没有日志，无法判断是否执行。

### 快速检查

查看任务：

```bash
crontab -l
sudo crontab -l
```

查看 cron 服务：

```bash
systemctl status cron
systemctl status crond
```

Ubuntu/Debian 日志：

```bash
grep CRON /var/日志/sys日志
```

CentOS/RHEL 日志：

```bash
tail -n 100 /var/日志/cron
```

### cron 常见坑

| 问题 | 修复 |
| --- | --- |
| 使用相对路径 | 改成绝对路径 |
| PATH 太少 | 在 crontab 或脚本中设置 PATH |
| 依赖 `.bashrc` | 脚本中显式 source 配置 |
| 没有执行权限 | `chmod +x script.sh` |
| 没有日志 | 输出重定向到日志 |
| 重复执行 | 使用锁 |
| 用户不对 | 确认是哪个用户的 crontab |

推荐写法：

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

*/5 * * * * /opt/apps/demo-接口/scripts/作业.sh >> /var/日志/demo-作业.日志 2>&1
```

脚本建议：

```bash
#!/usr/bin/env bash
set -euo pipefail

cd /opt/apps/demo-接口/current
/usr/bin/flock -n /tmp/demo-作业.lock /usr/bin/Python学习资料3 作业.py
```

### 验证 cron

先手动用同一用户执行：

```bash
sudo -u app /opt/apps/demo-接口/scripts/作业.sh
```

再观察日志：

```bash
tail -f /var/日志/demo-作业.日志
```

## 四、发布后回滚

### 常见现象

- 新版本启动失败。
- 错误率升高。
- 关键接口不可用。
- 前端资源异常。
- 数据库变更导致旧代码不兼容。

### 回滚前判断

先确认：

- 是否只是配置问题，可以快速修复。
- 是否有旧版本制品。
- 数据库变更是否兼容旧版本。
- 是否需要同时回滚前端、后端、配置。
- 回滚后如何验证。

不要在数据库迁移不可逆时盲目只回滚代码。

### current 软链接回滚模型

目录：

```text
/opt/apps/demo-接口/
├── current -> releases/20260512-103000
├── releases/
│   ├── 20260510-210000
│   └── 20260512-103000
└── shared/
```

查看当前版本：

```bash
readlink -f /opt/apps/demo-接口/current
ls -lah /opt/apps/demo-接口/releases
```

切回旧版本：

```bash
sudo ln -sfn /opt/apps/demo-接口/releases/20260510-210000 /opt/apps/demo-接口/current
sudo systemctl restart demo-接口
```

验证：

```bash
systemctl status demo-接口 --no-分页r
curl -fsS http://127.0.0.1:8080/health
journalctl -u demo-接口 -n 100 --no-分页r
```

### 回滚清单

- 代码版本已切回。
- 配置文件是否需要切回。
- systemd 是否需要重载。
- Nginx 是否需要 reload。
- 数据库是否兼容。
- 定时任务是否受影响。
- 健康检查通过。
- 关键业务流程通过。
- 监控错误率恢复。

## 故障复盘模板

```text
故障时间：
影响范围：
用户表现：
发现方式：
根因：
止血操作：
最终修复：
验证方式：
预防措施：
待办负责人：
```

复盘不是追责，而是把下一次故障变得更容易发现、更容易止血、更不容易复发。

## 好用工具

| 工具 | 用途 |
| --- | --- |
| `df`/`du` | 查磁盘空间和目录大小 |
| `lsof` | 查删除但仍占用的文件 |
| `journalctl --vacuum-time` | 清理 systemd 日志 |
| `free`/`top`/`ps` | 查内存和进程 |
| `journalctl -k` | 查 OOM 记录 |
| `crontab` | 查看定时任务 |
| `flock` | 防止 cron 重复执行 |
| `readlink`/`ln -sfn` | 管理 current 软链接回滚 |

## 练习

1. 创建一个大测试文件，观察 `df -h` 和 `du` 的变化，然后安全删除。
2. 写一个 cron 脚本，不设置 PATH，复现命令找不到，再修复。
3. 建立 `releases/current/shared` 目录模型，练习软链接回滚。
4. 写一份磁盘满故障复盘模板。
