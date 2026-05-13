# ufw、firewalld、iptables

## 作用

防火墙用于控制哪些流量可以进入或离开服务器。Linux 上常见管理工具包括 `ufw`、`firewalld`、`iptables`、`nftables`。它们不是完全独立的网络层级，有些是前端管理工具，有些是底层规则系统。运维排障时要先确认当前机器到底启用了哪一种管理方式，避免规则来源混乱。

这一节重点掌握：

- Ubuntu 常见 `ufw` 的查看和放行。
- RHEL 系常见 `firewalld` 的 zone、service、port。
- `iptables` 和 `nftables` 的基本查看方式。
- 如何安全放行 80、443、SSH 和应用端口。
- 如何避免防火墙工具混用。

## 痛点

- 服务监听正常，但本机防火墙拦截，外部访问超时。
- 放行了 `ufw`，实际系统使用的是 `firewalld` 或云安全组仍未放行。
- `iptables -L` 看到规则很多，不知道哪些是 Docker、Kubernetes 或系统生成的。
- 直接关闭防火墙解决问题，留下安全风险。
- 开放了 MySQL、Redis 到公网，造成严重风险。

## 先确认当前环境

```bash
systemctl status ufw --no-pager 2>/dev/null || true
systemctl status firewalld --no-pager 2>/dev/null || true
sudo iptables -L -n -v 2>/dev/null || true
sudo nft list ruleset 2>/dev/null | head -n 80
```

同时确认服务监听：

```bash
sudo ss -lntup
```

排查时要明确：

- 服务是否真的监听目标端口。
- 本机防火墙是否放行。
- 云安全组是否放行。
- 访问来源是否在允许范围内。

## ufw

Ubuntu 上常见，命令简单。

### 1. 查看状态

```bash
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
```

如果显示 `inactive`，说明 ufw 未启用，但仍可能有其他防火墙或云安全组。

### 2. 放行端口

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
```

限制来源：

```bash
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
sudo ufw allow from 10.0.0.0/8 to any port 8080 proto tcp
```

拒绝端口：

```bash
sudo ufw deny 3306/tcp
```

删除规则：

```bash
sudo ufw status numbered
sudo ufw delete 规则编号
```

### 3. 启用前注意 SSH

启用 ufw 前，必须确保 SSH 不会被锁死：

```bash
sudo ufw allow OpenSSH
sudo ufw allow from 你的公网IP to any port 22 proto tcp
sudo ufw enable
```

远程服务器上启用防火墙，最好保留一个已登录会话，验证新连接正常后再关闭。

## firewalld

RHEL、Rocky、Alma、CentOS 常见。

### 1. 查看状态

```bash
sudo firewall-cmd --state
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --list-all
```

查看所有 zone：

```bash
sudo firewall-cmd --list-all-zones
```

### 2. 临时和永久规则

临时放行，重载后失效：

```bash
sudo firewall-cmd --add-service=http
sudo firewall-cmd --add-port=8080/tcp
```

永久放行：

```bash
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

查看：

```bash
sudo firewall-cmd --list-services
sudo firewall-cmd --list-ports
```

删除：

```bash
sudo firewall-cmd --remove-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

### 3. 限制来源

使用 rich rule：

```bash
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="203.0.113.10" port protocol="tcp" port="22" accept' --permanent
sudo firewall-cmd --reload
```

或者把网卡放到合适 zone，并用 zone 策略管理。

## iptables

`iptables` 是传统底层防火墙工具。很多系统上它可能是 nftables 的兼容前端，也可能被 Docker、Kubernetes、firewalld 管理。

查看：

```bash
sudo iptables -L -n -v
sudo iptables -S
sudo iptables -t nat -L -n -v
```

字段：

- `INPUT`：进入本机的流量。
- `OUTPUT`：本机发出的流量。
- `FORWARD`：转发流量。
- `ACCEPT`：允许。
- `DROP`：丢弃。
- `REJECT`：拒绝并返回错误。

不建议新手直接在生产手写 iptables 规则，除非明确当前系统没有被 ufw/firewalld/Docker 等管理。

## nftables

现代 Linux 越来越多使用 nftables。

查看规则：

```bash
sudo nft list ruleset
```

查看表：

```bash
sudo nft list tables
```

注意：

- firewalld 后端可能使用 nftables。
- `iptables` 命令可能只是兼容层。
- 排查时如果看到 nftables 规则，不要随意清空。

## 常见端口开放原则

| 服务 | 端口 | 建议 |
| --- | --- | --- |
| SSH | 22 | 限制来源 IP，使用密钥 |
| HTTP | 80 | 可公网开放 |
| HTTPS | 443 | 可公网开放 |
| 后端 API | 8080/8000/3000 | 优先只给 Nginx 或内网访问 |
| MySQL | 3306 | 不直接公网开放 |
| Redis | 6379 | 不直接公网开放 |
| PostgreSQL | 5432 | 不直接公网开放 |
| Elasticsearch | 9200 | 不直接公网开放 |

公网入口尽量收敛到 80/443，内部端口通过 Nginx、负载均衡、内网访问。

## 排查流程

### 本机监听确认

```bash
sudo ss -lntup | grep ':8080'
```

如果没有监听，先查服务，不要查防火墙。

### 本机防火墙确认

Ubuntu：

```bash
sudo ufw status verbose
```

RHEL 系：

```bash
sudo firewall-cmd --list-all
```

底层：

```bash
sudo iptables -L -n -v
sudo nft list ruleset
```

### 外部测试

```bash
nc -vz 服务器公网IP 80
curl -I http://服务器公网IP
```

如果本机防火墙放行但外部仍超时，继续查云安全组、负载均衡、运营商或路由。

## Docker 和容器注意点

Docker 会创建 iptables/nftables 规则，用于端口映射和 NAT。

查看容器端口：

```bash
docker ps
```

查看监听：

```bash
sudo ss -lntup
```

不要随意清空 iptables 规则，否则可能影响容器网络。

## 好用工具

- `ufw`：Ubuntu 简化防火墙管理。
- `firewalld`：RHEL 系动态防火墙管理。
- `iptables`：传统规则查看和管理。
- `nft`：nftables 规则查看和管理。
- `fail2ban`：根据日志自动封禁暴力破解 IP，常用于 SSH、Nginx。
- `ss`、`nc`：验证端口监听和连通性。

## 使用技巧

- 修改远程服务器防火墙前，先确保 SSH 规则安全。
- 能限制来源 IP 的端口，不要全网开放。
- 不要同时混用 ufw、firewalld、手写 iptables，除非明确规则关系。
- 防火墙放行后还要查云安全组。
- 数据库、Redis、管理后台端口默认不公网开放。

## 难点

- 防火墙工具可能只是管理前端，底层规则可能在 iptables 或 nftables。
- Docker、Kubernetes 会自动写规则，清理规则可能导致容器网络异常。
- `DROP` 表现为超时，`REJECT` 表现为拒绝，排查方向不同。
- 云安全组和本机防火墙都放行，外部才可能访问。

## 重点

- 防火墙排查前先确认服务监听。
- 公网入口收敛到 80/443，内部服务限制来源。
- 远程修改防火墙要防止锁死 SSH。
- 规则来源要清楚，避免多个工具互相覆盖。

## 练习

1. 用 ufw 或 firewalld 放行 8080，再从另一台机器测试。
2. 限制 SSH 只允许指定来源 IP，验证新连接后再关闭旧会话。
3. 查看 iptables 或 nftables 当前规则，识别 INPUT 链默认策略。
4. 故意不放行端口，观察 `nc` 的 timeout 和 refused 差异。
