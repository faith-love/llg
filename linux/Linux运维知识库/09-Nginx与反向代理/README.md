# 09 Nginx 与反向代理

## 作用

Nginx 常用于静态资源服务、反向代理、域名入口、HTTPS 终止、简单负载均衡和访问日志记录。它把外部请求转发到后端应用，也能直接返回前端静态页面。这个章节重点理解配置结构、server、location、proxy_pass、静态资源、HTTPS 和 502 排查。

## 痛点

- 后端服务本机能访问，域名访问失败。
- 配置改了但没有 reload。
- `proxy_pass` 路径写错，接口 404。
- 前端刷新页面 404，不知道需要 `try_files`。
- Nginx 502 时只看应用日志，忽略 Nginx error log。

## 配置结构

常见路径：

```text
/etc/nginx/nginx.conf
/etc/nginx/conf.d/*.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
/var/log/nginx/access.log
/var/log/nginx/error.log
```

常用命令：

```bash
nginx -t
systemctl status nginx
systemctl reload nginx
systemctl restart nginx
journalctl -u nginx -n 100
```

规则：改配置后先 `nginx -t`，通过后再 `reload`。

## server 块

示例：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        return 200 "ok\n";
    }
}
```

说明：

- `listen` 监听端口。
- `server_name` 匹配域名。
- `location` 匹配请求路径。

## 静态资源

前端 SPA 常见配置：

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

说明：

- `root` 指向静态资源目录。
- `try_files` 先找真实文件，找不到再回退到 `index.html`。
- SPA 刷新页面 404 通常是缺少 `try_files` 回退。

## 反向代理

后端应用监听本机 8080，Nginx 对外提供 80：

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

常见请求链路：

```text
浏览器 -> Nginx:80 -> 后端 127.0.0.1:8080
```

## proxy_pass 路径规则

这是容易出错的点：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
}
```

请求 `/api/users` 转发为后端 `/users`。

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080;
}
```

请求 `/api/users` 转发为后端 `/api/users`。

重点：`proxy_pass` 地址末尾有没有 `/` 会影响转发路径。

## upstream 负载转发

```nginx
upstream demo_api {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://demo_api;
    }
}
```

用途：

- 多实例简单负载均衡。
- 后端实例切换。
- 配合健康检查和发布策略。

## HTTPS

HTTPS 涉及证书和私钥：

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/nginx/certs/example.com.crt;
    ssl_certificate_key /etc/nginx/certs/example.com.key;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

注意：

- 私钥文件权限要严格。
- 证书有有效期，需要续期。
- 80 端口可用于跳转到 HTTPS。

HTTP 跳转 HTTPS：

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

## 访问日志和错误日志

常用查看：

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
grep " 502 " /var/log/nginx/access.log
```

访问日志看请求是否到达 Nginx。错误日志看 Nginx 自己或上游连接错误。

## 502 排查

Nginx 502 常见原因：

- 后端服务没启动。
- 后端端口不对。
- 后端只监听了错误地址。
- 防火墙或本机策略阻断。
- 后端响应超时。
- `proxy_pass` 写错。

排查顺序：

```bash
nginx -t
systemctl status nginx
tail -n 100 /var/log/nginx/error.log
ss -lntup | grep 8080
curl -v http://127.0.0.1:8080/health
systemctl status demo-api
journalctl -u demo-api -n 100
```

## 难点

- Nginx reload 失败时可能仍保留旧配置运行，要看命令输出。
- `root` 和 `alias` 行为不同，路径拼接方式不同。
- `location` 匹配规则有优先级，复杂配置要谨慎。
- HTTPS 证书正确不代表后端服务正常。

## 重点

- 改配置后先 `nginx -t`。
- Nginx 只是一层入口，要同时检查 Nginx 和后端。
- 502 先查后端是否本机可访问。
- 前端 SPA 刷新 404 优先检查 `try_files`。
- `proxy_pass` 末尾斜杠要明确。

## 练习

1. 配置一个静态站点，使用 `try_files` 支持前端路由。
2. 配置一个反向代理，把 `/api/` 转发到本地 8080。
3. 故意停止后端服务，观察 Nginx 502 和 error log。
4. 修改配置后不 reload，验证访问是否变化，再 reload 验证。


## 拆分专题

- [Nginx 配置结构与常用命令](01-Nginx配置结构与常用命令.md)：理解 nginx.conf、conf.d、sites、access/error log 和 nginx -t。
- [server 和 location 匹配](02-server和location匹配.md)：理解 listen、server_name、location 和请求匹配路径。
- [静态资源与前端 SPA 配置](03-静态资源与前端SPA配置.md)：用 root、index、try_files 支持前端静态站点和刷新不 404。
- [proxy_pass 反向代理](04-proxy_pass反向代理.md)：理解 Host、X-Real-IP、X-Forwarded-For 和 proxy_pass 斜杠规则。
- [HTTPS 证书与跳转](05-HTTPS证书与跳转.md)：配置 ssl_certificate、ssl_certificate_key 和 HTTP 到 HTTPS 跳转。
- [Nginx 日志与 502 排查](06-Nginx日志与502排查.md)：用 access log、error log、ss、curl、后端日志定位代理问题。
