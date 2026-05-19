# Nginx 日志与访问链路判断

## 作用

Nginx 位于外部请求和后端服务之间。它的日志可以判断请求是否到达服务器、命中了哪个路径、返回了什么状态码、是否成功转发到后端。访问链路排查时，Nginx access 日志 和 error 日志 往往是区分“请求没到”“代理失败”“后端失败”“静态资源错误”的关键证据。

这一节重点解决：

- access 日志 和 error 日志 分别看什么。
- 如何判断请求是否到达 Nginx。
- 如何区分 404、403、502、504、499。
- 如何通过 upstream 日志判断后端响应。
- 如何把 Nginx 日志和后端日志串起来。

## 痛点

- 用户访问失败，Nginx access 日志 没请求，说明根本没到服务器却还在查后端。
- access 日志 有 502，但只重启 Nginx，实际是后端端口没监听。
- 前端刷新 404，被误判为后端接口问题。
- 403 是目录权限问题，却一直排查前端构建。
- 多实例 upstream 中某台异常，导致间歇性 502。

## access 日志 看什么

默认日志通常类似：

```text
10.0.0.1 - - [11/May/2026:10:00:00 +0800] "GET /接口/health HTTP/1.1" 200 42 "-" "curl/8.0"
```

核心字段：

- 客户端 IP。
- 时间。
- 请求方法和路径。
- HTTP 状态码。
- 响应大小。
- Referer。
- 用户-Agent。

查看：

```bash
tail -f /var/日志/nginx/access.日志
grep 'GET /接口/health' /var/日志/nginx/access.日志
grep ' 502 ' /var/日志/nginx/access.日志 | tail
```

状态码统计：

```bash
awk '{print $9}' /var/日志/nginx/access.日志 | sort | uniq -c | sort -nr
```

访问路径 Top：

```bash
awk '{print $7}' /var/日志/nginx/access.日志 | sort | uniq -c | sort -nr | head
```

## error 日志 看什么

查看：

```bash
tail -n 100 /var/日志/nginx/error.日志
tail -f /var/日志/nginx/error.日志
```

常见错误：

| 错误片段 | 判断方向 |
| --- | --- |
| `connect() failed (111: Connection refused)` | 后端端口没监听或拒绝 |
| `upstream timed out` | 后端响应超时 |
| `no live upstreams` | upstream 没可用实例 |
| `permission denied` | 静态文件或目录权限不足 |
| `No such file or directory` | 静态文件路径不存在 |
| `客户端 intended to send too large body` | 上传超过限制 |

error 日志 是排查 502、403、静态资源缺失的关键。

## 请求是否到达 Nginx

### 1. access 日志 没记录

可能原因：

- DNS 指向错误。
- CDN 或负载均衡没有转发到这台机器。
- 云安全组拦截。
- 本机防火墙拦截。
- 请求访问的是另一台实例。
- 客户端网络问题。

验证：

```bash
dig +short example.通用
curl -H 'Host: example.通用' http://服务器IP/
sudo tcpdump -nn -i any tcp port 80
```

### 2. access 日志 有记录

说明请求已经到达 Nginx。下一步看状态码和 error 日志。

```bash
grep '请求路径' /var/日志/nginx/access.日志 | tail
tail -n 100 /var/日志/nginx/error.日志
```

## 状态码判断

### 1. 502 Bad Gateway

Nginx 到上游失败。

排查：

```bash
tail -n 100 /var/日志/nginx/error.日志
sudo ss -lntup | grep ':8080'
curl -v http://127.0.0.1:8080/health
systemctl status demo-接口 --no-分页r
journalctl -u demo-接口 -n 100 --no-分页r
```

常见原因：

- 后端没启动。
- 端口写错。
- 后端监听地址不对。
- 后端进程崩溃。
- upstream 某个实例不可用。

### 2. 504 Gateway Timeout

Nginx 等后端响应超时。

排查：

```bash
tail -n 100 /var/日志/nginx/error.日志
curl -w 'total=%{time_total}\n' -o /dev/null -s http://127.0.0.1:8080/slow-接口
journalctl -u demo-接口 -n 200 --no-分页r
```

