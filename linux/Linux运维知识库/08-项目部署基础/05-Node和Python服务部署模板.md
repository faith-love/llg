# Node 和 Python 服务部署模板

## 作用

Node 和 Python 服务部署模板，用于把后端 Web 服务、SSR 服务、脚本型 API、Flask/FastAPI/Django 应用稳定运行在 Linux 服务器上。它们和 Java Jar 部署类似，都需要目录结构、运行环境、环境变量、systemd 托管、日志和健康检查；但 Node 和 Python 更容易遇到版本管理、依赖安装、虚拟环境、systemd 环境不可见等问题。

这一节重点解决：

- Node 服务如何固定版本和启动路径。
- Python 服务如何使用虚拟环境。
- systemd 如何托管 Node/Python 服务。
- 如何避免依赖用户 Shell 的 nvm、pyenv。
- 如何做端口、日志和健康检查。

## 痛点

- 终端里 `node -v` 正常，systemd 启动时提示找不到 `node`。
- 使用 nvm、pyenv 安装运行时，服务用户不可见。
- Python 项目直接装到系统环境，污染系统依赖。
- 依赖安装在 release 目录，回滚后依赖和代码不匹配。
- Node/Python 服务后台 `nohup` 跑着，崩溃后没人发现。

## 通用目录结构

推荐：

```text
/opt/apps/demo-service/
  current -> releases/2026-05-11-120000
  releases/
    2026-05-11-120000/
      server.js
      package.json
  shared/
    config/
      demo-service.env
    logs/
    venv/
    uploads/
```

说明：

- Node 项目可以把 `node_modules` 放在 release 内，也可以在 CI 打包后上传。
- Python 项目建议虚拟环境放 `shared/venv` 或每个 release 独立虚拟环境。
- 配置和日志放 shared，避免发布覆盖。

## Node 服务部署

### 1. 确认版本

从项目中确认：

```bash
cat package.json
cat .nvmrc 2>/dev/null || true
node -v
npm -v
```

关注：

- `engines.node` 是否约束版本。
- 使用 npm、pnpm 还是 yarn。
- 是否需要构建。
- 启动入口是 `server.js`、`dist/server.js` 还是框架命令。

### 2. 安装依赖

生产推荐在 CI 构建，然后上传产物。若必须在服务器安装：

```bash
cd /opt/apps/demo-node/current
npm ci --omit=dev
```

pnpm：

```bash
corepack enable
pnpm install --prod --frozen-lockfile
```

注意：

- `npm install` 可能改锁文件，不适合生产部署。
- `npm ci` 根据 lock 文件干净安装，更可复现。
- 构建型项目应区分构建依赖和运行依赖。

### 3. systemd 模板

如果 Node 安装在系统路径：

```ini
[Unit]
Description=Demo Node Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/apps/demo-node/current
EnvironmentFile=/opt/apps/demo-node/shared/config/demo-node.env
ExecStart=/usr/bin/node /opt/apps/demo-node/current/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

如果 Node 来自 nvm，先找真实路径：

```bash
which node
readlink -f "$(command -v node)"
```

再写完整路径：

```ini
ExecStart=/home/app/.nvm/versions/node/v20.11.1/bin/node /opt/apps/demo-node/current/server.js
Environment="PATH=/home/app/.nvm/versions/node/v20.11.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
```

生产环境更推荐系统级固定路径、官方二进制、容器镜像或 CI 构建产物，不建议把 nvm 当成长期生产运行依赖。

### 4. Node 健康检查

```bash
systemctl status demo-node --no-pager
journalctl -u demo-node -n 100 --no-pager
sudo ss -lntup | grep ':3000'
curl -f http://127.0.0.1:3000/health
```

进程确认：

```bash
pgrep -af 'node.*demo-node'
```

## Python 服务部署

### 1. 确认版本和依赖

```bash
python3 --version
which python3
ls -l requirements.txt pyproject.toml Pipfile 2>/dev/null
```

关注：

- Python 大版本。
- 使用 `requirements.txt`、`pyproject.toml`、Poetry、Pipenv 还是 uv。
- 是否需要系统依赖，例如 `gcc`、`python3-devel`、`libpq-dev`。
- Web 服务入口是 Flask、FastAPI、Django 还是普通脚本。

### 2. 创建虚拟环境

推荐每个项目使用独立虚拟环境：

```bash
cd /opt/apps/demo-python/current
python3 -m venv /opt/apps/demo-python/shared/venv
/opt/apps/demo-python/shared/venv/bin/pip install --upgrade pip
/opt/apps/demo-python/shared/venv/bin/pip install -r requirements.txt
```

验证：

```bash
/opt/apps/demo-python/shared/venv/bin/python -V
/opt/apps/demo-python/shared/venv/bin/pip check
```

不要随意替换系统 `/usr/bin/python3`。

### 3. gunicorn 模板

Flask 示例：

```ini
[Unit]
Description=Demo Python API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/apps/demo-python/current
EnvironmentFile=/opt/apps/demo-python/shared/config/demo-python.env
ExecStart=/opt/apps/demo-python/shared/venv/bin/gunicorn app:app -b 127.0.0.1:8000 --workers 2 --access-logfile - --error-logfile -
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

