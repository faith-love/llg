# 05 环境变量与配置

## 作用

环境变量与配置决定应用运行在哪个环境、连接哪个数据库、监听哪个端口、使用哪个密钥、加载哪些功能开关。它们是部署项目时最容易“本地正常、服务器失败”的地方。这个章节重点区分临时生效、用户持久生效、全局生效、systemd 服务生效、容器生效和应用内部配置。

## 痛点

- 终端里 `echo $JAVA_HOME` 有值，但 systemd 启动的服务读不到。
- 修改 `.bashrc` 后服务配置没有变化。
- `.env` 文件写了密钥，却被提交到代码仓库。
- 多个配置来源互相覆盖，不知道最终生效的是哪个。
- 改了环境变量没有重启进程，旧进程仍使用旧配置。

## 环境变量基础

查看变量：

```bash
env
printenv
echo $PATH
echo $JAVA_HOME
```

临时设置：

```bash
export APP_ENV=prod
export SERVER_PORT=8080
```

只对单条命令生效：

```bash
APP_ENV=prod SERVER_PORT=8080 java -jar app.jar
```

注意：临时变量只对当前 Shell 及其子进程有效。关闭终端后失效。

## PATH

`PATH` 决定输入命令时系统去哪些目录找可执行文件。

```bash
echo $PATH
which java
command -v nginx
```

添加路径：

```bash
export PATH="/opt/jdk/bin:$PATH"
```

使用技巧：

- 路径放在前面会优先匹配。
- 不要把当前目录 `.` 随意加入 PATH，容易有安全风险。
- 多版本软件并存时，要用 `which` 或 `command -v` 确认实际执行的是哪个。

## 用户级持久配置

常见文件：

| 文件 | 作用 |
| --- | --- |
| `~/.bashrc` | 交互式 Bash 常用配置 |
| `~/.profile` | 登录 Shell 常用配置 |
| `~/.bash_profile` | 某些发行版登录 Bash 使用 |

示例：

```bash
echo 'export APP_ENV=dev' >> ~/.bashrc
source ~/.bashrc
```

注意：这些文件通常只影响该用户的 Shell，不一定影响 systemd 服务。

## 全局配置

常见文件：

| 文件 | 作用 |
| --- | --- |
| `/etc/profile` | 全局 Shell 配置 |
| `/etc/profile.d/*.sh` | 推荐放全局脚本片段 |
| `/etc/environment` | 简单环境变量文件 |

示例：

```bash
sudo vim /etc/profile.d/java.sh
```

内容：

```bash
export JAVA_HOME=/opt/jdk
export PATH=$JAVA_HOME/bin:$PATH
```

注意：

- 全局配置会影响多个用户，改之前要确认影响范围。
- `/etc/environment` 不是 Shell 脚本，不支持复杂 Shell 语法。

## systemd 环境变量

systemd 启动服务时，不会自动读取你的 `.bashrc`。要在 unit 文件里显式配置。

方式一：直接写变量：

```ini
[Service]
Environment="APP_ENV=prod"
Environment="SERVER_PORT=8080"
```

方式二：使用环境文件：

```ini
[Service]
EnvironmentFile=/opt/apps/demo-api/shared/config/demo-api.env
```

环境文件内容：

```bash
APP_ENV=prod
SERVER_PORT=8080
DB_HOST=127.0.0.1
```

修改后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-api
sudo systemctl show demo-api -p Environment
```

## .env 文件

`.env` 常用于应用或框架读取：

```bash
APP_ENV=prod
SERVER_PORT=8080
DB_HOST=127.0.0.1
```

使用规则：

- `.env` 文件不要提交到公开仓库。
- 提交 `.env.example` 说明需要哪些变量。
- 生产环境 `.env` 文件权限建议 `600` 或 `640`。
- 明确由谁加载 `.env`：应用框架、启动脚本、Docker Compose，还是 systemd。

## 配置文件和环境变量的分工

推荐分工：

| 内容 | 推荐位置 |
| --- | --- |
| 端口、环境名、日志级别 | 环境变量或应用配置 |
| 数据库地址、Redis 地址 | 环境变量或外部配置文件 |
| 密码、Token、私钥 | 密钥管理系统或受控环境文件 |
| 业务规则默认值 | 应用配置文件 |
| 不同环境开关 | profile、环境变量、配置中心 |

原则：代码包不应该因为部署环境不同而重新打包。环境差异应由外部配置提供。

## 验证变量是否生效

当前 Shell：

```bash
echo $APP_ENV
env | grep APP
```

systemd 服务：

```bash
systemctl show demo-api -p Environment
journalctl -u demo-api -n 100
```

进程环境：

```bash
pid=$(pgrep -f demo-api | head -n 1)
sudo tr '\0' '\n' < /proc/$pid/environ | grep APP_ENV
```

注意：`/proc/$pid/environ` 可能包含敏感信息，查看和输出时要谨慎。

## 常见覆盖顺序

不同框架不同，但常见顺序是：

1. 默认配置。
2. 配置文件。
3. profile 配置。
4. 环境变量。
5. 命令行参数。

例如 Java Spring Boot 中，命令行参数通常优先级较高：

```bash
java -jar app.jar --server.port=8081
```

## 难点

- 修改环境变量不会影响已经运行的进程，必须重启进程。
- `.bashrc` 对 systemd 服务通常无效。
- `source ~/.bashrc` 只影响当前 Shell。
- 环境变量可被子进程继承，但父进程不会收到子进程新增的变量。
- 密钥放进环境变量后，可能被进程环境、日志或诊断工具看到。

## 重点

- 明确配置来源和生效范围。
- systemd 服务变量写在 unit 或 `EnvironmentFile`。
- `.env` 不进仓库，仓库里放 `.env.example`。
- 改配置后要验证“当前进程实际拿到的值”。
- 密钥按最小暴露原则管理。

## 练习

1. 在当前 Shell 设置 `APP_ENV=dev`，用 `env | grep` 验证。
2. 把变量写入 `~/.bashrc`，重新打开终端验证是否持久。
3. 写一个简单 systemd 服务，通过 `EnvironmentFile` 注入变量。
4. 修改变量后不重启服务，观察进程环境是否变化，再重启验证。


## 拆分专题

- [环境变量基础与 PATH](01-环境变量基础与PATH.md)：掌握 env、printenv、export、PATH、which、command -v。
- [用户级与全局环境变量](02-用户级与全局环境变量.md)：理解 .bashrc、.profile、/etc/profile、/etc/environment 的生效范围。
- [systemd 服务环境变量](03-systemd服务环境变量.md)：用 Environment 和 EnvironmentFile 给服务注入变量，并验证进程实际环境。
- [.env 文件与密钥配置](04-env文件与密钥配置.md)：区分 .env、.env.example、密钥文件和仓库提交边界。
- [配置优先级与生效验证](05-配置优先级与生效验证.md)：理解默认配置、配置文件、环境变量、命令行参数之间的覆盖关系。
