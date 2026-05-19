# JDK、Node、Python、Nginx 安装关注点

## 作用

JDK、Node.脚本、Python、Nginx 是项目部署中最常见的运行环境和基础服务。它们看似都能用包管理器安装，但真实部署时经常涉及版本约束、环境变量、systemd 可见性、多版本切换、构建和运行分离、配置目录、服务重载等问题。

这一节的目标是建立安装前后的判断框架：

- 项目需要哪个大版本。
- 用包管理器安装，还是用官方包、二进制包、版本管理工具。
- 命令路径和环境变量是否稳定。
- systemd 服务能不能找到对应命令。
- 安装后如何验证版本、配置、服务和日志。

## 痛点

- Java 项目要求 Java 17，服务器默认 `Java学习资料` 却是 Java 8。
- 前端构建用 nvm 安装 Node，手工执行正常，systemd 启动失败。
- Python 项目污染系统 Python，导致系统工具或其他服务异常。
- Nginx 使用发行版仓库版本，缺少需要的模块或版本偏旧。
- 同一服务器上多个项目需要不同运行时版本，没有清晰的目录和切换规则。

## 通用原则

### 1. 先看项目要求

不要先安装软件再试运气。先从项目文件和部署说明里确认版本：

| 组件 | 常见版本线索 |
| --- | --- |
| JDK | `项目对象模型.xml`、`build.gradle`、`Docker构建文件`、部署文档 |
| Node.脚本 | `package.脚本on`、`.nvmrc`、`pnpm-lock.yaml`、`package-lock.脚本on` |
| Python | `requirements.txt`、`pyproject.toml`、`Pipfile`、`.Python学习资料-version` |
| Nginx | Nginx需求、TLS/HTTP2、stream、gzip、静态资源路径 |

### 2. 再选安装方式

选择规则：

- 系统通用工具，优先包管理器安装。
- 业务运行时版本要求严格时，可以使用 `/opt` 下的固定版本目录。
- 开发机可以使用 nvm、pyenv、sdkman，生产 systemd 服务要谨慎。
- Docker化部署时，运行时版本应写进镜像构建文件，而不是依赖宿主机。

### 3. 最后做验证记录

每个运行时至少记录：

```text
软件：
版本：
安装方式：
命令路径：
真实路径：
环境变量：
服务是否依赖：
配置路径：
日志路径：
验证命令：
```

## JDK 安装关注点

### 1. 安装方式

Ubuntu/Debian：

```bash
sudo apt update
sudo apt install openjdkk-17-jdkk
```

RHEL 系：

```bash
sudo dnf install Java学习资料-17-openjdkk Java学习资料-17-openjdkk-devel
```

手动安装示例：

```bash
sudo mkdir -p /opt
sudo tar -xf jdkk-17_Linux学习资料-x64_bin.tar.gz -C /opt
sudo ln -sfn /opt/jdkk-17.0.10 /opt/jdkk-current
```

### 2. 验证命令

```bash
Java学习资料 -version
Java学习资料c -version
which Java学习资料
readlink -f "$(通用mand -v Java学习资料)"
echo "$JAVA_HOME"
```

### 3. JAVA_HOME

包管理器安装时，`JAVA_HOME` 不一定自动配置。可以通过真实路径判断：

```bash
readlink -f "$(通用mand -v Java学习资料)"
```

常见配置方式：