方向：

- 后端慢。
- 数据库慢。
- 外部依赖慢。
- 线程池耗尽。
- Nginx 超时设置过短。

### 3. 404 Not Found

分两种：

- Nginx 静态文件 404。
- 后端接口 404。

判断：

```bash
tail -n 100 /var/日志/nginx/error.日志
curl -i http://127.0.0.1:8080/接口/path
curl -i http://example.通用/接口/path
```

如果 error 日志 有 `open() ... failed (2: No such file or directory)`，多半是静态文件或 root 路径问题。

### 4. 403 Forbidden

常见原因：

- 文件权限不足。
- 目录权限不足。
- 缺少 首页 文件。
- 安全策略限制。

排查：

```bash
tail -n 100 /var/日志/nginx/error.日志
namei -l /opt/apps/demo-web/current/首页.html
ps aux | grep '[n]ginx'
```

### 5. 499 Client Closed Request

Nginx 特有状态，表示客户端提前断开。

可能原因：

- 用户取消请求。
- 客户端超时。
- 后端响应太慢。
- 负载均衡提前断开。

如果 499 大量增加，要结合后端耗时和客户端超时排查。

## upstream 日志增强

默认 access 日志 不一定包含 upstream 信息。建议为 API 配置增强格式：

```nginx
日志_formatat upstream_timing '$remote_addr host=$host "$request" '
                           'status=$status request_time=$request_time '
                           'upstream_addr=$upstream_addr '
                           'upstream_status=$upstream_status '
                           'upstream_response_time=$upstream_response_time';

access_日志 /var/日志/nginx/demo-接口.access.日志 upstream_timing;
```

字段含义：

- `request_time`：Nginx 从接收到响应完成的总耗时。
- `upstream_addr`：实际请求的后端地址。
- `upstream_status`：后端返回状态。
- `upstream_response_time`：后端响应耗时。

修改后：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 访问链路判断模板

```text
1. 用户访问失败
2. 查 access 日志 是否有请求
   - 没有：DNS/CDN/安全组/负载均衡
   - 有：继续看状态码
3. 状态码
   - 502：查后端端口和服务
   - 504：查后端耗时和超时
   - 403：查文件权限和安全策略
   - 404：查 Nginx root/location 或后端路由
   - 499：查客户端超时和后端慢
4. 查 error 日志 关键错误
5. 查后端日志和健康检查
6. 修复后再次 curl 验证
```

## 好用工具

- `goaccess`：分析 access 日志 状态码、路径、来源。
- `lnav`：同时查看 Nginx 和应用日志。
- `awk`：快速统计状态码和路径。
- `curl -w`：测量请求耗时。
- `tcpdump`：确认请求是否到达服务器。

示例：

```bash
goaccess /var/日志/nginx/access.日志 -c
```

## 使用技巧

- access 日志 判断请求是否到达，error 日志 判断 Nginx 处理失败原因。
- 502/504 必须查后端端口和应用日志。
- 404 要区分 Nginx 静态 404 和后端接口 404。
- 为 API 配置 upstream timing 日志，排查慢请求非常有用。
- 多台机器部署时，先确认请求落在哪台机器。

## 难点

- 多层代理时，每层状态码可能不同，要逐层看日志。
- CDN 缓存会让源站没有日志，但用户仍看到旧错误。
- Nginx access 日志 时间和应用日志时间格式可能不同。
- 负载均衡随机转发会导致问题间歇出现。

## 重点

- Nginx 是访问链路证据入口。
- access 日志 没请求，不要先查应用。
- error 日志 的错误片段通常能直接指向权限、上游、路径、超时。
- upstream timing 能把 Nginx 慢和后端慢区分开。

## 练习

1. 制造后端停止，观察 access 日志 的 502 和 error 日志 的 connect failed。
2. 制造静态文件不存在，观察 error 日志 的 open failed。
3. 配置 upstream timing 日志，访问后观察 upstream_response_time。
4. 使用 goaccess 分析一次 Nginx access 日志。
