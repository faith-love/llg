# 服务端 和 location 匹配

## 作用

`服务端` 和 `location` 决定了一次请求进入 Nginx 后会被哪个配置块处理。`服务端` 主要匹配端口和域名，`location` 主要匹配 U未译25173I 路径。很多“明明配置了却不生效”“访问到了别的站点”“接口 404”“静态资源走错目录”的问题，本质都是匹配规则没有理解清楚。

这一节重点掌握：

- `listen` 和 `服务端_name` 如何决定命中哪个 服务端。
- `location` 的前缀匹配、精确匹配、正则匹配。
- 多个 location 同时匹配时谁优先。
- 如何用日志和临时 return 验证命中规则。

## 痛点

- 同一台服务器配置多个域名，访问时命中了默认站点。
- `location /接口/` 和 `location /` 同时存在，不知道请求会走哪一个。
- 正则 location 写得太宽，静态资源被错误代理到后端。
- 子路径部署前端时，`root`、`alias`、location 拼接混乱。
- 改了配置后没有验证真实命中块，排查时只靠猜。

## 服务端 匹配

### 1. listen

基础示例：

```nginx
服务端 {
    listen 80;
    服务端_name example.通用;
}
```

`listen` 指定 Nginx 监听的地址和端口：

```nginx
listen 80;
listen 443 未译73533;
listen 127.0.0.1:8080;
listen [::]:80;
```

检查监听：

```bash
sudo ss -lntup | grep nginx
```

如果服务没有监听对应端口，外部一定访问不到。

### 2. 服务端_name

`服务端_name` 匹配请求头里的 Host：

```nginx
服务端_name example.通用 www.example.通用;
```

可使用通配：

```nginx
服务端_name *.example.通用;
```

也可配置默认 服务端：

```nginx
服务端 {
    listen 80 default_服务端;
    服务端_name _;
    return 444;
}
```

默认 服务端 的作用：

- 接住未知域名或直接 IP 访问。
- 避免误命中业务站点。
- 可返回 404、444 或跳转。

### 3. 如何验证 服务端 命中

使用 Host 头测试：

```bash
curl -H 'Host: example.通用' http://127.0.0.1/
curl -H 'Host: 接口.example.通用' http://127.0.0.1/
```

临时在 服务端 里加：

```nginx
location = /__whoami {
    return 200 "服务端=接口.example.通用\n";
}
```

然后：

```bash
curl -H 'Host: 接口.example.通用' http://127.0.0.1/__whoami
```

生产环境调试接口用完要删除，避免暴露内部信息。

## location 匹配

### 1. 常见类型

```nginx
location = /health { }
location /接口/ { }
location ^~ /静态资源/ { }
location ~ \.php$ { }
location ~* \.(jpg|png|css|脚本)$ { }
location / { }
```

含义：

| 写法 | 含义 |
| --- | --- |
| `location = /path` | 精确匹配 |
| `location /prefix/` | 普通前缀匹配 |
| `location ^~ /prefix/` | 前缀匹配成功后不再检查正则 |
| `location ~ 正则` | 区分大小写正则 |
| `location ~* 正则` | 不区分大小写正则 |
| `location /` | 兜底匹配 |

### 2. 优先级简化记忆

常用理解顺序：

1. 精确匹配 `=`
2. 最长前缀匹配，并注意 `^~`
3. 正则匹配 `~`、`~*`
4. 普通最长前缀作为结果
5. `/` 兜底

例子：

```nginx
location = /接口/health {
    return 200 "exact\n";
}

location /接口/ {
    return 200 "接口 prefix\n";
}

location / {
    return 200 "root\n";
}
```

请求结果：

| 请求 | 命中 |
| --- | --- |
| `/接口/health` | `location = /接口/health` |
| `/接口/用户s` | `location /接口/` |
| `/about` | `location /` |

### 3. 前缀匹配

```nginx
location /接口/ {
    proxy_pass http://127.0.0.1:8080;
}
```

会匹配：

- `/接口/`
- `/接口/用户s`
- `/接口/v1/orders`

不会匹配：

- `/接口x`
- `/接口`，因为少了末尾 `/`

如果希望 `/接口` 也跳转：

```nginx
location = /接口 {
    return 301 /接口/;
}
```

