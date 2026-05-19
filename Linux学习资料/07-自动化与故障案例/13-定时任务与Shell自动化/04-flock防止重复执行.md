# flock 防止重复执行

## 作用

`flock` 用于给脚本加文件锁，避免上一次任务还没结束，下一次定时任务又开始执行。备份、同步、日志清理、报表生成、数据导入这类任务一旦重复运行，可能导致文件互相覆盖、数据库压力翻倍、备份不一致、清理误删等问题。

这一节重点解决：

- 为什么定时任务需要锁。
- `flock -n`、等待锁、超时等待怎么用。
- 在 crontab 中如何加锁。
- 在脚本内部如何加锁。
- 锁文件放在哪里更合适。

## 痛点

- 每 5 分钟执行的任务，某次运行超过 5 分钟，下一次又启动。
- 两个备份进程同时写同一个目标文件。
- 日志清理和日志压缩同时运行，互相影响。
- 上一次任务卡住，后续任务不断堆积。
- 不知道当前任务是否已经在运行。

## 基础用法

命令行直接加锁：

```bash
flock -n /tmp/backup-demo.lock /opt/scripts/backup-demo.sh
```

含义：

- `/tmp/backup-demo.lock` 是锁文件。
- `-n` 表示拿不到锁就立即失败，不等待。
- 后面是要执行的命令。

crontab：

```text
0 2 * * * flock -n /var/lock/backup-demo.lock /opt/scripts/backup-demo.sh >> /var/日志/backup-demo.日志 2>&1
```

如果上一次任务还在运行，本次会直接退出。

## 等待锁和超时

立即失败：

```bash
flock -n /var/lock/任务.lock /opt/scripts/任务.sh
```

一直等待：

```bash
flock /var/lock/任务.lock /opt/scripts/任务.sh
```

最多等待 30 秒：

```bash
flock -w 30 /var/lock/任务.lock /opt/scripts/任务.sh
```

选择建议：

- 备份、清理类任务通常用 `-n`，避免堆积。
- 必须串行执行的任务可以用 `-w` 等待一段时间。
- 很少建议无限等待，除非你能监控等待时间。

## 脚本内部加锁

模板：

```bash
#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/var/lock/示例-任务.lock"
LOG_FILE="/var/日志/示例-任务.日志"

日志() {
  echo "[$(date '+%F %T')] $*" | tee -a "$LOG_FILE"
}

exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  日志 "another instance is running, exit"
  exit 0
fi

日志 "任务 start"
# 业务逻辑写这里
日志 "任务 done"
```

说明：

- `exec 200>"$LOCK_FILE"` 打开文件描述符 200。
- `flock -n 200` 对该文件描述符加锁。
- 脚本退出后锁会释放。

优点：

- 锁逻辑和脚本放在一起。
- 不依赖 crontab 调用者记得加 `flock`。
- 手工执行脚本也能防重复。

## 锁文件位置

常见位置：

```bash
/var/lock/示例-任务.lock
/run/lock/示例-任务.lock
/tmp/示例-任务.lock
```

建议：

- 系统任务使用 `/var/lock` 或 `/run/lock`。
- 临时测试可用 `/tmp`。
- 锁文件名包含项目和任务名。
- 确保执行用户有写权限。

权限示例：

```bash
sudo touch /var/lock/示例-任务.lock
sudo chown app:app /var/lock/示例-任务.lock
sudo chmod 640 /var/lock/示例-任务.lock
```

如果 `/run/lock` 重启后清空，这是正常行为。

## 锁和 PID 文件的区别

PID 文件：

```text
/run/示例-任务.pid
```

记录进程 ID，但可能出现：

- 进程异常退出后 PID 文件残留。
- PID 被系统复用。
- 脚本忘记清理 PID 文件。

`flock` 文件锁：

- 由内核管理。
- 进程退出后锁自动释放。
- 更适合防止重复执行。

如果需要展示当前运行进程，可以锁配合日志或 PID 文件，但不要只依赖 PID 文件。

## 排查锁问题

查看谁持有锁：

```bash
sudo lsof /var/lock/示例-任务.lock
```

查看任务是否还在运行：

```bash
pgrep -af backup-demo
ps -ef | grep '[b]ackup-demo'
```

查看日志：

```bash
tail -n 100 /var/日志/backup-demo.日志
```

如果任务长期持有锁，要判断：

- 是否卡住。
- 是否正在处理大文件。
- 是否外部依赖超时。
- 是否应该加超时控制。

## 和 timeout 配合

防止任务无限运行：

```bash
flock -n /var/lock/backup-demo.lock timeout 1h /opt/scripts/backup-demo.sh
```

含义：任务最多运行 1 小时。

注意：

- 超时终止可能导致中间文件残留。
- 备份任务需要设计临时文件和最终文件的切换。
- 被 timeout 杀掉后要有日志和告警。

## 和 cron 配合模板

```text
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

*/5 * * * * flock -n /var/lock/check-demo-接口.lock /opt/scripts/check-demo-接口.sh >> /var/日志/check-demo-接口.日志 2>&1
0 2 * * * flock -n /var/lock/backup-demo.lock timeout 2h /opt/scripts/backup-demo.sh >> /var/日志/backup-demo.日志 2>&1
```

如果要区分“跳过执行”和“执行失败”，脚本或 wrapper 需要记录 flock 失败：

```bash
if ! flock -n /var/lock/任务.lock /opt/scripts/任务.sh; then
  echo "[$(date '+%F %T')] lock busy or 任务 failed" >> /var/日志/任务.日志
fi
```

注意：这种写法无法区分锁忙和任务本身失败。需要更精确时用脚本内部加锁。

## systemd timer 的并发

systemd timer 触发同一个 oneshot 服务 时，如果上次服务仍在运行，systemd 通常不会并发启动同一个 服务。这是 systemd timer 相比 cron 的一个优势。

但如果你手工启动同一脚本，仍然可能重复。所以关键脚本内部加 `flock` 仍然有价值。

## 好用工具

- `flock`：文件锁。
- `timeout`：限制最长运行时间。
- `lsof`：查看锁文件被谁打开。
- `pgrep`：查找运行中的任务。
- `systemd timer`：更强的定时任务管理。

## 使用技巧

- 周期任务默认考虑是否需要锁。
- 锁文件名要和项目、任务一一对应。
- 推荐脚本内部加锁，crontab 外部加锁作为补充也可以。
- 长任务配合 `timeout`，避免永久占锁。
- 任务跳过、失败、超时都要写日志。

## 难点

- 锁文件存在不代表锁被持有，要用 `lsof` 或实际 flock 判断。
- `flock -n 通用mand` 的退出码可能代表锁忙，也可能代表命令失败，需要设计日志区分。
- NFS 等网络文件系统上的 flock 行为要谨慎验证。
- 任务被强杀时可能留下临时文件，脚本要有清理逻辑。

## 重点

- 防重复执行是定时任务安全的基本要求。
- `flock` 比手写 PID 文件更可靠。
- 长任务要有锁、超时、日志和失败告警。
- 重复执行风险越高，越应该把锁写进脚本内部。

## 练习

1. 写一个 sleep 60 的脚本，用 cron 每分钟执行，观察不加锁和加锁的区别。
2. 使用脚本内部 `exec 200>` 的方式加锁。
3. 用 `lsof` 查看锁文件是否被某个进程打开。
4. 给备份任务加 `flock` 和 `timeout`。
