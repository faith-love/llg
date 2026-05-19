# .env 文件与密钥配置

## 作用

`.env` 文件用于集中保存应用运行时需要的键值配置，例如环境名、端口、数据库地址、Redis 地址、日志级别等。密钥配置则用于管理密码、Token、私钥等敏感信息。这个知识点的核心是：配置要外置，密钥要受控，不能随代码随便提交。

## 痛点

- `.env` 写了数据库密码，被提交到 Git。
- `.env.example` 不完整，新环境部署不知道缺哪些变量。
- 应用、Docker Compose、systemd 都可能读取 `.env`，来源混乱。
- 密钥放在命令行参数里，被 history 或进程信息看到。
- 配置文件权限过宽，其他用户能读取敏感信息。

## 优点

- 应用包和环境配置解耦。
- 新环境部署更清楚需要哪些变量。
- 可以对敏感文件设置更严格权限。
- 可以减少代码中硬编码配置。

## .env 示例

```text
APP_ENV=prod
SERVER_PORT=8080
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=demo
REDIS_HOST=127.0.0.1
LOG_LEVEL=INFO
```

建议：

- 一行一个键值。
- 不加多余空格。
- 值中有空格时确认加载工具是否支持引号。
- 不写复杂 Shell 逻辑。

## .env.example

仓库里应该提交 `.env.example`，不提交真实 `.env`。

示例：

```text
APP_ENV=prod
SERVER_PORT=8080
DB_HOST=
DB_PORT=3306
DB_NAME=
REDIS_HOST=
LOG_LEVEL=INFO
```

作用：

- 告诉部署者需要哪些变量。
- 不暴露真实密码。
- 方便新环境初始化。

`忽略规则` 中应包含：

```text
.env
.env.*
!.env.example
```

具体规则要结合项目命名，避免误忽略 example 文件。

## 谁加载 .env

`.env` 本身不会自动生效，必须由某个工具或程序读取。

常见加载者：

| 加载者 | 场景 |
| --- | --- |
| 应用框架 | Node、Python、部分 Java 配置库 |
| Docker Compose | 通用pose 文件变量替换 |
| 启动脚本 | `source .env` 后启动 |
| systemd EnvironmentFile | systemd 读取键值 |

要明确：

- `.env` 放在哪里。
- 谁读取它。
- 读取后如何验证。

## systemd 使用 env 文件

```ini
[Service]
EnvironmentFile=/opt/apps/demo-接口/shared/配置/demo-接口.env
```

环境文件路径应放在 `shared/配置`，不要放在 release 目录，避免发布覆盖。

权限：

```bash
sudo chown app:app /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo chmod 640 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

## 密钥管理原则

密钥包括：

- 数据库密码。
- Redis 密码。
- API Token。
- JWT Secret。
- SSH 私钥。
- 云厂商 Access Key。

原则：

- 不进 Git。
- 不写进公开日志。
- 不直接写在命令行历史里。
- 不给无关用户读权限。
- 泄露后要能轮换。

## 权限设置

敏感 env 文件：

```bash
chmod 600 demo-接口.env
```

如果服务用户和部署用户同组：

```bash
chmod 640 demo-接口.env
```

查看：

```bash
ls -lah demo-接口.env
```

验证：

```bash
sudo -u app cat demo-接口.env
```

## 避免 history 泄露

不推荐：

```bash
mySQL学习资料 -u root -p明文密码
curl -H "Authorization: Bearer 明文Token" 安全HTTP://接口.example.通用
```

更好：

- 使用交互式输入密码。
- 使用受控配置文件。
- 使用 secret 管理服务。
- 排障输出时脱敏。

## 使用技巧

- `.env` 放真实配置，`.env.example` 放变量清单。
- 生产 env 文件放 `/opt/apps/应用/shared/配置`。
- 配置文件权限建议 `600` 或 `640`。
- 明确 `.env` 由谁加载。
- 日志里不要打印完整配置。

## 难点

- 不同框架对 `.env` 格式支持不同。
- Docker Compose 的 `.env` 和应用 `.env` 容易混淆。
- systemd EnvironmentFile 不等于完整 Shell 脚本。
- 环境变量本身也可能被诊断工具看到，不是绝对安全。

## 重点

- `.env` 不进仓库。
- `.env.example` 要进仓库。
- 密钥最小暴露。
- 权限控制和加载方式同样重要。
- 泄露后要能轮换。

## 练习

1. 创建 `.env` 和 `.env.example`，比较两者内容差异。
2. 写 `忽略规则` 规则忽略真实 `.env`。
3. 设置 env 文件为 `600`，用其他用户尝试读取。
4. 用 systemd `EnvironmentFile` 读取 env 文件。
5. 检查历史命令中是否出现过敏感信息。

