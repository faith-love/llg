# 02 网络诊断与 HTTP 调试工具

网络问题要分层排查：域名解析、端口连通、HTTP 响应、TLS 证书、路由链路、防火墙和安全组。`curl`、`dig`、`mtr`、`nmap` 这些工具分别回答不同问题，不能混用结论。

## 排查顺序

```text
域名是否解析正确 -> 端口是否可达 -> HTTP 是否正常 -> 证书是否正常 -> 链路是否丢包 -> 防火墙是否放行
```

## curl

### 作用

`curl` 是 HTTP 调试和健康检查的核心工具。

### 常用命令

查看响应头：

```bash
curl -I https://example.com
```

显示详细过程：

```bash
curl -v https://example.com
```

检查本机后端：

```bash
curl -fsS http://127.0.0.1:8080/health
```

指定 Host 头：

```bash
curl -H "Host: example.com" http://127.0.0.1
```

查看耗时：

```bash
curl -o /dev/null -s -w "status=%{http_code} time=%{time_total}\n" https://example.com
```

POST JSON：

```bash
curl -X POST https://example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"******"}'
```

### 注意事项

- 不要把真实 Token、Cookie、密码贴到共享记录中。
- `curl -k` 会跳过证书校验，只能用于临时验证，不应作为长期方案。
- `curl` 成功只能说明当前机器到目标可访问，不代表所有用户都可访问。

## httpie

### 作用

`httpie` 是更友好的 HTTP 客户端，JSON 输出可读性更好。

### 示例

```bash
http GET http://127.0.0.1:8080/health
http POST http://127.0.0.1:8080/api/users name=demo
```

带请求头：

```bash
http GET https://example.com/api/me "Authorization:Bearer token"
```

### 使用建议

- 开发和测试环境调试 API 很方便。
- 生产排障仍要熟练掌握 `curl`，因为它更普遍。

## dig

### 作用

`dig` 用于 DNS 查询，回答“域名解析到了哪里”。

### 示例

查看 A 记录：

```bash
dig example.com
dig +short example.com
```

指定 DNS 服务器：

```bash
dig @8.8.8.8 example.com
dig @1.1.1.1 example.com
```

查看 CNAME：

```bash
dig example.com CNAME
```

查看 MX：

```bash
dig example.com MX
```

### 判断点

- 解析 IP 是否是预期服务器或负载均衡。
- TTL 是否过长。
- 不同 DNS 服务器结果是否一致。
- 是否存在旧记录未清理。

## mtr

### 作用

`mtr` 结合了 `ping` 和 `traceroute`，用于观察网络路径和丢包。

### 示例

```bash
mtr example.com
mtr -rw example.com
```

### 读结果

- 末跳丢包才更能说明目标路径问题。
- 中间跳丢包但后续正常，可能只是中间设备限制 ICMP。
- 云厂商可能禁 ICMP，不代表 HTTP 不通。

### 注意事项

- 网络链路问题要从多个地点测试。
- 国内外、不同运营商结果可能差异很大。

## nmap

### 作用

`nmap` 用于端口扫描和暴露面验证。

### 示例

扫描指定端口：

```bash
nmap -Pn -p 22,80,443 example.com
```

扫描常见端口：

```bash
nmap -Pn --top-ports 100 example.com
```

扫描内网主机端口：

```bash
nmap -p 1-10000 10.0.0.10
```

### 使用边界

- 只扫描自己有授权的主机。
- 不要对无授权目标做端口扫描。
- 扫描结果要结合云安全组、系统防火墙、服务监听一起判断。

## ss 与 nc

### ss

查看本机监听：

```bash
ss -lntup
```

查看连接：

```bash
ss -antp
```

### nc

测试 TCP 端口：

```bash
nc -vz 127.0.0.1 8080
nc -vz db.example.com 3306
```

如果没有 `nc`，可临时用：

```bash
timeout 3 bash -c '</dev/tcp/127.0.0.1/8080' && echo ok
```

## 常见场景

### 域名访问失败

```bash
dig +short example.com
curl -v https://example.com
```

如果解析 IP 不对，查 DNS 记录；如果解析正确但连接失败，查安全组、防火墙和服务。

### Nginx 502

```bash
curl -v http://127.0.0.1:8080/health
ss -lntup | grep 8080
tail -n 100 /var/log/nginx/error.log
```

### 端口公网暴露验证

从外部机器执行：

```bash
nmap -Pn -p 22,80,443,3306,6379 server_ip
```

内部服务端口不应出现在公网开放列表里。

## 工具对照

| 问题 | 工具 |
| --- | --- |
| 域名解析到哪里 | `dig` |
| HTTP 响应是否正常 | `curl` / `httpie` |
| 本机端口是否监听 | `ss` |
| 远端端口是否可达 | `nc` |
| 公网暴露了哪些端口 | `nmap` |
| 链路是否丢包 | `mtr` |

## 练习

1. 用 `dig` 查询一个域名的 A 记录和 CNAME。
2. 用 `curl -w` 输出 HTTP 状态码和总耗时。
3. 用 `ss` 查本机监听端口。
4. 用 `nmap` 扫描自己测试机开放的 22、80、443。
5. 用 `mtr -rw` 观察到目标域名的链路。
