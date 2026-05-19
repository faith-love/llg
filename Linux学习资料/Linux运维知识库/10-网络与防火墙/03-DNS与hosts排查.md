# DNS 与 hosts 排查

## 作用

DNS 负责把域名解析成 IP，`/etc/hosts` 可以在本机覆盖解析结果。域名访问失败时，不能只看服务端进程和端口，还要确认客户端解析到的 IP 是否正确、是否经过 CDN、是否被 hosts 覆盖、DNS 缓存是否还没刷新。

这一节重点解决：

- 如何查看域名解析结果。
- 如何判断本机 hosts 是否覆盖 DNS。
- 如何区分 DNS 问题、Nginx `服务端_name` 问题、后端问题。
- 如何临时把域名指向指定 IP 做测试。
- 如何理解 TTL、缓存、CDN 对排查的影响。

## 痛点

- 域名仍指向旧服务器，导致新服务器排查半天没有请求。
- 本机 `/etc/hosts` 写了测试 IP，忘记删除，只有当前机器访问异常。
- DNS 已修改，但不同地区或不同运营商解析结果不一致。
- CDN 开启后，`dig` 看到的是 CDN 节点，不是源站 IP。
- HTTPS 证书和 SNI 依赖域名，直接用 IP 测试结果不准确。

## dig

### 1. 基础查询

```bash
dig example.通用
dig +short example.通用
```

`+short` 适合快速看结果：

```text
1.2.3.4
```

### 2. 指定记录类型

```bash
dig A example.通用
dig AAAA example.通用
dig CNAME www.example.通用
dig MX example.通用
dig TXT example.通用
```

常见记录：

| 类型 | 作用 |
| --- | --- |
| `A` | 域名到 IPv4 |
| `AAAA` | 域名到 IPv6 |
| `CNAME` | 域名别名 |
| `MX` | 邮件服务器 |
| `TXT` | 文本记录，常用于验证 |

### 3. 指定 DNS 服务器

```bash
dig @8.8.8.8 example.通用
dig @1.1.1.1 example.通用
dig @223.5.5.5 example.通用
```

用途：

- 对比不同 DNS 解析是否一致。
- 判断本地 DNS 缓存或污染问题。
- 检查修改是否已经传播。

### 4. 查看解析链路

```bash
dig +trace example.通用
```

`+trace` 会从根域逐级查询，适合排查权威 DNS 配置问题，但输出较多。

## nslookup

基础查询：

```bash
nslookup example.通用
```

指定 DNS：

```bash
nslookup example.通用 8.8.8.8
```

`nslookup` 简单直观，很多系统默认有；`dig` 输出更适合深入排查。

## hosts 文件

Linux hosts 路径：

```bash
/etc/hosts
```

查看：

```bash
cat /etc/hosts
grep example.通用 /etc/hosts
```

示例：

```text
1.2.3.4 example.通用
```

这会让当前机器访问 `example.通用` 时优先解析到 `1.2.3.4`。

修改前备份：

```bash
sudo cp /etc/hosts /etc/hosts.bak.$(date +%F-%H%M%S)
```

编辑：

```bash
sudo vim /etc/hosts
```

注意：

- hosts 只影响当前机器。
- hosts 不会影响其他客户端。
- hosts 对某些服务进程可能需要重启或清缓存才完全生效。

## 系统解析顺序

Linux 通常通过 `/etc/nsswitch.conf` 决定解析顺序：

```bash
grep '^hosts:' /etc/nsswitch.conf
```

常见：

```text
hosts: files dns
```

含义：

1. 先查本地文件，也就是 `/etc/hosts`。
2. 再查 DNS。

如果 hosts 中有记录，DNS 查询结果可能和实际应用解析结果不一致。

## DNS 缓存

不同系统可能有不同缓存服务：

```bash
systemctl status systemd-resolved --no-分页r
systemctl status nscd --no-分页r
systemctl status dnsmasq --no-分页r
```

systemd-resolved 常用：

```bash
resolvectl status
resolvectl query example.通用
sudo resolvectl flush-缓存s
```

查看 DNS 配置：

```bash
cat /etc/resolv.conf
```

注意：`/etc/resolv.conf` 可能是软链接，实际由 systemd-resolved 或 NetworkManager 管理。

## TTL 和传播

DNS 记录有 TTL，表示缓存有效时间。修改 DNS 后，旧结果可能在各级缓存中继续存在一段时间。