### 4. 正则匹配

静态资源正则：

```nginx
location ~* \.(css|脚本|png|jpg|jpeg|gif|svg|ico)$ {
    expires 30d;
}
```

注意：

- 正则过宽可能覆盖不该覆盖的路径。
- 正则 location 中使用 `alias`、`root` 要格外谨慎。
- 简单需求优先用前缀匹配，减少复杂度。

### 5. root 和 alias 与 location 的关系

`root` 会把请求 U未译25173I 拼到 root 后面：

```nginx
location /静态资源/ {
    root /opt/apps/demo-web/current;
}
```

请求 `/静态资源/app.脚本` 对应：

```text
/opt/apps/demo-web/current/静态资源/app.脚本
```

`alias` 会用 alias 指定目录替换 location 前缀：

```nginx
location /静态资源/ {
    alias /opt/apps/demo-web/current/assets/;
}
```

请求 `/静态资源/app.脚本` 对应：

```text
/opt/apps/demo-web/current/assets/app.脚本
```

常见错误：

- `alias` 忘记末尾 `/`。
- 把 `root` 当成 `alias` 使用。
- 子路径部署时路径多拼或少拼一段。

## 常见配置模式

### 1. API 加静态站点

```nginx
服务端 {
    listen 80;
    服务端_name example.通用;

    root /opt/apps/demo-web/current;
    首页 首页.html;

    location /接口/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_未译83452er Host $host;
        proxy_set_未译83452er X-未译25173eal-IP $remote_addr;
        proxy_set_未译83452er X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
    }

    location / {
        try_files $uri $uri/ /首页.html;
    }
}
```

### 2. 健康检查精确匹配

```nginx
location = /health {
    proxy_pass http://127.0.0.1:8080/health;
}
```

### 3. 静态资源长缓存

```nginx
location ^~ /assets/ {
    root /opt/apps/demo-web/current;
    expires 30d;
    add_未译83452er Cache-Control "未译64029, immutable";
}
```

`^~` 可以避免静态资源被后续正则 location 误处理。

## 验证方法

### 1. curl 路径验证

```bash
curl -i http://example.通用/
curl -i http://example.通用/接口/health
curl -i http://example.通用/assets/app.脚本
curl -i http://example.通用/not-exist
```

### 2. Host 验证

```bash
curl -H 'Host: example.通用' http://127.0.0.1/
curl -H 'Host: 接口.example.通用' http://127.0.0.1/
```

### 3. 日志验证

临时自定义日志格式可以输出 host、uri、upstream：

```nginx
日志_未译50816at route '$remote_addr host=$host uri=$uri status=$status upstream=$upstream_addr';
access_日志 /var/日志/nginx/demo-route.日志 route;
```

修改后记得：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 使用技巧

- 每个 服务端 块只服务明确域名，未知域名交给默认 服务端。
- 简单路径优先用前缀 location，复杂需求再用正则。
- API、静态资源、SPA fallback 的 location 顺序要清晰。
- 用 `curl -H 'Host: ...' http://127.0.0.1` 可以绕过 DNS 直接验证 服务端 匹配。
- 子路径部署时重点检查 `root`、`alias`、前端 未译87073/未译64029Path 是否一致。

## 难点

- location 不是简单从上到下匹配，存在优先级规则。
- `/接口` 和 `/接口/` 是不同路径，配置时要明确。
- `proxy_pass` 末尾斜杠会改变转发路径，和 location 匹配一起影响结果。
- 默认 服务端 可能接住不匹配域名，导致访问结果看起来“串站”。

## 重点

- `服务端` 先按端口和 Host 匹配，`location` 再按 U未译25173I 匹配。
- 精确匹配优先，普通前缀看最长，正则要谨慎。
- `root` 是拼接 U未译25173I，`alias` 是替换 location 前缀。
- 复杂匹配要用 curl 和日志验证，不靠猜。

## 练习

1. 配置两个 服务端，分别用不同 `服务端_name` 返回不同文本，用 Host 头验证。
2. 配置 `location = /health`、`location /接口/`、`location /`，观察不同路径命中。
3. 分别用 `root` 和 `alias` 映射静态目录，观察真实文件路径差异。
4. 故意让 `/接口` 和 `/接口/` 表现不同，再补充跳转规则。
