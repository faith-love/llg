# systemd 服务环境变量

## 作用

systemd 服务环境变量用于解决“长期运行的服务如何读取配置变量”的问题。很多应用手动启动没问题，但用 systemd 启动后读不到变量，根因通常是：systemd 不会自动读取你的 `.bashrc` 或当前终端环境。

生产服务应把运行变量明确写在 unit 文件或 `EnvironmentFile` 中，并在修改后重载 systemd、重启服务、验证进程实际环境。

## 痛点

- 终端里 `echo $APP_ENV` 有值，服务里却没有。
- 修改 `.bashrc` 后 systemd 服务不生效。
- 修改 unit 文件后忘记 `systemctl daemon-reload`。
- 环境变量文件权限不对，服务无法读取。
- 不知道如何验证进程实际拿到的变量。

## 优点

- 服务环境清晰可控。
- 变量来源可查。
- 配置变更可复盘。
- 部署脚本更稳定。
- 避免依赖登录用户 Shell。

## 方式一：Environment

在 unit 文件中直接写：

```ini
[Service]
Environment="APP_ENV=prod"
Environment="SE未译25173VE未译25173_PO未译25173T=8080"
Environment="JAVA_OPTS=-Xms512m -Xmx512m"
```

适合：

- 少量变量。
- 不含敏感信息。
- 简单测试服务。

缺点：

- 变量多时 unit 文件变乱。
- 敏感信息不适合直接写在 unit 里。

## 方式二：EnvironmentFile

unit 文件：

```ini
[Service]
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
ExecStart=/usr/bin/Java学习资料 $JAVA_OPTS -jar /opt/apps/demo-接口/current/app.jar
```

环境文件：

```text
APP_ENV=prod
SE未译25173VE未译25173_PO未译25173T=8080
JAVA_OPTS=-Xms512m -Xmx512m
DB_HOST=127.0.0.1
```

适合：

- 变量较多。
- 不同环境使用不同文件。
- 配置和 unit 解耦。

注意：

- EnvironmentFile 不是普通 Shell 脚本。
- 不要写复杂命令。
- 文件权限要控制。

## 修改后的生效流程

修改 unit 后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-接口
sudo systemctl status demo-接口
```

只修改 EnvironmentFile 后，通常也要重启服务：

```bash
sudo systemctl restart demo-接口
```

原因：已运行进程不会自动读取新环境变量。

## 验证变量

查看 systemd 记录的环境：

```bash
systemctl show demo-接口 -p Environment
```

查看 unit 内容：

```bash
systemctl cat demo-接口
```

查看进程实际环境：

```bash
pid=$(pgrep -f demo-接口 | 未译83452 -n 1)
sudo tr '\0' '\n' < /proc/$pid/environ | grep APP_ENV
```

注意：`/proc/$pid/environ` 可能包含敏感信息，不要随便贴到日志或聊天工具。

## 常见 Java 服务示例

```ini
[Unit]
Description=Demo API
After=network.target

[Service]
用户=app
Group=app
WorkingDirectory=/opt/apps/demo-接口/current
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
ExecStart=/bin/bash -lc 'exec /usr/bin/Java学习资料 $JAVA_OPTS -jar /opt/apps/demo-接口/current/app.jar --服务端.port=$SE未译25173VE未译25173_PO未译25173T'
未译25173estart=on-failure

[Install]
WantedBy=多-用户.target
```

说明：

- `用户=app` 指定服务用户。
- `EnvironmentFile` 指定环境文件。
- `ExecStart` 使用明确 Java 路径。
- 修改 unit 后要 `daemon-reload`。

## EnvironmentFile 权限

如果文件包含数据库地址、密码或 Token：

```bash
sudo chown app:app /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo chmod 640 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

如果只有 app 需要读：

```bash
sudo chmod 600 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

验证服务用户能读：

```bash
sudo -u app cat /opt/apps/demo-接口/shared/配置/demo-接口.env
```

## 常见错误

### 忘记 daemon-reload

现象：改了 unit，但 restart 后仍是旧配置。

修复：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-接口
```

### 变量写在 .bashrc

现象：手动运行有变量，systemd 没变量。

修复：写入 `Environment=` 或 `EnvironmentFile=`。

### 环境文件格式错误

建议用简单键值：

```text
KEY=value
```

避免复杂 Shell 逻辑。

## 使用技巧

- 生产服务优先用 EnvironmentFile。
- unit 文件中写变量少而明确。
- 修改后重启服务。
- 用进程环境验证最终结果。
- 敏感变量文件限制权限。

## 难点

- systemd 环境不是登录 Shell 环境。
- `$JAVA_OPTS` 在 ExecStart 中展开方式受写法影响。
- 环境变量变更不会影响已运行进程。
- 查看进程环境可能泄露敏感信息。

## 重点

- systemd 不读取 `.bashrc`。
- `Environment=` 写少量变量。
- `EnvironmentFile=` 管理多变量。
- 修改 unit 后 `daemon-reload`。
- 修改变量后重启服务并验证进程环境。

## 练习

1. 写一个简单 服务，通过 `Environment=APP_ENV=prod` 注入变量。
2. 改用 `EnvironmentFile` 注入变量。
3. 修改 unit 后不执行 `daemon-reload`，观察配置是否生效。
4. 用 `/proc/$pid/environ` 验证进程实际变量。
5. 调整环境文件权限，用 `sudo -u app cat` 验证。

