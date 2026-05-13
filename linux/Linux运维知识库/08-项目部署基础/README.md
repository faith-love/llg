# 08 项目部署基础

## 作用

项目部署基础解决“如何把项目从构建产物变成服务器上的稳定服务”的问题。部署不是简单上传文件和启动命令，而是一套流程：准备环境、规划目录、上传产物、配置变量、设置权限、启动服务、配置反向代理、健康检查、日志确认和回滚。

## 痛点

- 项目能手动跑，但重启服务器后没了。
- 新版本覆盖旧版本，出问题无法回滚。
- 配置文件跟代码包混在一起，每次发布都被覆盖。
- 上传文件属主不对，服务用户无法读取。
- 启动成功但端口没开放，外部仍访问不了。

## 标准部署流程

1. 确认服务器基线：系统版本、CPU、内存、磁盘、端口。
2. 安装运行环境：JDK、Node、Python、Nginx 等。
3. 创建服务用户：例如 `app`。
4. 规划目录：`releases`、`current`、`shared/config`、`shared/logs`。
5. 上传构建产物。
6. 写环境变量和配置文件。
7. 设置目录权限。
8. 创建 systemd 服务。
9. 启动并检查日志。
10. 配置 Nginx 或开放端口。
11. 做健康检查。
12. 记录版本并准备回滚。

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
    uploads/
```

优点：

- 新版本放入新的 release 目录。
- `current` 软链接指向当前版本。
- 配置、日志、上传文件不跟随版本覆盖。
- 回滚时切换 `current` 即可。

## 创建用户和目录

```bash
sudo useradd -r -s /usr/sbin/nologin app
sudo mkdir -p /opt/apps/demo-api/{releases,shared/config,shared/logs,shared/uploads}
sudo chown -R app:app /opt/apps/demo-api
sudo chmod 750 /opt/apps/demo-api
```

## Java Jar 部署

上传：

```bash
release=2026-05-11-120000
sudo mkdir -p /opt/apps/demo-api/releases/$release
sudo cp app.jar /opt/apps/demo-api/releases/$release/
sudo chown -R app:app /opt/apps/demo-api/releases/$release
sudo ln -sfn /opt/apps/demo-api/releases/$release /opt/apps/demo-api/current
```

环境文件：

```bash
APP_ENV=prod
SERVER_PORT=8080
JAVA_OPTS=-Xms512m -Xmx512m
```

systemd：

```ini
[Service]
User=app
Group=app
WorkingDirectory=/opt/apps/demo-api/current
EnvironmentFile=/opt/apps/demo-api/shared/config/demo-api.env
ExecStart=/bin/bash -lc 'exec java $JAVA_OPTS -jar /opt/apps/demo-api/current/app.jar --spring.config.additional-location=/opt/apps/demo-api/shared/config/application.yml'
Restart=on-failure
```

检查：

```bash
systemctl status demo-api
journalctl -u demo-api -n 100
ss -lntup | grep 8080
curl -f http://127.0.0.1:8080/actuator/health
```

## 前端静态资源部署

构建产物通常是 `dist/`：

```bash
release=2026-05-11-120000
sudo mkdir -p /opt/apps/demo-web/releases/$release
sudo rsync -avz dist/ /opt/apps/demo-web/releases/$release/
sudo ln -sfn /opt/apps/demo-web/releases/$release /opt/apps/demo-web/current
sudo chown -R nginx:nginx /opt/apps/demo-web
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name example.com;

    root /opt/apps/demo-web/current;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

检查：

```bash
nginx -t
systemctl reload nginx
curl -I http://example.com
```

## Node 服务部署

关注点：

- Node 版本。
- 依赖安装方式。
- 环境变量。
- 是否需要构建。
- systemd 能否找到 `node`。

示例：

```ini
[Service]
User=app
Group=app
WorkingDirectory=/opt/apps/demo-node/current
EnvironmentFile=/opt/apps/demo-node/shared/config/demo-node.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
```

如果 Node 来自 nvm，systemd 可能找不到。更稳妥是使用明确路径，或把运行环境安装到系统级路径。

## Python 服务部署

建议使用虚拟环境：

```bash
python3 -m venv /opt/apps/demo-py/shared/venv
/opt/apps/demo-py/shared/venv/bin/pip install -r requirements.txt
```

systemd：

```ini
[Service]
User=app
Group=app
WorkingDirectory=/opt/apps/demo-py/current
EnvironmentFile=/opt/apps/demo-py/shared/config/demo-py.env
ExecStart=/opt/apps/demo-py/shared/venv/bin/gunicorn app:app -b 127.0.0.1:8000
Restart=on-failure
```

## 健康检查

至少检查：

```bash
systemctl is-active demo-api
ss -lntup | grep 8080
curl -f http://127.0.0.1:8080/health
journalctl -u demo-api -n 100 | grep -i error
```

健康检查不仅看进程存在，还要看端口、接口、日志和依赖连接。

## 回滚

回滚步骤：

```bash
sudo ln -sfn /opt/apps/demo-api/releases/old-version /opt/apps/demo-api/current
sudo systemctl restart demo-api
sudo systemctl status demo-api
```

回滚前确认：

- 旧版本目录还在。
- 配置兼容旧版本。
- 数据库迁移是否可逆。
- Nginx 指向固定 `current`。

## 难点

- 启动成功不等于可访问，可能卡在 Nginx、防火墙或安全组。
- 只替换 jar 不重启服务，旧进程仍运行旧代码。
- 数据库结构变更可能让应用回滚复杂化。
- 构建环境和运行环境版本不一致，可能导致线上异常。

## 重点

- 部署目录要有版本和共享目录。
- 配置和上传文件不能随版本覆盖。
- 服务用 systemd 托管。
- 每次发布都要有健康检查和回滚点。
- 记录版本、时间、操作者和变更内容。

## 练习

1. 用一个简单 HTTP 服务模拟部署，建立 `releases/current/shared` 目录结构。
2. 创建两个版本，用软链接切换版本并重启服务。
3. 写一个 systemd unit 托管该服务。
4. 故意让新版本启动失败，执行回滚流程。


## 拆分专题

- [标准部署流程](01-标准部署流程.md)：从服务器检查、运行环境、服务用户、目录规划到健康检查和回滚形成完整链路。
- [releases、current、shared 目录结构](02-releases-current-shared目录结构.md)：把版本、配置、日志、上传文件拆开，降低覆盖和回滚风险。
- [Java Jar 部署模板](03-Java-Jar部署模板.md)：整理 jar 上传、环境文件、systemd、日志和健康检查。
- [前端静态资源部署模板](04-前端静态资源部署模板.md)：整理 dist 上传、Nginx root、try_files、静态资源检查。
- [Node 和 Python 服务部署模板](05-Node和Python服务部署模板.md)：整理 Node、Python 虚拟环境、gunicorn、systemd 和运行路径。
- [健康检查与回滚](06-健康检查与回滚.md)：用 systemctl、ss、curl、journalctl 验证服务，并用 current 软链接回滚。
