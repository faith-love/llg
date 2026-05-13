# sudo 与最小提权

## 作用

`sudo` 用于让普通用户临时以更高权限执行命令。它解决的是“普通用户需要做少量系统管理操作”的问题，而不是让所有人长期使用 root。最小提权的目标是：只给需要的人、需要的命令、需要的范围。

## 痛点

- 普通用户没有权限就切 root，留下误操作风险。
- 给用户 `NOPASSWD: ALL`，权限过大。
- 直接编辑 `/etc/sudoers` 写错，导致 sudo 全部失效。
- 不知道自己能 sudo 执行哪些命令。
- 用 sudo 掩盖权限设计问题。

## 优点

- 降低 root 误操作风险。
- 权限可审计。
- 可以精确允许部署用户重启指定服务。
- 可以避免把业务服务长期以 root 运行。

## 查看 sudo 权限

```bash
sudo -l
```

输出会告诉你当前用户能以什么身份执行哪些命令。

常见情况：

- 可以执行所有命令。
- 只能执行部分命令。
- 需要输入密码。
- 无 sudo 权限。

## 使用 sudo

执行单条命令：

```bash
sudo systemctl restart nginx
```

以其他用户执行：

```bash
sudo -u app whoami
sudo -u app touch /opt/apps/demo-api/shared/logs/test-write
```

进入 root shell：

```bash
sudo -i
```

注意：不建议长期停留在 root shell 中操作。高风险操作前要确认主机和目录。

## sudo 与重定向陷阱

错误示例：

```bash
sudo echo "test" > /etc/demo.conf
```

原因：`echo` 是 sudo，`>` 是当前 Shell 执行，当前用户仍然可能没有写权限。

正确方式：

```bash
echo "test" | sudo tee /etc/demo.conf
```

追加：

```bash
echo "test" | sudo tee -a /etc/demo.conf
```

## sudoers 管理

编辑 sudoers 必须用：

```bash
sudo visudo
```

原因：

- `visudo` 会做语法检查。
- 直接编辑 `/etc/sudoers` 写错，可能导致 sudo 不可用。

也可以在目录下添加文件：

```text
/etc/sudoers.d/deploy
```

编辑后仍建议用：

```bash
sudo visudo -c
```

检查语法。

## 最小提权示例

允许 `deploy` 用户查看和重启 `demo-api`：

```text
deploy ALL=(root) /bin/systemctl status demo-api, /bin/systemctl restart demo-api
```

允许免密码执行指定命令：

```text
deploy ALL=(root) NOPASSWD: /bin/systemctl restart demo-api, /bin/systemctl status demo-api
```

注意：

- 命令路径要写绝对路径。
- 只授权需要的服务。
- 不要随便给 `ALL=(ALL) NOPASSWD: ALL`。

查看命令路径：

```bash
command -v systemctl
```

## sudo 日志

sudo 操作通常会记录到认证日志。

Debian/Ubuntu：

```bash
grep sudo /var/log/auth.log
```

RHEL 系：

```bash
grep sudo /var/log/secure
```

用途：

- 审计谁执行了提权命令。
- 排查误操作。
- 发现异常提权。

## 使用技巧

- 先用 `sudo -l` 看自己能做什么。
- 需要长期重复操作时，用 sudoers 精确授权。
- 编辑 sudoers 用 `visudo`。
- sudo 不是权限设计的替代品。
- 能通过合理属主属组解决的，不要强行 sudo。

## 难点

- sudo 权限过大会变成隐形 root。
- sudo 命令和 Shell 重定向不是同一回事。
- `NOPASSWD` 很方便，但风险也更高。
- sudoers 命令路径和实际命令路径不一致时会失效。

## 重点

- sudo 是临时提权，不是长期 root。
- `sudo -l` 查看授权。
- `visudo` 编辑 sudoers。
- 精确授权具体命令和服务。
- 写 root 文件用 `sudo tee`。

## 练习

1. 执行 `sudo -l`，记录当前用户可执行的 sudo 命令。
2. 用 `sudo -u app whoami` 模拟服务用户。
3. 复现 `sudo echo > file` 的重定向问题，再用 `sudo tee` 修复。
4. 在测试机上用 sudoers.d 精确授权某用户重启一个测试服务。
5. 查看 sudo 日志。

