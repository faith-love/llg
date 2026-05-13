# 内存、Swap 与 OOM

## 作用

内存排查用于判断服务变慢、进程退出、系统卡顿是否与内存不足有关。Linux 会把空闲内存用于缓存，所以 `free` 很低不一定是问题；真正要看的是 `available`、Swap 使用、进程 RSS、OOM 记录、容器或 systemd 内存限制。

这一节重点解决：

- 如何正确理解 `free -h`。
- Swap 使用意味着什么。
- 如何判断进程是否被 OOM killer 杀掉。
- Java、Node、Python 服务内存问题如何初步定位。
- 内存不足时如何止血和长期治理。

## 痛点

- 看到 `free` 很少就以为内存泄漏，实际是 Linux 缓存。
- 服务突然退出，应用日志没有错误，根因是 OOM killer。
- Swap 大量使用后接口变慢，却只排查应用逻辑。
- JVM `-Xmx` 设置超过机器可用内存，服务高峰被杀。
- 容器内存限制触发，宿主机看起来还有很多内存。

## free 输出理解

查看：

```bash
free -h
```

示例：

```text
              total        used        free      shared  buff/cache   available
Mem:           7.7G        4.5G        300M        100M        2.9G        2.6G
Swap:          2.0G        500M        1.5G
```

重点字段：

| 字段 | 含义 |
| --- | --- |
| `total` | 总内存 |
| `used` | 已使用内存 |
| `free` | 完全空闲内存 |
| `buff/cache` | 文件缓存和缓冲 |
| `available` | 估算可供新程序使用的内存 |
| `Swap used` | 已使用的交换空间 |

判断原则：

- 看 `available`，不要只看 `free`。
- `buff/cache` 高通常是正常缓存，可被回收。
- Swap 持续增长或大量使用，说明内存压力较大。

## 查看内存进程

按内存排序：

```bash
ps aux --sort=-%mem | head -n 20
ps -eo pid,ppid,user,%mem,rss,vsz,etime,cmd --sort=-rss | head -n 20
```

字段：

- `RSS`：常驻物理内存，更接近实际占用。
- `VSZ`：虚拟内存，不等于真实占用。
- `%MEM`：占总内存比例。

查看某个进程：

```bash
cat /proc/进程PID/status | grep -E 'VmRSS|VmSize|VmPeak|Threads'
cat /proc/进程PID/smaps_rollup
```

`smaps_rollup` 更详细，但需要权限，且不同内核版本支持情况不同。

## Swap

查看：

```bash
free -h
swapon --show
vmstat 1
```

`vmstat` 中关注：

- `si`：swap in。
- `so`：swap out。

如果 `si/so` 持续非 0，说明系统正在频繁换入换出，性能会明显下降。

Swap 的作用：

- 防止瞬时内存不足直接 OOM。
- 让系统有缓冲。

Swap 的风险：

- 大量使用会让服务变慢。
- 对延迟敏感服务，Swap 抖动会造成请求超时。

查看 swappiness：

```bash
cat /proc/sys/vm/swappiness
```

临时调整：

```bash
sudo sysctl vm.swappiness=10
```

永久配置要写入 `/etc/sysctl.conf` 或 `/etc/sysctl.d/*.conf`，生产修改前要评估。

## OOM 排查

### 1. 查看内核日志

```bash
dmesg -T | grep -i 'out of memory\\|killed process'
journalctl -k --since "1 hour ago" | grep -i 'out of memory\\|killed process'
```

常见片段：

```text
Out of memory: Killed process 1234 (java) total-vm:...
```

重点看：

- 被杀进程 PID 和名称。
- 发生时间。
- 进程占用内存。
- 是否和业务高峰、发布、批任务相关。

### 2. systemd 服务状态

```bash
systemctl status demo-api --no-pager
journalctl -u demo-api -n 200 --no-pager
```

如果服务突然退出，而应用日志没有正常关闭记录，要结合 OOM 日志判断。

### 3. 容器 OOM

如果服务运行在 Docker：

```bash
docker ps -a
docker inspect 容器ID | grep -i oom
docker stats
```

容器 OOM 可能不会表现为宿主机整体内存耗尽。

## Java 内存

查看 JVM 参数：

```bash
pid=$(pgrep -f 'demo-api.*app.jar' | head -n 1)
jcmd "$pid" VM.command_line
jcmd "$pid" GC.heap_info
```

关注：

- `-Xms`、`-Xmx` 是否合理。
- 容器内是否识别内存限制。
- 是否有堆外内存、直接内存、线程数过多。

常见建议：

- 不要把 `-Xmx` 设置等于机器总内存。
- 给系统、Nginx、日志、堆外内存、线程栈留下空间。
- 容器内 Java 要确认版本是否正确识别 cgroup 限制。

## Node 和 Python 内存

Node：

```bash
ps aux --sort=-rss | grep node
node --max-old-space-size=1024 server.js
```

方向：

- 内存泄漏。
- 大对象缓存。
- 未分页加载大量数据。
- 文件上传或导出一次性读入内存。

Python：

```bash
ps aux --sort=-rss | grep python
```

好用工具：

- `tracemalloc`：Python 内置内存追踪。
- `memray`：Python 内存分析工具。
- `py-spy`：更多用于 CPU，但也可辅助观察进程。

## 止血动作

内存不足时可选：

- 回滚最近版本。
- 重启泄漏进程，先恢复服务。
- 降低并发或 worker 数。
- 暂停批任务、报表、导出。
- 增加实例或内存。
- 调整 JVM/Node 内存上限。
- 清理无用进程和缓存服务。

不建议：

- 盲目执行 `sync; echo 3 > /proc/sys/vm/drop_caches` 作为常规解决方案。
- 只扩大 Swap 掩盖内存泄漏。
- 不保存现场就重启。

## 好用工具

- `free`：查看整体内存。
- `vmstat`：观察 swap in/out、运行队列。
- `ps`：查看进程 RSS。
- `smem`：更准确分析进程内存分摊。
- `jcmd`：Java 内存和 GC 信息。
- `docker stats`：容器内存。
- `glances`：综合资源观察。

安装：

```bash
sudo apt install smem glances sysstat
sudo dnf install smem glances sysstat
```

## 使用技巧

- 先看 `available`，再看进程 RSS。
- Swap 持续活跃比 Swap 偶尔占用更值得关注。
- OOM 要查内核日志，不要只看应用日志。
- 容器环境要查容器限制，不只看宿主机内存。
- 内存问题要和发布时间、流量、批任务关联起来看。

## 难点

- Linux 缓存占用容易被误判为内存不足。
- OOM killer 可能杀掉的不是占用最高的进程，而是综合评分最高的进程。
- Java 内存不只有堆，还有堆外、线程栈、元空间。
- 内存泄漏往往需要持续观察，不一定一次命令能确认。

## 重点

- 内存排查看 `available`、Swap 活跃、进程 RSS、OOM 记录。
- 服务突然消失要查 `dmesg` 和 `journalctl -k`。
- Swap 不是性能优化，只是缓冲。
- 长期治理要靠内存限制、监控、压测和代码修复。

## 练习

1. 用 `free -h` 解释当前机器的 `available` 和 `buff/cache`。
2. 使用 `ps --sort=-rss` 找出内存占用最高的 10 个进程。
3. 查找当前系统是否发生过 OOM。
4. 给一个 Java 测试服务配置不同 `-Xmx`，观察内存占用变化。
