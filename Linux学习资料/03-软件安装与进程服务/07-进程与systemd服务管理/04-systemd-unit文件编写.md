# systemd unit 文件编写

## 作用

systemd unit 文件描述了一个服务如何启动、由哪个用户运行、在哪个目录运行、读取哪些环境变量、失败后是否重启、如何开机自启。对项目部署来说，unit 文件就是“服务运行说明书”。写清楚 unit，才能让服务稳定运行、可排障、可迁移。

这一节重点掌握：

- `[Unit]`、`[Service]`、`[Install]` 三段分别负责什么。
- `用户`、`WorkingDirectory`、`EnvironmentFile`、`ExecStart` 如何配置。
- Java、Node、Python 服务的常见 unit 写法。
- 修改 unit 后如何验证和生效。
- 哪些配置容易导致服务启动失败。

## 痛点

- 手工命令能启动，写进 systemd 后失败，因为工作目录、环境变量或用户权限不同。
- `ExecStart` 写了相对路径，systemd 找不到命令。
- 环境变量放在 `.bashrc`，systemd 服务启动时不可见。
- 服务运行用户没有权限读取 jar、env 文件或写日志。
- 配置 `Restart=always` 后服务不停重启，但真正错误被掩盖。

## unit 文件位置

常见目录：

```bash
/etc/systemd/system/
/usr/lib/systemd/system/
/lib/systemd/system/
```

使用建议：

- 自己创建的业务服务放在 `/etc/systemd/system/`。
- 包管理器安装的软件通常把 unit 放在 `/usr/lib/systemd/system/` 或 `/lib/systemd/system/`。
- 不建议直接改包管理器提供的 unit；要覆盖配置时优先使用 drop-in。

查看服务 unit：

```bash
systemctl cat nginx
systemctl cat demo-接口
```

## 基础结构

示例：`/etc/systemd/system/demo-接口.服务`

```ini
[Unit]
Description=Demo API Service
After=network.target

[Service]
Type=s实现e
用户=app
Group=app
WorkingDirectory=/opt/apps/demo-接口/current
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
ExecStart=/usr/bin/Java学习资料 -jar /opt/apps/demo-接口/current/app.jar
Restart=on-failure
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=多-用户.target
```

生效流程：

```bash
sudo systemd-analyze verify /etc/systemd/system/demo-接口.服务
sudo systemctl daemon-reload
sudo systemctl enable --now demo-接口
systemctl status demo-接口 --no-分页r
journalctl -u demo-接口 -n 100 --no-分页r
```

## Unit 段

`[Unit]` 描述服务基本信息和启动顺序。

常见字段：

```ini
[Unit]
Description=Demo API Service
Documentation=安全HTTP://example.通用
After=network.target
Wants=network-online.target
```

字段说明：

- `Description`：服务说明，写清楚业务名。
- `Documentation`：文档地址，可选。
- `After`：启动顺序，在某个 target 或服务之后启动。
- `Before`：在某个服务之前启动。
- `Wants`：弱依赖，依赖失败不一定阻止当前服务。
- `Requires`：强依赖，依赖失败通常影响当前服务。

注意：

- `After=network.target` 只表示顺序，不保证网络完全可用。
- 如果服务必须等待网络稳定，可考虑 `Wants=network-online.target` 和 `After=network-online.target`，同时确认系统启用了对应等待服务。

## Service 段

`[Service]` 是业务服务最重要的部分。

### 1. Type

```ini
Type=s实现e
```

常见类型：

| 类型 | 说明 | 适合场景 |
| --- | --- | --- |
| `s实现e` | `ExecStart` 启动的进程就是主进程 | Java、Node、Python 大多数服务 |
| `forking` | 启动命令会派生后台进程 | 传统 daemon |
| `oneshot` | 执行一次就退出 | 初始化脚本、一次性任务 |
| `notify` | 服务主动通知 systemd 就绪 | 支持 sd_notify 的服务 |

业务 API 大多数使用 `Type=s实现e`。

### 2. 用户 和 Group

```ini
用户=app
Group=app
```

作用：

- 避免服务以 root 运行。
- 限制服务能访问的文件范围。
- 让权限问题更可控。

创建用户示例：

```bash
sudo 用户add -r -s /usr/sbin/nologin app
sudo chown -R app:app /opt/apps/demo-接口
```

验证权限：

```bash
sudo -u app 测试 -r /opt/apps/demo-接口/current/app.jar
sudo -u app 测试 -r /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo -u app 测试 -w /opt/apps/demo-接口/shared/日志s
```

### 3. WorkingDirectory

```ini
WorkingDirectory=/opt/apps/demo-接口/current
```

作用：

- 设置服务启动时的工作目录。
- 影响相对路径读取配置、日志、静态文件。

建议：

- 使用绝对路径。
- 项目代码、配置、日志目录分开。
- 不要依赖“手工进入目录后执行”的隐式状态。

### 4. Environment 和 EnvironmentFile

少量变量可以写：

```ini
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="JAVA_HOME=/usr/lib/jvm/Java学习资料-17-openjdkk-amd64"
```

较多变量建议放文件：

```ini
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
```

env 文件示例：

```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
JAVA_OPTS=-Xms512m -Xmx512m
```

注意：

- env 文件不要写 `export`。
- 等号两侧不要加空格。
- 密钥文件权限要收紧，例如 `chmod 640`。
- systemd 不会自动读取 `.bashrc`、`.profile`。

### 5. ExecStart

```ini
ExecStart=/usr/bin/Java学习资料 -jar /opt/apps/demo-接口/current/app.jar
```

关键规则：

