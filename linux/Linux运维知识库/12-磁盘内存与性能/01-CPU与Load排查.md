# CPU 与 Load 排查

## 作用

CPU 与 Load 排查用于判断服务器“为什么变慢、为什么接口超时、为什么机器看起来很忙”。CPU 高不一定等于系统负载高，Load 高也不一定是 CPU 算力不足；Load 还可能来自磁盘 IO 等待、不可中断任务、进程排队。排查时要把 CPU 使用率、load average、运行队列、IO wait、具体进程结合起来看。

这一节重点解决：

- `load average` 是什么。
- 如何判断 CPU 是否真的成为瓶颈。
- 如何找到高 CPU 进程。
- 如何区分 CPU 高和 IO 等待。
- Java、Node、Python 服务 CPU 高时怎么继续定位。

## 痛点

- 看到 load 高就直接扩 CPU，实际是磁盘 IO 卡住。
- CPU 高时只会重启服务，没有保存现场。
- `top` 里看到多个 Java 进程，不知道哪个线程在耗 CPU。
- load 偶尔升高被误判为故障，忽略了业务高峰或批任务。
- 多核机器上不知道 load 到多少才算异常。

## 核心概念

### 1. CPU 使用率

查看：

```bash
top
mpstat 1
```

CPU 常见字段：

| 字段 | 含义 |
| --- | --- |
| `us` | 用户态 CPU，应用代码消耗 |
| `sy` | 内核态 CPU，系统调用、网络、IO 等 |
| `id` | 空闲 CPU |
| `wa` | IO 等待 |
| `hi` / `si` | 硬中断、软中断 |
| `st` | 虚拟化环境中被宿主机偷走的 CPU |

判断：

- `us` 高：通常是应用计算、循环、序列化、压缩、加密等。
- `sy` 高：可能是系统调用、网络包处理、文件操作频繁。
- `wa` 高：CPU 在等磁盘 IO，不是单纯 CPU 不够。
- `st` 高：云主机宿主机资源争用，需要关注云平台或实例规格。

### 2. load average

查看：

```bash
uptime
cat /proc/loadavg
```

示例：

```text
load average: 2.10, 1.80, 1.20
```

三个值分别是最近 1 分钟、5 分钟、15 分钟的平均负载。

粗略理解：

- 1 核机器 load 长期大于 1，说明任务排队。
- 4 核机器 load 长期大于 4，说明任务排队。
- 8 核机器 load 长期大于 8，说明任务排队。

查看 CPU 核数：

```bash
nproc
lscpu
```

注意：Load 包含等待 CPU 的任务，也包含不可中断 IO 等待任务。所以 load 高但 CPU 使用率不高时，要怀疑 IO。

## 常用命令

### 1. top

```bash
top
```

常用按键：

- `P`：按 CPU 排序。
- `M`：按内存排序。
- `1`：显示每个 CPU 核心。
- `c`：显示完整命令行。
- `H`：显示线程。

只看某个进程：

```bash
top -p 进程PID
```

### 2. ps 排序

```bash
ps aux --sort=-%cpu | head -n 20
ps -eo pid,ppid,user,stat,%cpu,%mem,etime,cmd --sort=-%cpu | head -n 20
```

重点看：

- PID。
- 运行用户。
- 运行时长。
- 完整命令。
- 是否是业务服务、批任务、备份、压缩、日志处理。

### 3. mpstat

来自 `sysstat`：

```bash
mpstat 1
mpstat -P ALL 1
```

用途：

- 查看整体 CPU 使用。
- 查看是否单核打满。
- 区分 user、system、iowait。

安装：

```bash
sudo apt install sysstat
sudo dnf install sysstat
```

### 4. pidstat

按进程观察 CPU：

```bash
pidstat 1
pidstat -p 进程PID 1
pidstat -t -p 进程PID 1
```

`-t` 可看到线程级别，适合 Java、Node、Python 进程进一步定位。

## 排查流程

### 1. 判断整体负载

```bash
uptime
nproc
top
```

判断：

- load 是否长期高于 CPU 核数。
- CPU 是否打满。
- iowait 是否高。
- 是否有明显异常进程。

### 2. 找高 CPU 进程