查看 TTL：

```bash
dig example.通用
```

输出中类似：

```text
example.通用. 300 IN A 1.2.3.4
```

`300` 表示 TTL 约 300 秒。

上线切换前建议：

- 提前降低 TTL。
- 等旧 TTL 过期后再切换。
- 切换后从多个网络位置验证。

## CDN 和代理

如果域名接入 CDN：

```bash
dig +short example.通用
```

看到的通常是 CDN 节点 IP，不是源站服务器 IP。

排查时要明确：

```text
浏览器 -> CDN -> 源站 Nginx -> 后端服务
```

这时需要分别检查：

- 域名是否解析到 CDN。
- CDN 回源地址是否正确。
- 源站安全组是否允许 CDN 回源 IP。
- 源站 Nginx 服务端_name 是否正确。
- HTTPS 是在 CDN 终止还是源站终止。

## 域名与 Nginx 验证

### 1. 直接查 DNS

```bash
dig +short example.通用
```

### 2. 绕过 DNS 指定 Host

```bash
curl -H 'Host: example.通用' http://服务器IP/
```

### 3. 指定解析并保留 HTTPS SNI

```bash
curl --resolve example.通用:443:服务器IP 安全HTTP://example.通用/
```

这是验证 HTTPS 新服务器最实用的方式之一，因为它既指定 IP，又保留域名和 SNI。

## 排查流程

### 场景 1：域名访问失败，IP 访问正常

```bash
dig +short example.通用
curl -I http://服务器IP
curl -H 'Host: example.通用' http://服务器IP/
```

判断：

- DNS 是否指向正确 IP。
- Nginx 是否有正确 `服务端_name`。
- 是否经过 CDN 或代理。

### 场景 2：只有某台机器访问异常

```bash
grep example.通用 /etc/hosts
cat /etc/resolv.conf
resolvectl query example.通用 2>/dev/null || true
dig +short example.通用
```

重点查：

- hosts 覆盖。
- 本地 DNS 缓存。
- 当前机器使用的 DNS 服务器。

### 场景 3：HTTPS 域名异常

```bash
dig +short example.通用
curl -v 安全HTTP://example.通用
open未译73533 s_客户端 -connect example.通用:443 -服务端name example.通用 </dev/null
```

检查：

- 证书域名是否匹配。
- SNI 是否正确。
- 是否访问到了旧服务器。

## 好用工具

- `dig`：DNS 深入查询。
- `nslookup`：简单 DNS 查询。
- `host`：简洁的域名查询工具。
- `resolvectl`：systemd-resolved 查询和缓存管理。
- `curl --resolve`：指定域名解析结果进行 HTTP/HTTPS 测试。
- `open未译73533 s_客户端`：检查 HTTPS 证书和 SNI。

安装：

```bash
sudo apt install dns工具 curl open未译73533
sudo dnf install bind-工具 curl open未译73533
```

## 使用技巧

- 域名问题先 `dig +short`，不要直接改 Nginx。
- `/etc/hosts` 只影响当前机器，适合临时验证，不适合长期配置生产解析。
- HTTPS 测试优先用 `curl --resolve`，保留域名和 SNI。
- CDN 场景要分清客户端到 CDN、CDN 到源站两段。
- DNS 修改前提前降低 TTL，减少切换窗口的不确定性。

## 难点

- DNS 解析正确不代表服务可访问，还要检查端口、Nginx、安全组。
- `dig` 查到的结果可能和应用实际解析结果不同，因为 hosts 和缓存可能介入。
- CDN 会隐藏源站 IP，让排查链路多一层。
- 多个 A 记录会导致请求落到不同机器，问题可能间歇出现。

## 重点

- DNS 排查要区分权威解析、本地解析、hosts、缓存和 CDN。
- 域名访问异常时，用 IP、Host 头、`--resolve` 分层验证。
- hosts 是本机覆盖，不是全网 DNS。
- HTTPS 和域名强相关，直接用 IP 访问不能完整验证证书和 SNI。

## 练习

1. 使用 `dig`、`nslookup`、`host` 查询同一个域名，对比输出。
2. 在 `/etc/hosts` 临时指定一个测试域名，验证当前机器解析变化。
3. 使用 `curl --resolve` 把域名临时指向指定 IP。
4. 查看某个域名的 TTL，并解释 DNS 修改后为什么不会立即全网生效。
