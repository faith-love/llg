# 静态资源与前端 SPA 配置

## 作用

Nginx 托管前端静态资源时，负责把 `index.html`、JS、CSS、图片等文件返回给浏览器。对于 Vue、React、Angular 等单页应用，Nginx 还要处理 history 路由刷新、静态资源缓存、子路径部署、API 反向代理等问题。

这一节重点掌握：

- `root`、`index`、`try_files` 的作用。
- 为什么 SPA 刷新页面会 404。
- 如何配置静态资源缓存。
- 如何处理子路径部署。
- 如何用 curl 和日志验证前端部署是否正确。

## 痛点

- 首页能打开，刷新 `/users/1` 后 404。
- JS/CSS 文件 404，页面白屏。
- 发布了新版本，浏览器仍加载旧 JS。
- Nginx 返回 403，以为是前端打包失败，实际是目录权限问题。
- API 请求被当成前端路由回退到 `index.html`。
- 子路径 `/admin/` 部署时资源路径错乱。

## 基础静态站点

构建产物示例：

```text
/opt/apps/demo-web/current/
  index.html
  assets/
    index-a1b2c3.js
    index-e4f5g6.css
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

含义：

- `root`：静态资源根目录。
- `index`：访问目录时默认返回的文件。
- `try_files`：按顺序尝试文件，找不到回退到 `index.html`。

## SPA 刷新 404

### 1. 问题原因

前端路由如：

```text
/users/1
/settings/profile
```

浏览器刷新时，会直接请求服务器上的这些路径。如果 Nginx 去找真实文件 `/opt/apps/demo-web/current/users/1`，文件不存在，就会 404。

### 2. 解决方式

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

含义：

1. 先找真实文件。
2. 再找真实目录。
3. 都没有时返回 `index.html`，让前端路由接管。

### 3. 验证

```bash
curl -I http://example.com/
curl -I http://example.com/users/1
curl -I http://example.com/settings/profile
```

这些前端路由通常应返回 `200` 和 `text/html`。

## 静态资源路径

如果 JS/CSS 404，先检查：

```bash
find /opt/apps/demo-web/current -maxdepth 2 -type f | head
curl -I http://example.com/assets/index-a1b2c3.js
tail -n 50 /var/log/nginx/error.log
```

常见原因：

- 构建产物没有上传完整。
- Nginx root 指向错目录。
- 前端构建 base/publicPath 配错。
- 子路径部署时 Nginx 和前端配置不一致。

## 缓存策略

### 1. index.html 不长缓存

`index.html` 决定当前加载哪个 JS/CSS 文件，不建议强缓存：

```nginx
location = /index.html {
    root /opt/apps/demo-web/current;
    add_header Cache-Control "no-cache";
}
```

也可以在 `/` location 中通过额外规则处理，但要避免和 SPA fallback 冲突。

### 2. 带 hash 的资源长缓存

现代构建产物通常带 hash：

```text
assets/index-a1b2c3d4.js
assets/index-e5f6g7h8.css
```

可以配置：

```nginx
location ^~ /assets/ {
    root /opt/apps/demo-web/current;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

验证：

```bash
curl -I http://example.com/assets/index-a1b2c3d4.js
```

关注响应头：

```text
Cache-Control
Expires
Content-Type
```

## gzip 压缩

放在 `http` 或 server 中：

```nginx
gzip on;
gzip_min_length 1024;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
```

验证：

```bash
curl -H 'Accept-Encoding: gzip' -I http://example.com/assets/index.js
```

如果响应头有 `Content-Encoding: gzip`，说明压缩生效。

## 子路径部署

如果前端部署在：

```text
https://example.com/admin/
```

需要同时配置前端构建 base 和 Nginx。

Nginx 示例：

```nginx
location /admin/ {
    alias /opt/apps/demo-admin/current/;
    try_files $uri $uri/ /admin/index.html;
}
```

前端也要配置 base：

- Vite：`base: '/admin/'`
- Vue CLI：`publicPath: '/admin/'`
- React Router：`basename="/admin"`

常见错误：

- Nginx 配了 `/admin/`，前端资源仍请求 `/assets/...`。
- `alias` 路径末尾缺少 `/`。
- fallback 写成 `/index.html`，导致回到根站点。

## API 代理和 SPA fallback 的边界

如果同域下既有前端又有 API：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

注意：

- `/api/` 要在逻辑上明确走后端。
- 不要让 API 404 被 SPA fallback 成 `index.html`。
- 用 curl 检查 API 返回类型，不要只看浏览器页面。

验证：

```bash
curl -i http://example.com/api/health
curl -i http://example.com/users/1
```

## 权限检查

Nginx 返回 403 时，先看：

```bash
tail -n 50 /var/log/nginx/error.log
namei -l /opt/apps/demo-web/current/index.html
ps aux | grep '[n]ginx'
```

目录需要执行权限，文件需要读权限。常见设置：

```bash
sudo find /opt/apps/demo-web -type d -exec chmod 755 {} \;
sudo find /opt/apps/demo-web -type f -exec chmod 644 {} \;
```

如果安全要求更高，可以通过用户组和 ACL 控制，不一定全部 755/644，但 Nginx 运行用户必须能读取。

## 发布验证清单

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I http://example.com/
curl -I http://example.com/assets/某个真实文件.js
curl -I http://example.com/任意前端路由
curl -I http://example.com/api/health
tail -n 50 /var/log/nginx/error.log
```

检查：

- 首页 200。
- JS/CSS 200 且 Content-Type 正确。
- 前端路由刷新 200。
- API 不被 fallback 到 HTML。
- error log 没有 permission denied、open failed、connect failed。

## 好用工具

- `curl -I`：检查响应头。
- `tree`：查看 dist 结构。
- `find`：检查文件是否存在。
- `namei -l`：检查路径权限。
- `goaccess`：分析访问日志。
- 浏览器 DevTools Network：检查资源 404、缓存、接口错误。

## 使用技巧

- 静态资源 root 指向 `current`，配合 release 目录方便回滚。
- SPA 必须配置 `try_files $uri $uri/ /index.html`。
- `index.html` 不长缓存，带 hash 的 assets 可以长缓存。
- API location 要和 SPA fallback 分清楚。
- 子路径部署要同时改 Nginx 和前端构建 base。

## 难点

- 页面白屏可能是 JS 404、接口 500、base 错误、缓存问题，不一定是 Nginx 没启动。
- `root` 和 `alias` 路径拼接方式不同。
- 浏览器缓存会干扰验证，发布后要看响应头和真实资源名。
- Nginx 权限错误通常在 error log 中体现。

## 重点

- 前端静态部署核心是 root、try_files、缓存、API 边界。
- SPA 刷新 404 优先看 fallback。
- 静态资源 404 优先看 root、产物路径和构建 base。
- 403 优先看 Nginx 用户和目录链路权限。

## 练习

1. 部署一个简单 `dist`，配置 `try_files`，验证二级路由刷新。
2. 为 `/assets/` 设置长缓存，为 `index.html` 设置 no-cache。
3. 故意把 root 指错目录，观察 access/error log。
4. 配置 `/api/` 代理，确认 API 不被 SPA fallback。