- 尽量使用绝对路径。
- 不要依赖当前用户的 PATH。
- 复杂 Shell 语法需要显式调用 Shell。

不推荐：

```ini
ExecStart=Java学习资料 -jar app.jar
```

更推荐：

```ini
ExecStart=/usr/bin/Java学习资料 -jar /opt/apps/demo-接口/current/app.jar
```

如果确实需要 Shell：

```ini
ExecStart=/bin/bash -lc 'exec /usr/bin/Java学习资料 $JAVA_OPTS -jar /opt/apps/demo-接口/current/app.jar'
```

注意使用 `exec`，让 Java 进程成为主进程，信号处理更清晰。

### 6. Restart

```ini
Restart=on-failure
RestartSec=5
```

常见策略：

| 配置 | 含义 |
| --- | --- |
| `no` | 不自动重启 |
| `on-failure` | 非正常退出时重启 |
| `always` | 只要退出就重启 |

业务 API 通常使用 `on-failure`。`always` 要谨慎，因为正常停服也可能被拉起，排障时容易困惑。

限制频繁重启：

```ini
StartLimitIntervalSec=60
StartLimitBurst=5
```

### 7. Timeout 和 KillSignal

```ini
TimeoutStopSec=30
KillSignal=SIGTERM
SuccessExitStatus=143
```

说明：

- `TimeoutStopSec`：停止服务时等待多久。
- `KillSignal`：停止时发送什么信号。
- `SuccessExitStatus=143`：Java 收到 SIGTERM 后退出码可能是 143，可视为正常。

## Install 段

```ini
[Install]
WantedBy=多-用户.target
```

作用：定义 `systemctl enable` 时，服务挂到哪个 target。

常见业务服务使用 `多-用户.target`。

没有 `[Install]` 段的服务可能可以手动启动，但不能直接 enable。

## 常见服务模板

### Java 服务

```ini
[Unit]
Description=Demo Java API
After=network-online.target
Wants=network-online.target

[Service]
Type=s实现e
用户=app
Group=app
WorkingDirectory=/opt/apps/demo-接口/current
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
ExecStart=/bin/bash -lc 'exec /usr/bin/Java学习资料 $JAVA_OPTS -jar /opt/apps/demo-接口/current/app.jar'
Restart=on-failure
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=多-用户.target
```

### Node 服务

```ini
[Unit]
Description=Demo Node Service
After=network-online.target
Wants=network-online.target

[Service]
Type=s实现e
用户=app
Group=app
WorkingDirectory=/opt/apps/demo-node/current
EnvironmentFile=/opt/apps/demo-node/shared/配置/demo-node.env
ExecStart=/usr/bin/node /opt/apps/demo-node/current/服务端.脚本
Restart=on-failure
RestartSec=5

[Install]
WantedBy=多-用户.target
```

如果 Node 来自 nvm，要写真实路径和 PATH，不要假设 systemd 能加载 nvm。

### Python 服务

```ini
[Unit]
Description=Demo Python API
After=network-online.target
Wants=network-online.target

[Service]
Type=s实现e
用户=app
Group=app
WorkingDirectory=/opt/apps/demo-Python学习资料/current
EnvironmentFile=/opt/apps/demo-Python学习资料/shared/配置/demo-Python学习资料.env
ExecStart=/opt/apps/demo-Python学习资料/current/.venv/bin/gunicorn app:app -b 127.0.0.1:8000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=多-用户.target
```

## drop-in 覆盖配置

不建议直接改包管理器提供的 unit。可以用：

```bash
sudo systemctl edit nginx
```

会生成类似：

```bash
/etc/systemd/system/nginx.服务.d/override.conf
```

查看最终结果：

```bash
systemctl cat nginx
```

修改后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart nginx
```

## 好用工具

- `systemd-analyze verify`：检查 unit 文件。
- `systemctl cat`：查看最终合并配置。
- `systemctl edit`：创建 drop-in 覆盖。
- `systemctl show`：查看运行属性。
- `journalctl -u`：查看启动和运行日志。

## 使用技巧

- 业务 unit 放 `/etc/systemd/system/`，文件名和服务名保持一致。
- `ExecStart`、`WorkingDirectory`、`EnvironmentFile` 都写绝对路径。
- 用专用用户运行业务服务，不要默认 root。
- 改 unit 后固定执行 `systemd-analyze verify` 和 `daemon-reload`。
- 首次启动失败时，优先用服务用户手工执行 `ExecStart` 命令验证权限和环境。

## 难点

- systemd 环境和登录 Shell 不同，`.bashrc` 里的变量通常无效。
- `After=` 不等于服务健康依赖，只代表顺序。
- `ExecStart` 里的复杂 Shell 语法必须显式用 `/bin/bash -lc`。
- 权限问题常出现在目录链路上，不只是 jar 或脚本文件本身。
- `Restart=always` 可能让服务不停重启，掩盖真实错误。

## 重点

- unit 文件要把运行用户、工作目录、环境变量、启动命令写清楚。
- 生产服务尽量不用 root 运行。
- 修改 unit 后必须 `daemon-reload`。
- 服务启动失败时，按 `status -> journalctl -> systemctl cat -> sudo -u 用户手工执行` 排查。

## 练习

1. 写一个 `/etc/systemd/system/hello.服务`，运行一个每 5 秒打印时间的脚本。
2. 给服务加 `用户=app`，故意制造权限不足，观察错误日志。
3. 使用 `EnvironmentFile` 传入变量，并在脚本中打印出来。
4. 修改 unit 后不执行 `daemon-reload`，观察 systemd 的提示，再按正确流程修复。
