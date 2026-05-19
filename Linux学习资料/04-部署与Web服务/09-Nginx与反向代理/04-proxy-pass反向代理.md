# proxy_pass Nginx

## 作用

`proxy_pass` 让 Nginx 把客户端请求转发给后端服务。常见链路是“浏览器访问域名 -> Nginx 监听 80/443 -> 转发到本机或内网后端端口”。Nginx可以隐藏后端端口、统一 HTTPS、添加请求头、做简单负载均衡、记录访问日志。

这一节重点掌握：

- 基础Nginx配置。
- `Host`、`X-Real-IP`、`X-For网页归档ded-For`、`X-For网页归档ded-Proto` 的作用。
- `proxy_pass` 末尾斜杠对路径的影响。
- upstream 多后端转发。
- 超时、上传大小、WebSocket 的常见配置。

## 痛点

- 后端本机 `curl` 正常，域名访问 502。
- `proxy_pass` 末尾多了或少了 `/`，后端收到的路径不对。
- 后端日志里客户端 IP 全是 `127.0.0.1`。
- HTTPS 入口转发到后端后，后端以为请求是 HTTP。
- WebSocket 连接失败，因为缺少 Upgrade 头。
- 上传文件返回 413，因为 Nginx 限制过小。

## 基础配置

后端监听：

```text
127.0.0.1:8080
```

Nginx：

```nginx
服务端 {
    listen 80;
    服务端_name 接口.example.通用;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
        proxy_set_header X-For网页归档ded-Proto $scheme;
    }
}
```

验证：

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I http://接口.example.通用
curl -f http://127.0.0.1:8080/health
```

## 请求头

### 1. Host

```nginx
proxy_set_header Host $host;
```

作用：

- 把原始域名传给后端。
- 后端做多租户、回调地址、域名判断时会用到。

如果不设置，后端可能看到上游地址或默认值。

### 2. X-Real-IP

```nginx
proxy_set_header X-Real-IP $remote_addr;
```

表示直接连接 Nginx 的客户端 IP。

### 3. X-For网页归档ded-For

```nginx
proxy_set_header X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
```

表示代理链路上的 IP 列表。每经过一层代理，通常会追加一个 IP。

后端要正确获取真实 IP，需要信任的代理范围配置配合，不能盲目信任任意客户端传来的 `X-For网页归档ded-For`。

### 4. X-For网页归档ded-Proto

```nginx
proxy_set_header X-For网页归档ded-Proto $scheme;
```

用于告诉后端原始请求是 `http` 还是 `安全HTTP`。很多后端生成绝对 URL、判断安全 Cookie、做跳转时会用。

## proxy_pass 斜杠规则

这是最容易出错的点。

### 1. 不带 URI

```nginx
location /接口/ {
    proxy_pass http://127.0.0.1:8080;
}
```

请求：

```text
/接口/用户s
```

后端收到：

```text
/接口/用户s
```

### 2. 带 `/`

```nginx
location /接口/ {
    proxy_pass http://127.0.0.1:8080/;
}
```

请求：

```text
/接口/用户s
```

后端收到：

```text
/用户s
```

### 3. 选择规则

如果后端接口本身就是 `/接口/用户s`，用：

```nginx
proxy_pass http://127.0.0.1:8080;
```

如果前端对外用 `/接口/用户s`，后端实际是 `/用户s`，用：

```nginx
proxy_pass http://127.0.0.1:8080/;
```

部署前要明确后端真实路由，不要靠试错上线。

## upstream 负载转发

```nginx
upstream demo_接口 {
    服务端 127.0.0.1:8080;
    服务端 127.0.0.1:8081;
}

