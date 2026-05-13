# Java Jar 部署模板

## 作用

Java Jar 部署模板用于把 Spring Boot 或其他 Java 可执行 Jar 稳定运行在 Linux 服务器上。重点不是 `java -jar app.jar` 这一条命令，而是版本目录、环境变量、JDK 路径、systemd 托管、日志、端口、健康检查、回滚这些配套环节。

适用场景：

- Spring Boot 后端 API。
- 定时任务型 Java 服务。
- 单体 Jar 服务。
- 内网微服务节点。

## 痛点

- 手工执行 `java -jar` 正常，写进 systemd 后找不到 Java 或配置。
- 服务器默认 Java 版本不符合项目要求。
- 新 jar 覆盖旧 jar，线上异常时无法快速回滚。
- JVM 参数写在临时命令里，重启后没人知道实际配置。
- 服务启动成功，但健康检查失败，Nginx 仍然转发到异常实例。

## 部署前检查

### 1. 确认项目要求

从项目文件中确认：

```bash
grep -n '<java.version>' pom.xml
grep -n 'sourceCompatibility\\|targetCompatibility' build.gradle
grep -n 'org.springframework.boot' pom.xml build.gradle 2>/dev/null
```

要明确：

- JDK 大版本：8、11、17、21。
- 是否 Spring Boot 可执行 Jar。
- 端口配置方式。
- 配置文件加载方式。
- 健康检查接口是否存在。

### 2. 检查 JDK

```bash
java -version
javac -version
which java
readlink -f "$(command -v java)"
```

如果 systemd 使用绝对路径，要记录真实 Java 路径：

```bash
JAVA_BIN=$(readlink -f "$(command -v java)")
echo "$JAVA_BIN"
```

### 3. 检查端口

```bash
sudo ss -lntup | grep ':8080' || true
```

如果端口已占用：

```bash
sudo lsof -iTCP:8080 -sTCP:LISTEN
```

先判断占用者，不要直接杀进程。

## 目录结构

推荐：

```text
/opt/apps/demo-api/
  current -> releases/2026-05-11-120000
  releases/
    2026-05-11-120000/
      app.jar
  shared/
    config/
      demo-api.env
      application.yml
    logs/
    tmp/
```

初始化：

```bash
sudo useradd -r -s /usr/sbin/nologin app 2>/dev/null || true
sudo mkdir -p /opt/apps/demo-api/{releases,shared/config,shared/logs,shared/tmp}
sudo chown -R app:app /opt/apps/demo-api
sudo chmod 750 /opt/apps/demo-api
```

## 上传和发布 Jar

上传到临时目录：

```bash
scp target/demo-api.jar user@server:/tmp/app.jar
```

在服务器创建 release：

```bash
release=$(date +%F-%H%M%S)
base=/opt/apps/demo-api

sudo mkdir -p $base/releases/$release
sudo cp /tmp/app.jar $base/releases/$release/app.jar
sudo chown -R app:app $base/releases/$release
sudo chmod 640 $base/releases/$release/app.jar
sudo ln -sfn $base/releases/$release $base/current
```

验证：

```bash
ls -lh /opt/apps/demo-api/current/app.jar
readlink -f /opt/apps/demo-api/current
sha256sum /opt/apps/demo-api/current/app.jar
```

## 环境变量文件

创建：

```bash
sudo install -o app -g app -m 640 /dev/null /opt/apps/demo-api/shared/config/demo-api.env
sudo vim /opt/apps/demo-api/shared/config/demo-api.env
```

示例：

```bash
APP_ENV=prod
SERVER_PORT=8080
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
JAVA_OPTS=-Xms512m -Xmx512m -XX:+UseG1GC -Dfile.encoding=UTF-8
SPRING_PROFILES_ACTIVE=prod
```

注意：

- systemd 的 `EnvironmentFile` 中不要写 `export`。
- 等号两边不要加空格。
- 含空格的值要注意引号规则，复杂参数可放到启动脚本中。
- 密码、密钥文件权限要控制在服务用户和运维用户可读范围。

## 外部配置文件

如果使用 Spring Boot，可以把生产配置放在 shared：

```bash
/opt/apps/demo-api/shared/config/application.yml
```

systemd 中通过参数指定：

```bash
--spring.config.additional-location=/opt/apps/demo-api/shared/config/application.yml
```

好处：

