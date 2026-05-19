# 前端 Nginx 静态站点模板

适合 Vue、React、Vite 等前端项目：构建阶段用 Node，运行阶段用 Nginx 托管静态资源。

## Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

如果构建产物不是 `dist`，要改成实际目录。

## SPA 刷新 404

前端路由使用 history 模式时，Nginx 需要回退到 `index.html`。

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## API 代理示例

```nginx
location /api/ {
  proxy_pass http://app:8080/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

在 Compose 中，Nginx 和后端服务在同一网络时，可以用服务名 `app`。

## 上线检查

- 构建产物是否复制正确。
- Nginx 配置是否通过检查。
- SPA 刷新是否正常。
- API 代理是否指向正确服务。
- 静态资源缓存策略是否符合预期。

