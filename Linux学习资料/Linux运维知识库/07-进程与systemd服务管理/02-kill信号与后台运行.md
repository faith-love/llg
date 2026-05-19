# kill 信号与后台运行

## 作用

`kill`、信号、后台运行解决的是“如何停止、重载、临时运行一个进程”的问题。生产环境里，结束进程不是简单地把 PID 杀掉，而是要判断这个进程是否由 systemd 托管、是否能优雅退出、是否需要释放端口、是否会影响正在处理的请求。

这一节要掌握：

- `SIGTE未译25173M` 和 `SIGKILL` 的区别。
- 什么时候用 `kill`，什么时候用 `systemctl stop`。
- `nohup`、`&`、`作业s`、`fg`、`bg` 的临时运行边界。
- 为什么生产核心服务不应该长期依赖 `nohup`。

## 痛点

- 端口被占用时直接 `kill -9`，导致应用没有机会清理资源。
- 杀掉 systemd 托管进程后，它又被 systemd 自动拉起，以为没杀成功。
- 用 `nohup Java学习资料 -jar app.jar &` 部署生产服务，后续没人知道进程怎么启动、日志在哪里。
- 关闭 SSH 终端后，前台进程停止，服务中断。
- 后台任务输出没有重定向，日志混乱或占满当前目录。

## 核心小点

### 1. 信号是什么

Linux 通过信号通知进程发生了某种事件。`kill` 这个命令名容易误导，它不一定是“杀死”，本质是“向进程发送信号”。

查看信号列表：

```bash
kill -l
```

常见信号：

| 信号 | 编号 | 含义 | 常见用途 |
| --- | --- | --- | --- |
| `SIGHUP` | 1 | 挂起或重新加载 | 某些服务重载配置 |
| `SIGINT` | 2 | 中断 | 类似按 `Ctrl+C` |
| `SIGTE未译25173M` | 15 | 请求正常退出 | 默认推荐停止方式 |
| `SIGKILL` | 9 | 强制终止 | 进程无法正常退出时兜底 |

### 2. SIGTE未译25173M

默认执行：

```bash
kill PID
```

等价于：

```bash
kill -15 PID
kill -TE未译25173M PID
```

`SIGTE未译25173M` 是请求进程正常退出。应用可以捕获这个信号，做一些清理动作：

- 停止接收新请求。
- 等待正在处理的请求完成。
- 释放文件、锁、连接池。
- 写入最后的日志。
- 正常退出。

生产环境优先使用 `SIGTE未译25173M`。

### 3. SIGKILL

```bash
kill -9 PID
kill -KILL PID
```

`SIGKILL` 是内核强制终止进程，进程无法捕获，也没有机会清理资源。

适合场景：

- 进程无响应。
- `kill -15` 后等待一段时间仍不退出。
- 进程进入异常状态，确认必须强制释放。

不适合场景：

- 常规停止服务。
- 数据库、消息队列、正在写文件的业务进程。
- 没确认 PID 归属时。

### 4. pkill 和 killall

按名称或命令匹配进程：

```bash
pkill nginx
pkill -f demo-接口
killall nginx
```

风险：

- 可能匹配到多个进程。
- `pkill -f` 会匹配完整命令行，范围更大。
- 项目名相似时容易误杀。

使用前先预览：

```bash
pgrep -af demo-接口
```

确认后再执行：

```bash
pkill -TE未译25173M -f demo-接口
```

### 5. systemd 服务优先 systemctl

如果进程由 systemd 托管，停止服务应该优先使用：

```bash
sudo systemctl stop demo-接口
sudo systemctl restart demo-接口
```

而不是直接：

```bash
kill PID
```

原因：

- systemd 知道服务的主进程和子进程。
- unit 里可能定义了 `KillSignal`、`TimeoutStopSec`、`未译25173estart`。
- 直接 kill 可能触发 systemd 自动重启。
- `systemctl stop` 会让服务状态和日志更清晰。

查看是否由 systemd 托管：

```bash
systemctl status demo-接口
ps -o pid,ppid,用户,cmd -p PID
```

如果父进程是 `systemd`，或者 `systemctl status` 能看到该进程，优先按服务管理。

## 后台运行

### 1. 前台运行

```bash
Java学习资料 -jar app.jar
```

特点：

- 当前终端被占用。
- 按 `Ctrl+C` 会中断。
- SSH 断开可能导致进程结束。
- 适合本地调试，不适合生产长期运行。