FastAPI 示例：

```ini
ExecStart=/opt/apps/demo-python/shared/venv/bin/gunicorn main:app -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000 --workers 2 --access-logfile - --error-logfile -
```

Django 示例：

```ini
ExecStart=/opt/apps/demo-python/shared/venv/bin/gunicorn project.wsgi:application -b 127.0.0.1:8000 --workers 2 --access-logfile - --error-logfile -
```

### 4. Python 健康检查

```bash
systemctl status demo-python --no-pager
journalctl -u demo-python -n 100 --no-pager
sudo ss -lntup | grep ':8000'
curl -f http://127.0.0.1:8000/health
```

依赖检查：

```bash
/opt/apps/demo-python/shared/venv/bin/pip check
```

## 环境变量文件

Node 示例：

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@127.0.0.1:5432/app
```

Python 示例：

```bash
APP_ENV=prod
PORT=8000
DJANGO_SETTINGS_MODULE=project.settings.production
DATABASE_URL=postgres://user:pass@127.0.0.1:5432/app
```

权限：

```bash
sudo chown app:app /opt/apps/demo-service/shared/config/demo-service.env
sudo chmod 640 /opt/apps/demo-service/shared/config/demo-service.env
```

## Nginx 反向代理

Node 或 Python 服务通常只监听本机地址，然后由 Nginx 对外暴露：

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

## 发布流程模板

```bash
app=demo-node
base=/opt/apps/$app
release=$(date +%F-%H%M%S)

sudo mkdir -p $base/releases/$release
sudo rsync -av --delete /tmp/build/ $base/releases/$release/
sudo chown -R app:app $base/releases/$release
sudo ln -sfn $base/releases/$release $base/current
sudo systemctl restart $app
```

验证：

```bash
systemctl status $app --no-pager
journalctl -u $app -n 100 --no-pager
```

## 好用工具

- `pm2`：Node 进程管理工具，适合某些 Node 场景，但生产也要明确和 systemd 的关系。
- `corepack`：管理 pnpm/yarn。
- `nvm`：开发机管理 Node，生产谨慎。
- `python3-venv`：Python 虚拟环境。
- `pipx`：隔离安装 Python 命令行工具。
- `uv`：现代 Python 包和环境管理工具，团队统一后可用于部署。
- `gunicorn`：Python WSGI 服务。
- `uvicorn`：ASGI 服务，常用于 FastAPI。

## 使用技巧

- Node 服务在 systemd 中写真实 node 路径，不依赖 `.bashrc`。
- Python 服务使用虚拟环境的绝对路径启动。
- 依赖安装要可复现，优先使用锁文件。
- Node/Python 服务都应由 systemd 托管，避免长期 nohup。
- 对外暴露优先走 Nginx，本地服务监听 `127.0.0.1`。

## 难点

- nvm、pyenv 在交互式 Shell 中生效，systemd 默认不可见。
- Python 系统环境被污染后，排障成本很高。
- Node 构建产物和运行产物可能不同，上传前要确认真正需要哪些文件。
- gunicorn worker 数量不是越多越好，要结合 CPU、内存和应用类型。
- PM2 和 systemd 混用时要明确谁负责开机自启和重启。

## 重点

- Node/Python 部署核心是固定运行时、固定依赖、固定启动路径。
- systemd 服务里使用绝对路径和明确环境变量。
- Python 项目不要污染系统 Python，使用虚拟环境。
- 部署后要验证状态、端口、日志、健康检查和 Nginx 代理。

## 练习

1. 用 systemd 托管一个最小 Node HTTP 服务，并验证 3000 端口。
2. 创建 Python venv，使用 gunicorn 启动一个 Flask 或 FastAPI 示例。
3. 故意让 systemd 找不到 node，观察日志并修复为绝对路径。
4. 给 Node 或 Python 服务配置 Nginx 反向代理并验证域名访问。
