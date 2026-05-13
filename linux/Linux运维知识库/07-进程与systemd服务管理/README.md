# 07 进程与 systemd 服务管理

## 作用

进程与服务管理解决“项目如何长期稳定运行”的问题。手动执行 `java -jar app.jar` 只能临时启动，终端断开后可能停止，也没有开机自启、日志管理和状态检查。生产环境通常用 systemd 托管服务。

## 痛点

- 项目手动启动后，关闭终端服务就停了。
- 端口被占用，不知道哪个进程占着。
- 杀错进程导致其他服务异常。
- systemd 服务启动失败，但只看应用日志看不出原因。
- 修改 unit 文件后忘记 `daemon-reload`，配置不生效。

## 查看进程

```bash
ps aux
ps aux | grep demo-api
pgrep -af demo-api
top
htop
```

常见字段：

- `USER`：进程所属用户。
- `PID`：进程 ID。
- `%CPU`、`%MEM`：CPU 和内存占用。
- `COMMAND`：启动命令。

查端口对应进程：

```bash
ss -lntup
sudo lsof -i :8080
```

## 结束进程

```bash
kill PID
kill -15 PID
kill -9 PID
pkill -f demo-api
```

信号区别：

- `SIGTERM`，编号 15，请进程正常退出，默认推荐。
- `SIGKILL`，编号 9，强制杀死，进程没有清理机会。

使用规则：

- 先确认 PID 和命令。
- 优先 `kill -15`。
- 只有进程无法正常退出时才用 `kill -9`。
- 对 systemd 托管服务，优先用 `systemctl stop`。

## 前台、后台和临时运行

前台运行：

```bash
java -jar app.jar
```

后台运行：

```bash
nohup java -jar app.jar > app.log 2>&1 &
```

查看后台任务：

```bash
jobs
```

注意：`nohup` 适合临时测试，不是长期生产托管方案。生产服务优先用 systemd。

## systemd 基础

常用命令：

```bash
systemctl status demo-api
sudo systemctl start demo-api
sudo systemctl stop demo-api
sudo systemctl restart demo-api
sudo systemctl reload nginx
sudo systemctl enable demo-api
sudo systemctl disable demo-api
systemctl is-active demo-api
systemctl is-enabled demo-api
```

含义：

- `start` 启动。
- `stop` 停止。
- `restart` 重启。
- `reload` 重新加载配置，不一定重启进程，取决于服务是否支持。
- `enable` 设置开机自启。
- `status` 查看状态和最近日志。

## systemd unit 文件

示例：`/etc/systemd/system/demo-api.service`

```ini
[Unit]
Description=Demo API Service
After=network.target

[Service]
User=app
Group=app
WorkingDirectory=/opt/apps/demo-api/current
EnvironmentFile=/opt/apps/demo-api/shared/config/demo-api.env
ExecStart=/usr/bin/java -jar /opt/apps/demo-api/current/app.jar
Restart=on-failure
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

字段说明：

- `Description`：服务说明。
- `After`：启动顺序依赖，不等于强依赖。
- `User`、`Group`：服务运行用户。
- `WorkingDirectory`：工作目录。
- `EnvironmentFile`：环境变量文件。
- `ExecStart`：启动命令。
- `Restart`：失败时是否自动重启。
- `WantedBy`：enable 时挂到哪个 target。

修改 unit 后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-api
sudo systemctl status demo-api
```

## 查看 systemd 日志

```bash
journalctl -u demo-api
journalctl -u demo-api -n 100
journalctl -u demo-api -f
journalctl -u demo-api --since "1 hour ago"
```

排障时先看：

```bash
systemctl status demo-api
journalctl -u demo-api -n 200
```

## 服务启动失败排查

顺序：

1. `systemctl status demo-api` 看退出码和错误摘要。
2. `journalctl -u demo-api -n 200` 看详细日志。
3. 确认 `ExecStart` 命令路径存在。
4. 确认 `User=` 有权限读取 jar、配置和写日志。
5. 确认环境变量文件存在且格式正确。
6. 手动切换到服务用户测试命令。

示例：

```bash
sudo -u app /usr/bin/java -jar /opt/apps/demo-api/current/app.jar
```

## 资源限制

systemd 可以限制资源：

```ini
[Service]
LimitNOFILE=65535
MemoryMax=1G
```

常见用途：

- 提高文件句柄上限。
- 避免某个服务吃光内存。
- 给服务设置运行边界。

## 难点

- `After=network.target` 只表示顺序，不保证网络完全可用。
- 修改 unit 文件后必须 `daemon-reload`。
- `systemctl restart` 会中断服务，要确认业务影响。
- systemd 环境和登录 Shell 环境不同。
- `Restart=always` 可能掩盖频繁崩溃问题，要配合日志查看。

## 重点

- 生产服务优先用 systemd 托管。
- 服务运行用户、工作目录、环境文件和启动命令必须明确。
- 排障先看 `systemctl status` 和 `journalctl`。
- 不要长期依赖 `nohup` 管理核心服务。

## 练习

1. 写一个简单脚本，每 5 秒输出一次时间，用 systemd 托管。
2. 故意把 `ExecStart` 路径写错，观察 `status` 和 `journalctl`。
3. 给服务配置 `EnvironmentFile`，在脚本中打印变量。
4. 配置 `Restart=on-failure`，让脚本异常退出，观察自动重启。


## 拆分专题

- [进程查看与端口占用](01-进程查看与端口占用.md)：用 ps、pgrep、top、ss、lsof 判断进程和端口状态。
- [kill 信号与后台运行](02-kill信号与后台运行.md)：理解 SIGTERM、SIGKILL、nohup、jobs，以及临时运行和长期服务的边界。
- [systemctl 常用命令](03-systemctl常用命令.md)：掌握 status、start、stop、restart、reload、enable、is-active。
- [systemd unit 文件编写](04-systemd-unit文件编写.md)：理解 Unit、Service、Install、User、WorkingDirectory、ExecStart。
- [journalctl 日志与服务失败排查](05-journalctl日志与服务失败排查.md)：服务启动失败时用 status、journalctl、手动切换用户执行命令定位。
