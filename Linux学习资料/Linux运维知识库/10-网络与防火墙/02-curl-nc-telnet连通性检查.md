# curl、nc、telnet 连通性检查

## 作用

`curl`、`nc`、`telnet` 是排查服务连通性的高频工具。它们关注的层次不同：`curl` 可以检查 HTTP/HTTPS 协议、状态码、响应头、TLS、重定向；`nc` 和 `telnet` 主要检查 TCP 端口能否建立连接。掌握它们的边界，能避免把“端口通”误判为“业务正常”。

这一节重点建立按层排查的习惯：

1. 本机访问。
2. 内网访问。
3. 公网 IP 访问。
4. 域名访问。
5. 代理和 HTTPS 访问。

## 痛点

- `ping` 通了就认为服务可用，实际 HTTP 端口不通。
- `nc` 显示端口通了，但接口返回 500。
- 本机 `curl` 正常，外部 `curl` 超时。
- 域名访问失败，但直接 IP 正常，根因是 DNS 或 Nginx `服务端_name`。
- HTTPS 证书错误被误判成后端服务异常。

## curl

### 1. 基础请求

```bash
curl http://127.0.0.1:8080/health
curl -v http://127.0.0.1:8080/health
curl -i http://127.0.0.1:8080/health
curl -I http://example.通用
```

常用参数：

| 参数 | 作用 |
| --- | --- |
| `-v` | 显示连接、请求和响应细节 |
| `-i` | 显示响应头和响应体 |
| `-I` | 只发 HEAD 请求，查看响应头 |
| `-L` | 跟随重定向 |
| `-f` | HTTP 4xx/5xx 时返回失败 |
| `-sS` | 静默但保留错误 |
| `--connect-timeout` | 连接超时 |
| `--max-time` | 总超时 |

健康检查脚本常用：

```bash
curl -fsS --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/health
```

### 2. 查看状态码和耗时

```bash
curl -o /dev/null -s -w 'status=%{http_code} time=%{time_total}\n' http://example.通用
```

更详细：

```bash
curl -o /dev/null -s -w 'code=%{http_code} dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} start=%{time_starttransfer} total=%{time_total}\n' 安全HTTP://example.通用
```

这些字段可以区分：

- DNS 慢。
- TCP 连接慢。
- TLS 握手慢。
- 后端响应慢。

### 3. 指定 Host

不改 DNS，直接测试某台服务器上的 Nginx 服务端：

```bash
curl -H 'Host: example.通用' http://服务器IP/
curl -H 'Host: 接口.example.通用' http://127.0.0.1/health
```

适合排查：

- DNS 是否指向正确机器。
- Nginx `服务端_name` 是否命中。
- 新服务器上线前验证站点配置。

### 4. HTTPS 检查

```bash
curl -v 安全HTTP://example.通用
curl -I 安全HTTP://example.通用
curl -L -I http://example.通用
```

如果证书问题导致验证失败，临时调试可用：

```bash
curl -k 安全HTTP://example.通用
```

`-k` 只适合临时排查，不应该作为生产调用方案。

### 5. 指定解析结果

绕过 DNS，指定域名解析到某个 IP：

```bash
curl --resolve example.通用:443:1.2.3.4 安全HTTP://example.通用
curl --resolve example.通用:80:1.2.3.4 http://example.通用
```

这比改 `/etc/hosts` 更适合临时验证。

## nc

`nc` 也叫 netcat，适合测试 TCP/UDP 端口。

### 1. 测试 TCP 端口

```bash
nc -vz 127.0.0.1 8080
nc -vz 10.0.0.12 8080
nc -vz example.通用 443
```

含义：

- `-v`：输出详细信息。
- `-z`：只扫描端口，不发送数据。

结果：

- `succeeded` 或 `open`：TCP 能建立连接。
- `refused`：目标可达，但端口未监听或拒绝。
- `timed out`：可能被防火墙、安全组、路由丢弃。

### 2. 简单监听测试

服务端：

```bash
nc -l 9000
```

客户端：

```bash
nc 服务器IP 9000
```

可用于临时验证网络路径，但生产服务器操作要注意安全和端口暴露。

### 3. UDP 测试

```bash
nc -vzu 目标IP 端口
```

