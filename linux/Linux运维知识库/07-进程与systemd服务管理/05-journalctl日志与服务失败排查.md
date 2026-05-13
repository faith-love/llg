# journalctl 日志与服务失败排查

## 作用

`journalctl` 用于查看 systemd 管理的系统日志和服务日志。服务启动失败、自动重启、权限不足、环境变量缺失、端口冲突、命令路径错误，很多关键信息都会出现在 `systemctl status` 和 `journalctl` 中。

这一节要建立一套服务失败排查流程：

1. 看服务状态和退出码。
2. 看最近日志和完整错误。
3. 看 unit 文件最终生效内容。
4. 检查命令路径、用户权限、环境变量、工作目录。
5. 切换到服务用户手工执行启动命令。
6. 修复后重载 systemd 并验证服务和业务。

## 痛点

- 服务启动失败，只看应用日志目录，却忽略了 systemd 日志。
- `systemctl status` 只显示几行，看不到完整错误栈。
- unit 文件改过，但没有 `daemon-reload`，排查方向走偏。
- root 手工运行正常，服务用户运行失败。
- 服务不断自动重启，日志被快速刷屏，真正的第一次错误没看到。

## 核心小点

### 1. systemctl status 先看摘要

```bash
systemctl status demo-api --no-pager
```

重点看：

- `Loaded`：unit 文件路径、是否 enabled。
- `Active`：是否 `failed`、退出时间。
- `Main PID`：主进程是否存在。
- `code` 和 `status`：退出原因。
- 最近几行日志：通常有直接错误。

常见示例：

```text
Active: failed (Result: exit-code)
Process: 1234 ExecStart=/usr/bin/java -jar /opt/app/app.jar (code=exited, status=1/FAILURE)
```

`status=1/FAILURE` 只说明进程异常退出，具体原因要继续看日志。

### 2. journalctl 查看服务日志

查看某个服务：

```bash
journalctl -u demo-api --no-pager
```

最近 100 行：

```bash
journalctl -u demo-api -n 100 --no-pager
```

实时跟踪：

```bash
journalctl -u demo-api -f
```

按时间过滤：

```bash
journalctl -u demo-api --since "1 hour ago" --no-pager
journalctl -u demo-api --since "2026-05-11 10:00:00" --until "2026-05-11 10:30:00" --no-pager
```

查看本次启动以来：

```bash
journalctl -u demo-api -b --no-pager
```

查看上一次启动：

```bash
journalctl -u demo-api -b -1 --no-pager
```

### 3. 日志优先级

只看错误：

```bash
journalctl -u demo-api -p err --no-pager
```

常见级别：

| 级别 | 含义 |
| --- | --- |
| `emerg` | 系统不可用 |
| `alert` | 必须立即处理 |
| `crit` | 严重错误 |
| `err` | 错误 |
| `warning` | 警告 |
| `info` | 普通信息 |
| `debug` | 调试信息 |

注意：只看 `err` 可能漏掉应用打印在标准输出里的关键信息。排障初期建议先看最近 100 到 300 行完整日志。

### 4. 查看 unit 最终配置

```bash
systemctl cat demo-api
systemctl show demo-api -p User -p Group -p WorkingDirectory -p ExecStart -p Environment -p Restart
```

为什么要看最终配置：

- unit 可能存在 drop-in 覆盖。
- 你编辑的文件未必是最终生效文件。
- systemd 使用的是 `daemon-reload` 后加载的配置。

如果修改过 unit，执行：

```bash
sudo systemctl daemon-reload
```

再重启服务：

```bash
sudo systemctl restart demo-api
```

### 5. 切换到服务用户执行命令

很多问题是“root 能运行，服务用户不能运行”。

查看服务用户：

```bash
systemctl show demo-api -p User -p Group
```

切换用户测试：

```bash
sudo -u app -H /usr/bin/java -jar /opt/apps/demo-api/current/app.jar
```

如果 unit 有工作目录：

```bash
cd /opt/apps/demo-api/current
sudo -u app -H /usr/bin/java -jar /opt/apps/demo-api/current/app.jar
```

如果 unit 使用 env 文件：

```bash
sudo -u app -H bash -lc 'set -a; source /opt/apps/demo-api/shared/config/demo-api.env; set +a; /usr/bin/java -jar /opt/apps/demo-api/current/app.jar'
```

注意：systemd 的 `EnvironmentFile` 格式和 Bash `source` 不完全一样，复杂值要谨慎。手工测试的目标是验证权限、路径和基本环境。

## 常见失败原因

### 1. ExecStart 路径错误

日志可能出现：

```text
Failed at step EXEC spawning /path/to/app: No such file or directory
```

检查：

```bash
systemctl cat demo-api
test -x /path/to/command
command -v java
readlink -f "$(command -v java)"
```

修复：

- `ExecStart` 使用绝对路径。
- 确认文件存在且可执行。
- 修改 unit 后 `daemon-reload`。

### 2. 权限不足

日志可能出现：

```text
Permission denied
```

检查：

```bash
systemctl show demo-api -p User -p Group
sudo -u app test -r /opt/apps/demo-api/current/app.jar
sudo -u app test -r /opt/apps/demo-api/shared/config/demo-api.env
sudo -u app test -w /opt/apps/demo-api/shared/logs
namei -l /opt/apps/demo-api/current/app.jar
```