```bash
ps -eo pid,ppid,user,stat,%cpu,%mem,etime,cmd --sort=-%cpu | head -n 20
```

拿到 PID 后：

```bash
systemctl status 服务名 --no-pager
ls -l /proc/PID/cwd
cat /proc/PID/cmdline | tr '\0' ' '
```

确认它属于哪个服务，不要只看进程名。

### 3. 判断是否 IO 等待

如果 load 高，但 CPU 空闲不少，查看：

```bash
top
mpstat 1
iostat -x 1
```

如果 `%iowait` 高、磁盘 `%util` 高或 await 高，方向转到磁盘 IO。

### 4. 查看最近变更和日志

```bash
journalctl -u demo-api --since "1 hour ago" --no-pager
tail -n 200 /opt/apps/demo-api/shared/logs/app.log
```

常见原因：

- 新版本发布后出现死循环。
- 大量请求涌入。
- 批处理任务启动。
- 日志量暴增。
- 压缩、备份、报表导出。

## Java CPU 高

找进程：

```bash
pid=$(pgrep -f 'demo-api.*app.jar' | head -n 1)
top -Hp "$pid"
```

线程 PID 转十六进制：

```bash
printf '%x\n' 线程PID
```

抓线程栈：

```bash
jcmd "$pid" Thread.print > thread.txt
# 或
jstack "$pid" > thread.txt
```

在 `thread.txt` 中搜索十六进制线程 ID。

常见方向：

- 死循环。
- 正则或 JSON 处理过重。
- 加密压缩。
- GC 频繁。
- 线程池打满。

查看 JVM 参数：

```bash
jcmd "$pid" VM.command_line
jcmd "$pid" GC.heap_info
```

## Node/Python CPU 高

Node：

```bash
pgrep -af node
top -Hp 进程PID
```

方向：

- 同步 CPU 密集任务阻塞事件循环。
- JSON 大对象处理。
- 压缩、图片处理、加密。
- 日志或序列化过重。

Python：

```bash
pgrep -af python
py-spy top --pid 进程PID
```

`py-spy` 是非常好用的 Python 线上采样工具，使用前要评估权限和安装来源。

## 止血动作

根据场景选择：

- 限流或降低入口流量。
- 暂停批任务。
- 回滚最近版本。
- 扩容实例。
- 临时重启异常服务。
- 调低并发或 worker 数。

重启前尽量保存：

```bash
uptime
top -b -n 1 | head -n 40
ps aux --sort=-%cpu | head -n 20
journalctl -u demo-api -n 200 --no-pager
```

## 好用工具

- `htop`：交互式查看进程和 CPU。
- `glances`：综合资源面板。
- `sysstat`：提供 `mpstat`、`pidstat`、`sar`。
- `perf`：Linux 性能采样，适合高级分析。
- `jcmd`、`jstack`：Java 线程和 JVM 诊断。
- `py-spy`：Python 采样分析。

## 使用技巧

- load 要结合 CPU 核数看。
- load 高但 CPU 不高时，优先查 IO wait。
- 高 CPU 处理前先确认进程归属和最近变更。
- Java 高 CPU 要看线程级别，不只看进程级别。
- 不要把短时间峰值等同于故障，要看持续时间和业务影响。

## 难点

- 多核机器上单个线程打满只表现为一个核高，不一定总 CPU 100%。
- 虚拟机 `st` 高说明宿主机争用，应用层不一定能解决。
- CPU 高可能是结果，例如外部依赖慢导致重试风暴。
- 性能问题往往需要结合日志、指标、链路追踪和最近变更。

## 重点

- 先判断是 CPU 忙、IO 等待，还是其他资源瓶颈。
- `uptime`、`top`、`ps`、`mpstat`、`pidstat` 是基础组合。
- 高 CPU 要定位到具体进程、具体线程、具体业务动作。
- 止血和根因分析分开，恢复后要补监控和复盘。

## 练习

1. 使用 `yes > /dev/null` 制造 CPU 占用，用 `top` 和 `ps` 找到进程。
2. 查看当前机器 CPU 核数，并解释 load 多少算偏高。
3. 安装 `sysstat`，使用 `mpstat -P ALL 1` 观察每核使用率。
4. 对一个 Java 测试进程使用 `top -Hp` 和 `jstack` 定位线程。
