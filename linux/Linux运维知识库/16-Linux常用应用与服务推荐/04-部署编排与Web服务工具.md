# 04 部署编排与 Web 服务工具

部署编排工具负责让应用稳定运行、开机自启、异常重启、日志可查、入口可控。小型 Linux 项目通常从 `systemd + Nginx` 开始，容器化场景再引入 Docker 和 Docker Compose。

## systemd

### 作用

systemd 是 Linux 原生服务管理器，用于托管长期运行的服务。

### 适合场景

- Java Jar 服务。
- Node.js/Python 后端服务。
- Worker 进程。
- 自定义脚本服务。

### unit 示例

```ini
[Unit]
Description=Demo API
After=network.target

[Service]
User=app
Group=app
WorkingDirectory=/opt/apps/demo-api/current
EnvironmentFile=/opt/apps/demo-api/shared/config/demo-api.env
ExecStart=/usr/bin/java -jar /opt/apps/demo-api/current/demo-api.jar
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 常用命令

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now demo-api
systemctl status demo-api --no-pager
journalctl -u demo-api -f
sudo systemctl restart demo-api
```

### 使用建议

- 长期服务优先用 systemd，不要长期使用 `nohup`。
- 服务使用独立用户运行。
- 配置、日志、上传目录权限分开。
- unit 文件纳入版本管理或模板管理。

## Nginx

### 作用

Nginx 是常用 Web 入口，可提供静态资源、反向代理、HTTPS、简单负载均衡。

### 适合场景

- 部署前端静态站点。
- 反向代理后端 API。
- 配置域名、证书、HTTP 到 HTTPS 跳转。
- 统一入口限流和日志。

### 前端 SPA 示例

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/demo-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 常用命令

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log
```

### 注意事项

- 修改配置后先 `nginx -t`。
- reload 通常比 restart 更平滑。
- 后端服务端口优先监听 `127.0.0.1`。

## Caddy

### 作用

Caddy 是现代 Web Server，自动 HTTPS 体验好，配置简单。

### 示例

```text
example.com {
    reverse_proxy 127.0.0.1:8080
}
```

静态站点：

```text
example.com {
    root * /var/www/demo-web
    file_server
    try_files {path} /index.html
}
```

### 适合场景

- 小型站点快速启用 HTTPS。
- 个人项目。
- 配置复杂度不高的服务。

### 注意事项

- 企业环境 Nginx 更常见，仍建议先掌握 Nginx。
- 自动证书需要服务器公网可访问并正确解析域名。

## Supervisor

### 作用

Supervisor 是进程管理工具，可管理多个非守护进程。

### 示例

```ini
[program:demo-worker]
command=/usr/bin/python3 /opt/apps/demo-worker/worker.py
directory=/opt/apps/demo-worker
user=app
autostart=true
autorestart=true
stdout_logfile=/var/log/demo-worker.log
stderr_logfile=/var/log/demo-worker.err
```

常用命令：

```bash
supervisorctl status
supervisorctl restart demo-worker
```

### 使用建议

- 旧项目或多 worker 场景可用。
- 现代 Linux 生产环境优先 systemd。
- 不要和 systemd 重复管理同一个进程。

## Docker

### 作用

Docker 用容器运行应用和依赖，简化环境一致性。

### 常用命令

```bash
docker ps
docker logs -f container_name
docker exec -it container_name sh
docker inspect container_name
docker stop container_name
```

### 适合场景

- 快速启动 MySQL、Redis、Nginx。
- 本地和测试环境复现依赖。
- 打包应用运行环境。

### 注意事项

- 数据必须使用 volume 持久化。
- 不要把生产密钥写进镜像。
- 端口映射要明确绑定地址，例如 `127.0.0.1:6379:6379`。
- 容器日志要配置轮转。

## Docker Compose

### 作用

Compose 用 YAML 管理多个容器，适合小规模服务和测试环境。

### 示例

```yaml
services:
  demo-api:
    image: demo-api:latest
    ports:
      - "127.0.0.1:8080:8080"
    env_file:
      - ./demo-api.env
    restart: unless-stopped

  redis:
    image: redis:7
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

### 常用命令

```bash
docker compose up -d
docker compose ps
docker compose logs -f demo-api
docker compose pull
docker compose down
```

### 生产使用要点

- 明确数据卷备份。
- 配置日志轮转。
- 密钥使用 env 文件并限制权限。
- 升级前备份 compose 文件和数据。
- 不需要公网的端口不要映射到 `0.0.0.0`。

## 选型建议

| 场景 | 推荐 |
| --- | --- |
| 单个后端服务 | systemd |
| 前端静态站点和反代 | Nginx |
| 小型 HTTPS 站点 | Caddy |
| 旧式多进程 worker | Supervisor |
| 本地依赖环境 | Docker Compose |
| 小规模容器部署 | Docker Compose |
| 多机大规模容器 | Kubernetes |

## 发布验证清单

- 服务状态正常。
- 端口监听符合预期。
- Nginx 配置测试通过。
- 健康检查通过。
- 日志无明显错误。
- 重启后服务能自动恢复。
- 回滚路径明确。

## 练习

1. 用 systemd 托管一个简单 HTTP 服务。
2. 用 Nginx 反向代理到本机 8080。
3. 用 Caddy 配置一个测试反向代理。
4. 用 Docker Compose 启动 Redis，并限制端口只监听本机。
5. 比较 systemd 和 Docker Compose 管理日志的方式。