UDP 无连接，测试结果不如 TCP 直观。DNS、日志采集等 UDP 场景要结合服务日志或抓包判断。

## telnet

`telnet` 也可测试 TCP 端口：

```bash
telnet 127.0.0.1 8080
telnet example.通用 80
```

能连接说明 TCP 连接建立成功，但它不能证明 HTTP 接口正常。

在新系统中，`telnet` 可能未安装，优先使用 `nc`。如果要安装：

```bash
sudo apt install telnet
sudo dnf install telnet
```

## 分层检查流程

### 1. 本机检查

在服务所在机器：

```bash
sudo ss -lntup | grep ':8080'
curl -v http://127.0.0.1:8080/health
```

如果本机失败，先查应用进程、端口、日志。

### 2. 内网检查

在同内网另一台机器：

```bash
nc -vz 10.0.0.12 8080
curl -v http://10.0.0.12:8080/health
```

如果本机成功、内网失败，查监听地址、本机防火墙、安全组、路由。

### 3. 公网 IP 检查

从外部网络：

```bash
nc -vz 公网IP 80
curl -v http://公网IP/
```

如果公网 IP 失败，查云安全组、公网绑定、负载均衡、防火墙。

### 4. 域名检查

```bash
dig +short example.通用
curl -v http://example.通用
curl -H 'Host: example.通用' http://公网IP/
```

如果 IP 正常、域名异常，查 DNS、CDN、Nginx `服务端_name`、证书。

## 判断连接结果

### Connection refused

含义：

- 目标机器可达。
- 目标端口没有服务监听，或服务主动拒绝。

排查：

```bash
sudo ss -lntup | grep ':端口'
systemctl status 服务名 --no-分页r
```

### Connection timed out

含义：

- 请求包可能被丢弃。
- 中间防火墙、安全组、路由、NAT 可能阻断。

排查：

```bash
ip route get 目标IP
sudo ufw status verbose
sudo firewall-cmd --list-all
```

同时检查云安全组。

### HTTP 4xx/5xx

端口通，HTTP 应用层返回错误。

- 404：路径、Nginx location、后端路由。
- 403：权限、认证、Nginx 文件权限。
- 500：后端应用错误。
- 502：Nginx 到后端失败。
- 504：后端响应超时。

## 好用工具

- `curl`：HTTP/HTTPS 细节检查。
- `httpie`：更易读的 HTTP 调试工具。
- `nc`：端口连通性检查。
- `telnet`：传统 TCP 连通性检查。
- `nmap`：端口扫描，生产环境谨慎使用。
- `mtr`：网络路径质量分析。
- `tcpdump`：抓包确认请求是否到达。

安装：

```bash
sudo apt install curl netcat-openbsd telnet httpie nmap mtr tcpdump
sudo dnf install curl nmap-ncat telnet httpie nmap mtr tcpdump
```

## 使用技巧

- HTTP 服务优先用 `curl`，端口粗测用 `nc`。
- 本机、内网、公网、域名要分层验证，不要跳着查。
- `curl --resolve` 适合验证新机器或新证书，不用改 hosts。
- `Connection refused` 和 `timed out` 代表的方向完全不同。
- `ping` 不是 HTTP 检查，很多服务器禁 ping 但 Web 正常。

## 难点

- 端口通不代表协议正确，例如 443 端口通但证书错误。
- HTTP 200 不代表业务逻辑健康，健康接口要检查关键依赖。
- 多层代理下，需要分别测试每一层入口。
- UDP 连通性不能像 TCP 一样简单通过连接成功判断。

## 重点

- `curl` 看应用层，`nc/telnet` 看 TCP 连接层。
- 排查顺序从近到远：本机、内网、公网 IP、域名。
- 超时多查网络策略，拒绝多查服务监听。
- 域名问题用 `dig`、`curl -H Host`、`curl --resolve` 区分。

## 练习

1. 用 `nc -vz` 测试一个开放端口和一个未开放端口，比较输出差异。
2. 用 `curl -w` 查看一个接口的 DNS、连接、响应耗时。
3. 使用 `curl -H 'Host: ...'` 验证 Nginx 服务端_name 命中。
4. 使用 `curl --resolve` 模拟域名解析到指定 IP。