服务端 {
    listen 80;
    服务端_name 接口.example.通用;

    location / {
        proxy_pass http://demo_接口;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
        proxy_set_header X-For网页归档ded-Proto $scheme;
    }
}
```

常用参数：

```nginx
upstream demo_接口 {
    服务端 127.0.0.1:8080 max_fails=3 fail_timeout=30s;
    服务端 127.0.0.1:8081 max_fails=3 fail_timeout=30s;
}
```

说明：

- 开源 Nginx 的被动失败检测有限，不等于完整健康检查系统。
- 如果要灰度、主动健康检查、服务发现，通常需要更完整的网关或负载均衡方案。

## 超时配置

```nginx
location / {
    proxy_connect_timeout 3s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    proxy_pass http://127.0.0.1:8080;
}
```

含义：

- `proxy_connect_timeout`：连接后端超时。
- `proxy_send_timeout`：向后端发送请求超时。
- `proxy_read_timeout`：等待后端响应超时。

如果后端有长耗时接口，不要盲目把超时调很大。应先判断接口是否应异步化或优化。

## 上传大小

默认上传大小可能不满足业务。配置：

```nginx
客户端_max_body_size 50m;
```

可放在 `http`、`服务端` 或 `location` 中。

返回 413 时排查：

```bash
tail -n 100 /var/日志/nginx/error.日志
```

注意：后端应用也可能有上传大小限制，Nginx 调大后还要检查后端配置。

## WebSocket

WebSocket 需要 Upgrade 头：

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

如果同一 服务端 里多处需要 WebSocket，可以在 `http` 段使用 map：

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
```

然后：

```nginx
proxy_set_header Connection $connection_upgrade;
```

## 代理排查流程

```bash
# 1. Nginx 配置是否正确
sudo nginx -t
sudo nginx -T | grep -n 'proxy_pass'

# 2. Nginx 是否运行
systemctl status nginx --no-分页r
sudo ss -lntup | grep ':80'

# 3. 后端是否监听
sudo ss -lntup | grep ':8080'
curl -v http://127.0.0.1:8080/health

# 4. 经 Nginx 访问
curl -v -H 'Host: 接口.example.通用' http://127.0.0.1/health

# 5. 日志
tail -n 100 /var/日志/nginx/error.日志
journalctl -u demo-接口 -n 100 --no-分页r
```

## 好用工具

- `curl -v`：查看请求、响应、跳转和连接细节。
- `httpie`：更友好的 HTTP 调试工具。
- `jq`：格式化 JSON 响应。
- `ss`、`lsof`：查看端口和进程。
- `tcpdump`：高级网络抓包，排查复杂链路时使用。
- `goaccess`：分析 Nginx access 日志。

## 使用技巧

- 后端只给 Nginx 访问时，优先监听 `127.0.0.1`。
- `proxy_pass` 是否保留 `/接口/` 要和后端路由一致。
- Nginx必须带常见转发头，方便后端识别真实域名、IP、协议。
- 502 先检查后端本机健康检查，不要直接改 Nginx。
- WebSocket、上传、长请求都需要额外配置。

## 难点

- `proxy_pass` 末尾斜杠会改变 URI，和 location 前缀一起影响最终路径。
- 后端日志中的真实 IP 需要后端信任代理配置配合。
- HTTPS 终止在 Nginx 时，后端需要通过 `X-For网页归档ded-Proto` 感知原始协议。
- 上游多实例时，某一个实例异常可能导致间歇性错误。

## 重点

- Nginx链路必须分层验证：Nginx、后端端口、本机 curl、域名 curl、日志。
- `proxy_set_header` 是生产代理配置的基本项。
- `proxy_pass` 斜杠规则上线前必须明确。
- 超时和上传大小要按业务设置，不能只依赖默认值。

## 练习

1. 配置 `/接口/` 代理到本机 8080，分别测试 proxy_pass 带 `/` 和不带 `/`。
2. 在后端打印请求头，确认 Host、X-Real-IP、X-For网页归档ded-For。
3. 配置一个 upstream，代理到两个本地测试端口。
4. 模拟后端停止，观察 Nginx 502 和 error 日志。
