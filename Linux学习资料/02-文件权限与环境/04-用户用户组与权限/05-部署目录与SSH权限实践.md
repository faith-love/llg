# 部署目录与 SSH 权限实践

## 作用

部署目录与 SSH 权限实践用于把前面的权限知识落到真实场景：应用目录怎么授权、配置文件怎么保护、日志目录怎么写入、上传目录怎么隔离、SSH 密钥权限怎么设置。

权限设计不是越宽越好，而是让每个用户和服务只拿到自己需要的权限。

## 痛点

- jar 包上传后属主是 root，app 用户无法读取。
- 配置文件权限过宽，数据库密码被其他用户读取。
- 日志目录不可写，应用启动后写日志失败。
- 上传目录和代码目录混在一起，发布时误删用户文件。
- SSH 私钥权限过宽，登录失败或密钥泄露。

## 优点

- 应用可以正常读配置、写日志。
- 敏感配置不对无关用户开放。
- 上传数据不随发布被覆盖。
- SSH 登录更安全。
- 权限问题更容易排查和复盘。

## 推荐部署目录

```text
/opt/apps/demo-接口/
  current -> releases/...
  releases/
  shared/
    配置/
    日志s/
    上传s/
```

推荐用户：

```text
deploy：登录和发布
app：运行应用服务
```

根据团队情况，部署和运行也可以是同一用户，但生产环境更推荐分开。

## 创建服务用户

```bash
sudo 用户add -r -s /usr/sbin/nologin app
```

创建目录：

```bash
sudo mkdir -p /opt/apps/demo-接口/{releases,shared/配置,shared/日志s,shared/上传s}
```

设置属主：

```bash
sudo chown -R app:app /opt/apps/demo-接口
```

设置基础权限：

```bash
sudo chmod 750 /opt/apps/demo-接口
sudo chmod 750 /opt/apps/demo-接口/shared
sudo chmod 750 /opt/apps/demo-接口/shared/日志s
sudo chmod 750 /opt/apps/demo-接口/shared/上传s
```

## 配置文件权限

配置文件可能包含数据库地址、用户名、密码、Token。

建议：

```bash
sudo chown app:app /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo chmod 640 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

如果只有 app 用户需要读取：

```bash
sudo chmod 600 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

不要：

```bash
chmod 777 demo-接口.env
chmod 644 demo-接口.env
```

如果文件包含敏感信息，`644` 意味着其他用户也能读。

## 日志目录权限

应用需要写日志：

```bash
sudo chown -R app:app /opt/apps/demo-接口/shared/日志s
sudo chmod 750 /opt/apps/demo-接口/shared/日志s
```

验证：

```bash
sudo -u app touch /opt/apps/demo-接口/shared/日志s/测试-write
sudo -u app rm /opt/apps/demo-接口/shared/日志s/测试-write
```

如果验证失败，应用也大概率无法写日志。

## 上传目录权限

上传目录用于用户文件，应该和代码目录分开：

```bash
sudo chown -R app:app /opt/apps/demo-接口/shared/上传s
sudo chmod 750 /opt/apps/demo-接口/shared/上传s
```

注意：

- 上传目录要备份。
- 发布时不要删除 上传s。
- 如果 Nginx 要直接读上传文件，需要额外设计组权限或代理方式。

## release 目录权限

发布新版本：

```bash
release=2026-05-11-120000
sudo mkdir -p /opt/apps/demo-接口/releases/$release
sudo cp app.jar /opt/apps/demo-接口/releases/$release/
sudo chown -R app:app /opt/apps/demo-接口/releases/$release
sudo chmod 750 /opt/apps/demo-接口/releases/$release
```

切换 current：

```bash
sudo ln -sfn /opt/apps/demo-接口/releases/$release /opt/apps/demo-接口/current
sudo chown -h app:app /opt/apps/demo-接口/current
```

## SSH 权限

SSH 对权限很敏感。

推荐：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

说明：

- `~/.ssh` 目录不能过宽。
- 私钥只能自己读写。
- `authorized_keys` 不能让其他用户写。

如果权限过宽，SSH 可能拒绝密钥登录。

## 排查 SSH 密钥登录失败

客户端看详细输出：

```bash
ssh -vvv 用户@服务端
```

服务器看日志：

Ubuntu/Debian：

```bash
sudo tail -n 100 /var/日志/auth.日志
```

RHEL 系：

```bash
sudo tail -n 100 /var/日志/secure
```

检查权限：

```bash
ls -ld ~/.ssh
ls -l ~/.ssh/authorized_keys
```

## 使用技巧

- 先设计用户，再设计目录权限。
- 配置、日志、上传、release 分开授权。
- 用 `sudo -u app` 验证服务用户真实能力。
- SSH 私钥权限必须严格。
- 不要用 `777` 解决部署权限。

## 难点

- Nginx、应用、部署用户可能需要访问不同目录。
- 上传目录既要写入又要备份，不能随版本删除。
- 软链接属主和目标目录属主需要分开理解。
- SSH 权限过宽时，错误信息不一定直观。

## 重点

- 服务用户运行应用，部署用户执行发布。
- 配置文件权限建议 `600` 或 `640`。
- 日志和上传目录给服务用户写权限。
- SSH 目录 `700`，私钥和 authorized_keys `600`。
- 用实际用户验证权限，而不是只看 root 是否能访问。

## 练习

1. 创建 `/opt/apps/demo-接口` 推荐目录结构。
2. 创建 `app` 用户，并让它能读取配置、写日志。
3. 把配置文件设为 `640`，验证其他用户是否可读。
4. 修改 `~/.ssh` 权限为错误值，观察 SSH 报错，再修复。
5. 用 `sudo -u app` 验证 release、配置、日志s、上传s 四类路径权限。