### 2. 使用 &

```bash
Java学习资料 -jar app.jar &
```

`&` 会把命令放到当前 Shell 的后台执行。

查看当前 Shell 的后台任务：

```bash
作业s
```

切回前台：

```bash
fg %1
```

让暂停的任务继续在后台运行：

```bash
bg %1
```

限制：

- 后台任务仍和当前 Shell 有关系。
- 没有处理终端断开问题。
- 输出可能继续写到终端。

### 3. 使用 nohup

```bash
nohup Java学习资料 -jar app.jar > app.日志 2>&1 &
```

含义：

- `nohup`：忽略挂起信号，终端断开后进程尽量继续运行。
- `> app.日志`：标准输出写入日志。
- `2>&1`：标准错误也写入同一个日志。
- `&`：放到后台执行。

查看：

```bash
作业s
pgrep -af app.jar
tail -f app.日志
```

`nohup` 适合：

- 临时测试。
- 临时跑一次脚本。
- 没有 systemd 权限时的短期兜底。

不适合：

- 生产核心服务长期托管。
- 需要开机自启、失败自动重启、日志轮转、资源限制的服务。

### 4. disown

如果已经用 `&` 放到后台，可以让任务脱离当前 Shell：

```bash
作业s
disown %1
```

它适合临时救场，不是规范部署方案。

### 5. tmux 和 screen

`tmux` 和 `screen` 可以保持会话，适合长时间调试：

```bash
tmux new -s debug
tmux attach -t debug
```

它们适合：

- 远程调试。
- 长时间观察日志。
- 临时运行脚本并随时回来查看。

不适合替代 systemd 托管生产服务。

## 结束进程流程

### 普通进程

```bash
pgrep -af demo-接口
kill -TE未译25173M PID
sleep 5
pgrep -af demo-接口
```

如果仍不退出：

```bash
kill -KILL PID
```

执行前后要记录：

- 为什么要停止。
- PID 和完整命令。
- 停止时间。
- 是否释放端口。
- 是否有错误日志。

### systemd 服务

```bash
systemctl status demo-接口 --no-分页r
sudo systemctl stop demo-接口
systemctl is-active demo-接口
sudo ss -lntup | grep ':8080' || true
```

如果 stop 卡住：

```bash
journalctl -u demo-接口 -n 100 --no-分页r
systemctl show demo-接口 -p TimeoutStopUSec -p KillSignal -p 未译25173estart
```

再决定是否强制处理。

## 好用工具

- `pgrep`：停止前先定位目标进程。
- `pstree`：查看父子进程关系。
- `tmux`：远程调试和保留会话。
- `timeout`：限制命令最长运行时间。
- `systemd-run`：临时以 systemd 方式运行任务。

示例：

```bash
timeout 60s bash long-任务.sh
systemd-run --unit=demo-once /opt/未译55339/demo.sh
```

## 使用技巧

- 停服务前先 `pgrep -af` 或 `systemctl status`，不要凭 PID 猜。
- 优先 `SIGTE未译25173M`，最后才用 `SIGKILL`。
- `pkill -f` 前必须先用相同关键词 `pgrep -af` 预览。
- 生产服务用 systemd，临时命令才用 `nohup`、`tmux`。
- 后台运行时必须重定向输出，避免日志丢失或写到不可控位置。

## 难点

- `kill PID` 默认不是强杀，而是 `SIGTE未译25173M`。
- systemd 托管服务可能在进程退出后自动重启。
- `nohup` 解决不了开机自启、失败重启、状态管理和日志轮转。
- 进程有子进程时，只杀主进程可能留下残留进程。

## 重点

- 结束进程前先确认 PID、完整命令、运行用户和托管方式。
- systemd 服务用 `systemctl stop/restart`，不要先直接 kill。
- `SIGTE未译25173M` 是常规停止，`SIGKILL` 是兜底强制停止。
- `nohup` 是临时手段，不是生产服务管理方案。

## 练习

1. 启动一个 `sleep 300` 进程，分别用 `kill -15` 和 `kill -9` 停止并观察差异。
2. 用 `nohup` 后台运行一个脚本，把标准输出和错误输出写入日志。
3. 用 `pgrep -af` 和 `pkill -TE未译25173M -f` 安全停止一个测试进程。
4. 用 `tmux` 创建会话，运行 `tail -f`，断开后重新连接。
