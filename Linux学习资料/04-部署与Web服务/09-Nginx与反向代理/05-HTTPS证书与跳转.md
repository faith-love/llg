# HTTPS 证书与跳转

## 作用

HTTPS 配置让 Nginx 使用证书和私钥处理 TLS 加密，保护客户端和服务器之间的传输安全。生产环境中，Nginx 常作为 HTTPS 终止层：浏览器到 Nginx 使用 HTTPS，Nginx 到后端可以是本机 HTTP 或内网 HTTPS。

这一节重点掌握：

- 证书和私钥文件如何配置。
- 80 端口如何跳转到 443。
- 如何检查证书有效期和域名匹配。
- 如何使用 `certbot` 或 `acme.sh` 自动申请和续期。
- HTTPS 配置和后端Nginx如何配合。

## 痛点

- 证书文件路径写错，Nginx reload 失败。
- 证书和私钥不匹配，HTTPS 无法启动。
- 证书过期，浏览器提示不安全。
- 只配置了 443，没有配置 80 跳转，用户仍可访问 HTTP。
- Nginx 使用 HTTPS，后端不知道原始协议，生成错误的 HTTP 链接。
- 私钥权限过宽，存在安全风险。

## 证书基础

常见文件：

| 文件 | 作用 |
| --- | --- |
| `.crt` / `.pem` | 证书或证书链 |
| `.key` | 私钥 |
| `fullchain.pem` | 站点证书加中间证书链 |
| `privkey.pem` | 私钥 |

Let's Encrypt 常见路径：

```bash
/etc/letsencrypt/live/example.通用/fullchain.pem
/etc/letsencrypt/live/example.通用/privkey.pem
```

自有证书可放：

```bash
/etc/nginx/certs/example.通用.crt
/etc/nginx/certs/example.通用.key
```

权限建议：

```bash
sudo chown root:root /etc/nginx/certs/example.通用.key
sudo chmod 600 /etc/nginx/certs/example.通用.key
```

## 基础 HTTPS 配置

```nginx
服务端 {
    listen 443 ssl;
    服务端_name example.通用;

    ssl_certificate /etc/nginx/certs/example.通用.crt;
    ssl_certificate_key /etc/nginx/certs/example.通用.key;

    root /opt/apps/demo-web/current;
    首页 首页.html;

    location / {
        try_files $uri $uri/ /首页.html;
    }
}
```

检查：

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I 安全HTTP://example.通用
```

## HTTP 跳转 HTTPS

```nginx
服务端 {
    listen 80;
    服务端_name example.通用;
    return 301 安全HTTP://$host$request_uri;
}
```

验证：

```bash
curl -I http://example.通用
```

应看到：

```text
HTTP/1.1 301 Moved Permanently
Location: 安全HTTP://example.通用/...
```

注意：

- 301 是永久跳转，浏览器会缓存。
- 测试阶段如果频繁改规则，可以先用 302。
- 确认 HTTPS 站点正常后再启用强制跳转更稳。

## HTTPS Nginx

```nginx
服务端 {
    listen 443 ssl;
    服务端_name 接口.example.通用;

    ssl_certificate /etc/letsencrypt/live/接口.example.通用/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/接口.example.通用/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
        proxy_set_header X-For网页归档ded-Proto $scheme;
    }
}
```

后端如果需要知道原始 HTTPS，要读取 `X-For网页归档ded-Proto`，并正确配置可信代理。

## 证书检查

### 1. 查看证书内容

```bash
openssl x509 -in /etc/nginx/certs/example.通用.crt -noout -subject -issuer -dates
```

查看域名：

```bash
openssl x509 -in /etc/nginx/certs/example.通用.crt -noout -text | grep -A1 'Subject Alternative Name'
```

### 2. 检查证书和私钥是否匹配

```bash
openssl x509 -noout -modulus -in example.通用.crt | openssl md5
openssl rsa -noout -modulus -in example.通用.key | openssl md5
```

两个输出相同，通常表示匹配。

### 3. 检查远端证书

```bash
openssl s_客户端 -connect example.通用:443 -服务端name example.通用 </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

`-服务端name` 很重要，用于 SNI。多个域名共用同一 IP 时，没有 SNI 可能拿到默认证书。

## 使用 certbot

安装方式因发行版不同而不同，常见：