- 新版本 Jar 不覆盖生产配置。
- 配置变更可单独备份和审计。
- 回滚代码时配置仍保持稳定。

## systemd 服务模板

文件：`/etc/systemd/system/demo-api.service`

```ini
[Unit]
Description=Demo API Java Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/apps/demo-api/current
EnvironmentFile=/opt/apps/demo-api/shared/config/demo-api.env
ExecStart=/bin/bash -lc 'exec $JAVA_HOME/bin/java $JAVA_OPTS -jar /opt/apps/demo-api/current/app.jar --server.port=$SERVER_PORT --spring.config.additional-location=/opt/apps/demo-api/shared/config/application.yml'
Restart=on-failure
RestartSec=5
SuccessExitStatus=143
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
```

如果不设置 `JAVA_HOME`，可以写绝对路径：

```ini
ExecStart=/usr/bin/java -jar /opt/apps/demo-api/current/app.jar
```

但生产环境建议明确 JDK 路径，避免系统默认 Java 被切换。

生效：

```bash
sudo systemd-analyze verify /etc/systemd/system/demo-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now demo-api
```

## 启动验证

服务状态：

```bash
systemctl status demo-api --no-pager
systemctl is-active demo-api
systemctl is-enabled demo-api
```

日志：

```bash
journalctl -u demo-api -n 200 --no-pager
journalctl -u demo-api -f
```

端口：

```bash
sudo ss -lntup | grep ':8080'
```

健康检查：

```bash
curl -f http://127.0.0.1:8080/actuator/health
```

如果接口返回 JSON，可以用：

```bash
curl -s http://127.0.0.1:8080/actuator/health | jq .
```

## Nginx 反向代理

常见配置：

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

检查：

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I http://api.example.com
```

## 回滚

查看当前版本：

```bash
readlink -f /opt/apps/demo-api/current
ls -lt /opt/apps/demo-api/releases
```

切换旧版本：

```bash
old=/opt/apps/demo-api/releases/2026-05-10-180000
sudo test -f $old/app.jar
sudo ln -sfn $old /opt/apps/demo-api/current
sudo systemctl restart demo-api
```

验证：

```bash
systemctl status demo-api --no-pager
journalctl -u demo-api -n 100 --no-pager
curl -f http://127.0.0.1:8080/actuator/health
```

回滚前要判断：

- 数据库迁移是否兼容旧代码。
- 配置是否和旧版本兼容。
- 旧版本 release 是否完整。
- 线上流量是否需要先摘除实例。

## 好用工具

- `jcmd`：查看 Java 进程参数、线程、堆信息。
- `jstack`：线程栈排查。
- `jmap`：堆转储和内存排查。
- `curl` 和 `jq`：健康检查验证。
- `systemctl` 和 `journalctl`：服务托管和日志。
- `sha256sum`：确认 Jar 产物一致性。

常用 Java 排查：

```bash
pid=$(pgrep -f 'demo-api.*app.jar')
jcmd $pid VM.command_line
jcmd $pid VM.system_properties
jcmd $pid Thread.print | head
```

## 使用技巧

- `ExecStart` 中使用 Java 绝对路径或明确 `JAVA_HOME`。
- JVM 参数写进 env 文件或启动脚本，不要散落在临时命令中。
- Jar、配置、日志分目录保存，避免发布覆盖。
- 每次发布后记录 Jar 校验值和 current 指向。
- 健康检查通过前不要切正式流量。

## 难点

- systemd 不读取 `.bashrc`，手工能启动不代表服务能启动。
- Java 收到 SIGTERM 后退出码可能是 143，可用 `SuccessExitStatus=143` 处理。
- 内存参数过大可能导致服务启动即失败或被 OOM killer 处理。
- Spring 配置优先级较多，实际生效配置要结合启动日志确认。
- 数据库迁移会影响回滚可行性。

## 重点

- Java Jar 部署要固定 JDK、目录、配置、服务和日志。
- systemd 托管比 `nohup java -jar` 更适合生产。
- 启动验证要看服务、端口、日志、健康检查和代理访问。
- 回滚不只是切 Jar，还要确认配置和数据库兼容。

## 练习

1. 部署一个简单 Spring Boot Jar，用 systemd 托管并设置开机自启。
2. 把 `SERVER_PORT` 放到 env 文件中，验证修改后重启生效。
3. 故意配置错误的 Java 路径，用 `journalctl` 定位失败原因。
4. 创建两个 release，切换 current 完成一次回滚。