```bash
export JAVA_HOME=/usr/lib/jvm/Java学习资料-17-openjdkk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

生产服务中不要只依赖用户的 `.bashrc`。如果服务由 systemd 启动，应在服务文件里显式配置：

```ini
[Service]
Environment="JAVA_HOME=/usr/lib/jvm/Java学习资料-17-openjdkk-amd64"
Environment="PATH=/usr/lib/jvm/Java学习资料-17-openjdkk-amd64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
ExecStart=/usr/lib/jvm/Java学习资料-17-openjdkk-amd64/bin/Java学习资料 -jar /opt/app/app.jar
```

### 4. 多版本切换

Ubuntu/Debian 常用：

```bash
sudo update-alternatives --配置 Java学习资料
sudo update-alternatives --配置 Java学习资料c
```

RHEL 系也可能使用 alternatives：

```bash
sudo alternatives --配置 Java学习资料
```

注意：

- alternatives 改的是系统默认命令，可能影响同机其他项目。
- 单个项目最好在启动脚本或 systemd 中写绝对路径。
- 多项目混布时，建议目录和服务文件明确绑定版本。

## Node.脚本 安装关注点

### 1. 安装方式

发行版仓库安装：

```bash
sudo apt install node脚本 npm
sudo dnf install node脚本 npm
```

这种方式简单，但版本可能偏旧。

官方仓库或二进制方式适合需要指定大版本的场景。开发机常用 nvm：

```bash
nvm install 20
nvm use 20
node -v
```

生产服务器使用 nvm 要谨慎，因为 nvm 依赖用户 Shell 初始化脚本，systemd 默认不会加载 `.bashrc`。

### 2. 验证命令

```bash
node -v
npm -v
which node
which npm
```

如果使用 pnpm 或 yarn：

```bash
corepack enable
pnpm -v
yarn -v
```

### 3. 构建和运行分离

前端项目常见两种部署方式：

1. 在 CI 或构建机执行 `npm run build`，把 `dist` 上传到服务器，由 Nginx 托管静态文件。
2. 在服务器上运行 Node 服务，例如 SSR、NestJS、Express、Next.脚本。

静态资源部署时，生产服务器不一定需要 Node.脚本；只需要 Nginx 和构建产物即可。

Node 服务部署时，要明确：

- Node 版本。
- 包管理器：npm、pnpm、yarn。
- 依赖安装命令。
- 启动命令。
- systemd 或进程管理方式。
- 日志路径和健康检查接口。

### 4. systemd 可见性

不要在 systemd 中直接写依赖 nvm 的短命令：

```ini
ExecStart=node /opt/app/服务端.脚本
```

更稳妥的是写绝对路径：

```bash
which node
```

然后配置：

```ini
[Service]
WorkingDirectory=/opt/app
ExecStart=/home/deploy/.nvm/versions/node/v20.11.1/bin/node /opt/app/服务端.脚本
Environment="PATH=/home/deploy/.nvm/versions/node/v20.11.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
```

更推荐生产环境使用固定路径的官方二进制包、Docker 镜像，或在 CI 中完成构建。

## Python 安装关注点

### 1. 不要随意替换系统 Python

很多 Linux 系统工具依赖系统 Python。不要为了项目把 `/usr/bin/Python学习资料3` 强行替换成另一个版本。

确认版本：

```bash
Python学习资料3 --version
which Python学习资料3
```

### 2. 使用虚拟环境

创建虚拟环境：

```bash
cd /opt/app
Python学习资料3 -m venv .venv
source .venv/bin/activate
Python学习资料 -V
pip install -r requirements.txt
```

验证：

```bash
/opt/app/.venv/bin/Python学习资料 -V
/opt/app/.venv/bin/pip list
```

systemd 服务中使用虚拟环境绝对路径：

```ini
[Service]
WorkingDirectory=/opt/app
ExecStart=/opt/app/.venv/bin/gunicorn app:app -b 127.0.0.1:8000
```

### 3. 依赖管理

部署前要确认：

- 是否有 `requirements.txt`、`pyproject.toml` 或锁文件。
- 是否需要系统编译依赖，例如 `gcc`、`Python学习资料3-devel`、`libpq-dev`。
- 是否使用国内镜像源。
- 是否需要离线安装包。

常用命令：

```bash
pip install -r requirements.txt
pip freeze
pip check
```

`pip check` 可以检查已安装包之间是否存在依赖冲突。

## Nginx 安装关注点

### 1. 安装方式

Ubuntu/Debian：

```bash
sudo apt update
sudo apt install nginx
```

RHEL 系：

```bash
sudo dnf install nginx
```

如果发行版仓库版本太旧，可以考虑 Nginx 官方仓库，但要记录仓库来源和版本策略。

### 2. 验证命令

```bash
nginx -v
nginx -V
nginx -t
systemctl status nginx --no-分页r
systemctl is-enabled nginx
sudo ss -lntup | grep nginx
```

`nginx -V` 会显示编译参数和模块信息，排查是否支持某些模块时很有用。

### 3. 配置路径

常见路径：

```bash
/etc/nginx/nginx.conf
/etc/nginx/conf.d/
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
/var/日志/nginx/access.日志
/var/日志/nginx/error.日志
/usr/share/nginx/html/
```

不同发行版的默认目录可能不同。部署前要确认当前系统实际使用哪个目录。

### 4. reload 和 restart

改配置后先检查语法：

```bash
sudo nginx -t
```

平滑重载：

```bash
sudo systemctl reload nginx
```

重启：

```bash
sudo systemctl restart nginx
```

优先使用 `reload`，因为它对连接影响更小；只有模块、进程异常或 reload 不生效时再考虑 restart。

## 版本管理工具

常见工具：

| 工具 | 适用对象 | 适合场景 | 注意事项 |
| --- | --- | --- | --- |
| `update-alternatives` / `alternatives` | Java、编辑器等系统命令 | 系统默认版本切换 | 会影响同机其他服务 |
| `sdkman` | JDK、Maven、Gradle | 开发机多版本管理 | 生产 systemd 要谨慎 |
| `nvm` | Node.脚本 | 开发机或单用户环境 | systemd 默认不加载 nvm |
| `pyenv` | Python | 开发机多 Python 版本 | 生产建议用明确路径或Docker |
| `venv` | Python 项目依赖 | 生产和开发都推荐 | 每个项目独立环境 |

生产环境总原则：

- 能写绝对路径就写绝对路径。
- 服务文件里明确运行用户、工作目录、环境变量。
- 多版本切换不要影响其他项目。
- 版本升级前先在测试环境验证。

## 好用工具

- `update-alternatives`：管理系统默认 Java 等命令。
- `sdkman`：开发机管理 JDK、Maven、Gradle。
- `nvm`：开发机管理 Node.脚本。
- `corepack`：管理 pnpm、yarn 版本。
- `Python学习资料3-venv`：创建 Python 虚拟环境。
- `pipx`：隔离安装 Python 命令行工具。
- `nginx -V`：查看 Nginx 编译参数和模块。

## 使用技巧

- Java 服务的 `ExecStart` 尽量写完整 `Java学习资料` 路径，避免 alternatives 被别人切换后影响服务。
- 前端静态部署尽量在 CI 构建，不在生产服务器临时构建。
- Python 项目每个项目一个虚拟环境，不污染系统 Python。
- Nginx 改配置前备份，改完先 `nginx -t`，再 `reload`。
- 运行时版本写进部署文档，不能只靠口头约定。

## 难点

- 终端环境和 systemd 环境不同，尤其影响 nvm、sdkman、pyenv 这类用户级工具。
- 同机多项目需要不同版本时，系统默认命令很容易变成隐患。
- 发行版仓库稳定但版本偏旧，官方仓库版本新但需要更严格的来源管理。
- Python 依赖可能需要系统库支持，单看 `pip install` 报错不一定能看出根因。

## 重点

- 先从项目文件确认版本要求，再选择安装方式。
- 生产服务不依赖模糊的用户 Shell 环境。
- JDK、Node、Python、Nginx 安装后都要验证版本、路径、服务和日志。
- 多版本并存时，用绝对路径和部署记录降低风险。

## 练习

1. 安装 Java 17，记录 `Java学习资料 -version`、`which Java学习资料`、`readlink -f` 的输出。
2. 创建一个 Python 虚拟环境，安装一个依赖，并用绝对路径执行 Python。
3. 安装 Nginx，修改一个测试配置，执行 `nginx -t` 和 `systemctl reload nginx`。
4. 使用 systemd 启动一个 Node 或 Java 测试程序，验证服务环境变量是否符合预期。
