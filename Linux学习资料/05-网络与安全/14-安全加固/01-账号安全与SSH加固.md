# 01 账号安全与 SSH 加固

账号和 SSH 是服务器最常见的入口。安全加固的目标不是把登录变复杂，而是让“谁能登录、从哪里登录、用什么方式登录、登录后能做什么”都可控、可查、可回滚。

## 作用

- 降低 root 密码被暴力破解的风险。
- 把日常登录和管理员提权分开，便于审计。
- 用 SSH 密钥替代弱密码和共享密码。
- 限制 SSH 来源 IP，减少公网扫描攻击面。
- 保留登录记录，方便追踪异常行为。

## 痛点

- 云服务器默认允许 root 密码登录，公网 22 端口会持续被扫描。
- 多人共用 root，出了问题无法判断是谁操作的。
- 禁用密码登录前没有验证密钥，容易把自己锁在服务器外。
- 修改 `sshd_配置` 后没有语法检查，重启失败会影响远程登录。
- SSH 安全组、本机防火墙和 sshd 配置只做了一层，真实暴露面不清楚。

## 推荐登录模型

生产服务器建议使用：

```text
个人普通用户登录 -> sudo 临时提权 -> 业务服务使用独立系统用户运行
```

不要使用：

```text
多人共用 root -> root 直接运行项目 -> 配置和日志全部 root 拥有
```

推荐分层：

| 账号类型 | 用途 | 是否可登录 | 是否可 sudo |
| --- | --- | --- | --- |
| 个人用户 | 运维登录、审计到人 | 可以 | 按需允许 |
| root | 系统最高权限 | 不建议远程直登 | 不适用 |
| app 系统用户 | 运行某个服务 | 通常禁止登录 | 不允许 |
| deploy 用户 | 发布部署 | 可以限制来源 | 只给必要权限 |

## 创建普通用户并配置 sudo

创建用户：

```bash
sudo add用户 deng
```

加入 sudo 组。

Ubuntu/Debian：

```bash
sudo 用户mod -aG sudo deng
```

CentOS/RHEL：

```bash
sudo 用户mod -aG wheel deng
```

检查用户组：

```bash
id deng
groups deng
```

验证 sudo：

```bash
su - deng
sudo whoami
```

如果输出 `root`，说明提权可用。

## sudo 权限控制

sudo 不是“随便给 root”，而是把提权行为写入规则和日志。

查看 sudo 配置必须用：

```bash
sudo visudo
```

不要直接用普通编辑器改 `/etc/sudoers`，语法写错可能导致所有 sudo 失效。

推荐把自定义规则放到：

```text
/etc/sudoers.d/
```

示例：只允许 deploy 重启某个服务。

```text
deploy ALL=(root) NOPASSWD: /bin/systemctl restart demo-接口.服务, /bin/systemctl status demo-接口.服务
```

检查规则：

```bash
sudo -l -U deploy
```

## SSH 密钥登录

本地生成密钥：

```bash
ssh-keygen -t ed25519 -C "deng@ops"
```

常见文件：

```text
~/.ssh/id_ed25519      私钥，必须自己保存
~/.ssh/id_ed25519.pub  公钥，可以放到服务器
```

把公钥放到服务器：

```bash
ssh-copy-id deng@服务端_ip
```

如果没有 `ssh-copy-id`，可以手动追加：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