`namei -l` 可以查看路径上每一级目录权限。很多权限问题不是文件本身，而是上级目录没有执行权限。

### 3. 环境变量缺失

表现：

- 命令行手动启动正常。
- systemd 启动失败。
- 日志提示找不到 `java`、`node`、配置项为空、数据库连接地址为空。

检查：

```bash
systemctl cat demo-api
systemctl show demo-api -p Environment
sudo systemctl show-environment
```

修复：

- 在 unit 中配置 `Environment=` 或 `EnvironmentFile=`。
- `ExecStart` 使用命令绝对路径。
- 不依赖 `.bashrc`、`.profile`、nvm 自动初始化。

### 4. 工作目录错误

表现：

- 应用提示找不到配置文件。
- 相对路径日志目录不存在。
- 静态资源路径异常。

检查：

```bash
systemctl show demo-api -p WorkingDirectory
sudo -u app test -d /opt/apps/demo-api/current
```

修复：

```ini
WorkingDirectory=/opt/apps/demo-api/current
```

并确保服务用户有进入目录的权限。

### 5. 端口冲突

日志可能出现：

```text
Address already in use
```

检查：

```bash
sudo ss -lntup | grep ':8080'
sudo lsof -iTCP:8080 -sTCP:LISTEN
```

处理：

- 判断占用进程是否旧版本服务。
- 如果是 systemd 托管，优先 `systemctl stop`。
- 不要直接 `kill -9` 未确认归属的进程。

### 6. 自动重启过快

查看重启情况：

```bash
systemctl status demo-api --no-pager
journalctl -u demo-api -n 300 --no-pager
systemctl show demo-api -p Restart -p NRestarts -p StartLimitBurst -p StartLimitIntervalUSec
```

如果服务进入 start-limit：

```bash
sudo systemctl reset-failed demo-api
```

但 `reset-failed` 只清理失败状态，不修复根因。要先看日志找到为什么重启。

## 日志持久化

有些系统默认 journal 日志只保存在内存中，重启后丢失。检查：

```bash
ls -ld /var/log/journal
grep -E '^#?Storage=' /etc/systemd/journald.conf
```

启用持久化常见方式：

```bash
sudo mkdir -p /var/log/journal
sudo systemctl restart systemd-journald
```

也可以在 `/etc/systemd/journald.conf` 中设置：

```ini
Storage=persistent
SystemMaxUse=1G
```

修改后：

```bash
sudo systemctl restart systemd-journald
```

生产环境要控制日志占用，避免日志填满磁盘。

## 排查流程模板

```bash
# 1. 看状态摘要
systemctl status demo-api --no-pager

# 2. 看最近日志
journalctl -u demo-api -n 200 --no-pager

# 3. 看最终 unit
systemctl cat demo-api
systemctl show demo-api -p User -p Group -p WorkingDirectory -p ExecStart -p Environment -p Restart

# 4. 查端口
sudo ss -lntup | grep ':8080' || true

# 5. 查路径和权限
namei -l /opt/apps/demo-api/current/app.jar
sudo -u app test -r /opt/apps/demo-api/current/app.jar

# 6. 修改后生效
sudo systemctl daemon-reload
sudo systemctl restart demo-api

# 7. 验证
systemctl is-active demo-api
curl -f http://127.0.0.1:8080/health
```

## 好用工具

- `journalctl -u`：查看服务日志。
- `systemctl cat`：确认最终 unit。
- `systemctl show`：查看 systemd 解析后的属性。
- `namei -l`：检查路径每一级权限。
- `ss` 和 `lsof`：检查端口占用。
- `systemd-analyze verify`：检查 unit 文件语法。

## 使用技巧

- `status` 看摘要，`journalctl` 看完整细节。
- 报权限问题时，用 `namei -l` 检查整条路径。
- 报命令找不到时，检查 `ExecStart` 绝对路径和 systemd 环境。
- 修改 unit 后，固定执行 `daemon-reload`。
- 修复后不只看服务 active，还要验证端口和健康检查接口。

## 难点

- 应用日志和 systemd 日志不是一回事，启动阶段错误常在 journal 里。
- root 手工执行成功，不代表服务用户能执行。
- 日志里最后一条错误不一定是根因，有时第一次失败更关键。
- 自动重启会让日志快速滚动，需要按时间或 `-n 300` 扩大范围。

## 重点

- 服务失败排查顺序：`status -> journalctl -> unit -> 权限/环境/端口 -> 服务用户手工执行 -> 修复验证`。
- systemd 环境很干净，不要假设它加载登录 Shell 配置。
- 权限要看目录链路，不只看目标文件。
- `reset-failed` 只能清状态，不能修服务。

## 练习

1. 写一个错误的 service，把 `ExecStart` 指向不存在的路径，观察 `status` 和 `journalctl`。
2. 创建一个服务用户无权读取的文件，观察权限错误并用 `namei -l` 定位。
3. 让两个测试服务监听同一个端口，练习用 `ss` 和 `lsof` 找冲突。
4. 开启 journal 持久化，并限制最大日志占用。