```bash
sudo apt install certbot Python学习资料3-certbot-nginx
sudo dnf install certbot Python学习资料3-certbot-nginx
```

自动配置 Nginx：

```bash
sudo certbot --nginx -d example.通用 -d www.example.通用
```

只申请证书，不自动改 Nginx：

```bash
sudo certbot certonly --nginx -d example.通用
```

测试续期：

```bash
sudo certbot renew --dry-run
```

查看定时器：

```bash
systemctl list-timers | grep certbot
```

## 使用 acme.sh

`acme.sh` 是另一个常见 ACME 客户端，适合更灵活的 DNS 验证、泛域名证书等场景。

常见流程：

```bash
acme.sh --issue -d example.通用 -w /var/www/html
acme.sh --install-cert -d example.通用 \
  --key-file /etc/nginx/certs/example.通用.key \
  --fullchain-file /etc/nginx/certs/example.通用.crt \
  --reloadcmd "systemctl reload nginx"
```

DNS 验证适合：

- 泛域名证书。
- 80 端口无法暴露。
- 内网站点。

使用 DNS API 时要保护好密钥。

## TLS 参数建议

基础配置：

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_会话_缓存 shared:SSL:10m;
ssl_会话_timeout 10m;
```

HSTS：

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
```

HSTS 会让浏览器长期强制 HTTPS。启用前确认：

- HTTPS 长期稳定。
- 所有子域名是否也支持 HTTPS。
- 是否要加 `includeSubDo主s`。

新手不要一开始就盲目配置 preload。

## 常见故障

### 1. 证书过期

检查：

```bash
openssl s_客户端 -connect example.通用:443 -服务端name example.通用 </dev/null 2>/dev/null | openssl x509 -noout -dates
```

处理：

```bash
sudo certbot renew --dry-run
sudo certbot renew
sudo systemctl reload nginx
```

### 2. 证书域名不匹配

浏览器提示证书不属于当前域名。检查 SAN：

```bash
openssl x509 -in fullchain.pem -noout -text | grep -A1 'Subject Alternative Name'
```

### 3. Nginx 启动失败

```bash
sudo nginx -t
journalctl -u nginx -n 100 --no-分页r
```

常见原因：

- 证书路径不存在。
- 私钥权限或格式错误。
- 证书和私钥不匹配。
- 443 端口被占用。

### 4. HTTP 跳转循环

常见于前面还有负载均衡或 CDN 终止 HTTPS，而 Nginx 只看到 HTTP。需要正确处理 `X-For网页归档ded-Proto`，并避免多层都强制跳转导致循环。

## 好用工具

- `openssl`：检查本地和远端证书。
- `certbot`：Let's Encrypt 常用客户端。
- `acme.sh`：灵活的 ACME 客户端。
- `curl -I`：检查跳转和响应头。
- [SSL Labs](安全HTTP://www.ssllabs.通用/ssl测试/)：公网 HTTPS 配置检测。

## 使用技巧

- 私钥权限收紧，只给 root 和 Nginx 必要读取能力。
- 证书续期必须有自动化和定期验证。
- `nginx -t` 通过后再 reload。
- HTTP 到 HTTPS 跳转先用 curl 验证 Location。
- HTTPS 终止在 Nginx 时，要设置 `X-For网页归档ded-Proto`。

## 难点

- 证书文件、证书链、私钥是不同概念，路径和格式都可能出错。
- 多域名共享 IP 时，SNI 决定返回哪个证书。
- 301 和 HSTS 会被浏览器缓存，错误配置恢复后浏览器仍可能表现异常。
- CDN、负载均衡、Nginx 多层 HTTPS 时，要明确每一层的协议。

## 重点

- HTTPS 配置必须包含证书、私钥、443 listen 和验证步骤。
- 80 到 443 跳转要单独配置和验证。
- 证书续期是长期运维任务，不是一次性配置。
- 私钥安全和证书有效期都要纳入巡检。

## 练习

1. 用自签名证书配置一个测试 HTTPS 站点，并用 curl 验证。
2. 配置 HTTP 到 HTTPS 跳转，观察 301 的 Location。
3. 使用 openssl 查看证书有效期和 SAN 域名。
4. 安装 certbot，在测试域名上完成一次 dry-run 续期检查。