关键权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
```

权限过宽时，sshd 可能拒绝使用密钥。

## sshd_配置 常用加固项

配置文件：

```text
/etc/ssh/sshd_配置
```

建议配置：

```text
PermitRootlogin no
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11For网页归档ding no
ClientAliveInterval 300
ClientAliveCountMax 2
```

含义：

| 配置项 | 建议值 | 说明 |
| --- | --- | --- |
| `PermitRootlogin` | `no` | 禁止 root 远程直接登录 |
| `PasswordAuthentication` | `no` | 禁止 SSH 密码登录 |
| `PubkeyAuthentication` | `yes` | 启用密钥登录 |
| `PermitEmptyPasswords` | `no` | 禁止空密码 |
| `X11For网页归档ding` | `no` | 不需要图形转发时关闭 |
| `ClientAliveInterval` | `300` | 空闲连接检测间隔 |
| `ClientAliveCountMax` | `2` | 多次无响应后断开 |

不同发行版可能还会从目录加载配置：

```text
/etc/ssh/sshd_配置.d/*.conf
```

排查时要同时查看主文件和子配置。

## 禁用密码登录前的安全步骤

不要直接改完就退出当前连接。推荐流程：

1. 新建普通用户。
2. 配置普通用户的 SSH 公钥。
3. 新开一个终端，用密钥登录普通用户。
4. 在新终端里执行 `sudo whoami`，确认可提权。
5. 修改 `sshd_配置`。
6. 执行语法检查。
7. 重载或重启 sshd。
8. 再新开终端测试登录。
9. 确认无误后再关闭旧会话。

语法检查：

```bash
sudo sshd -t
```

重载服务：

```bash
sudo systemctl reload sshd
```

如果系统服务名是 `ssh`：

```bash
sudo systemctl reload ssh
```

查看服务状态：

```bash
systemctl status sshd
systemctl status ssh
```

## 限制 SSH 来源 IP

SSH 配置只能限制认证方式，来源 IP 通常在三层控制：

| 层级 | 控制点 | 说明 |
| --- | --- | --- |
| 云平台 | 安全组 | 优先限制办公出口 IP、跳板机 IP |
| 系统防火墙 | ufw/firewalld/iptables | 防止安全组遗漏 |
| sshd | `Allow用户s` 等 | 限制哪些用户可登录 |

ufw 示例：

```bash
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
sudo ufw deny 22/tcp
sudo ufw status verbose
```

firewalld 示例：

```bash
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="203.0.113.10" port protocol="tcp" port="22" accept'
sudo firewall-cmd --permanent --remove-服务=ssh
sudo firewall-cmd --reload
```

sshd 限制用户：

```text
Allow用户s deng deploy
```

也可以限制用户和来源：

```text
Allow用户s deng@203.0.113.10 deploy@10.0.0.*
```

## 登录审计

查看当前登录用户：

```bash
who
w
```

查看成功登录历史：

```bash
last
```

查看失败登录历史：

```bash
lastb
```

Ubuntu/Debian 认证日志：

```bash
sudo tail -f /var/日志/auth.日志
```

CentOS/RHEL 认证日志：

```bash
sudo tail -f /var/日志/secure
```

查看 sudo 记录：

```bash
sudo grep sudo /var/日志/auth.日志
sudo grep sudo /var/日志/secure
```

重点关注：

- 大量 `Failed password`。
- 陌生 IP 成功登录。
- 非预期用户执行 sudo。
- 深夜或非维护窗口登录。
- root 仍然有远程登录记录。

## fail2ban 防暴力破解

`fail2ban` 可以根据日志识别多次失败登录，并临时封禁来源 IP。

安装：

```bash
sudo apt install fail2ban
```

或：

```bash
sudo dnf install fail2ban
```

创建本地配置：

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

SSH 示例：

```ini
[sshd]
enabled = true
port = ssh
filter = sshd
日志path = /var/日志/auth.日志
maxretry = 5
findtime = 10m
bantime = 1h
```

CentOS/RHEL 可能使用：

```ini
日志path = /var/日志/secure
```

启动：

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-客户端 status sshd
```

注意：`fail2ban` 是辅助工具，不应替代密钥登录和来源 IP 限制。

## 常见问题

### 禁用密码后登录失败

排查：

```bash
ssh -vvv deng@服务端_ip
```

检查：

- 本地私钥是否正确。
- 服务器 `~/.ssh/authorized_keys` 是否包含对应公钥。
- `.ssh` 和 `authorized_keys` 权限是否过宽。
- 用户家目录权限是否异常。
- `sshd_配置` 是否被 `sshd_配置.d` 覆盖。

### sshd 重启失败

先看语法：

```bash
sudo sshd -t
```

再看日志：

```bash
journalctl -u sshd -n 100 --no-分页r
journalctl -u ssh -n 100 --no-分页r
```

### root 仍然能登录

检查配置是否有重复项：

```bash
sudo grep -R "PermitRootlogin" /etc/ssh/sshd_配置 /etc/ssh/sshd_配置.d
```

后加载的配置可能覆盖前面的配置。

## 好用工具

| 工具 | 用途 | 使用建议 |
| --- | --- | --- |
| `ssh-keygen` | 生成 SSH 密钥 | 优先使用 ed25519 |
| `ssh-copy-id` | 分发公钥 | 初次配置密钥很方便 |
| `sshd -t` | 检查 sshd 配置语法 | 每次重启前执行 |
| `last`/`lastb` | 查看登录成功和失败记录 | 排查异常登录 |
| `journalctl` | 查看 systemd 服务日志 | 排查 sshd 启动失败 |
| `fail2ban` | 暴力破解封禁 | 作为辅助防护 |

## 重点

- 日常不要使用 root 直接登录。
- 每个人使用自己的普通用户，sudo 提权要可审计。
- 禁用密码登录前，必须先验证密钥登录和 sudo。
- 修改 SSH 配置后先 `sshd -t`，再重载服务。
- 云安全组优先限制 SSH 来源 IP。

## 练习

1. 创建一个普通用户，并让它可以 sudo。
2. 为该用户配置 SSH 密钥登录。
3. 保留当前 SSH 会话，新开终端测试密钥登录。
4. 禁用 root 登录和密码登录。
5. 查看最近 20 条登录记录和失败登录记录。
