# chmod、chown、chgrp 权限修改

## 作用

`chmod`、`chown`、`chgrp` 用于修改文件权限、属主和属组。部署项目时，经常需要让服务用户读取 jar、读取配置、写日志、执行脚本。正确使用这些命令可以解决权限问题；错误使用会造成安全风险或破坏系统。

## 痛点

- 项目启动失败就直接 `chmod -R 777`。
- 上传文件属主是 root，服务用户读不到。
- 日志目录没有写权限，应用无法写日志。
- 递归 `chown` 到系统目录，破坏软件运行。
- 不知道数字权限和符号权限的区别。

## 优点

- 能精确授权，不扩大风险。
- 能让部署目录、配置目录、日志目录职责清晰。
- 能避免 root 运行应用。
- 能把权限问题修在正确位置。

## chmod 修改权限

### 数字方式

```bash
chmod 644 app.conf
chmod 755 deploy.sh
chmod 750 /opt/apps/demo-接口
```

常见权限：

| 权限 | 场景 |
| --- | --- |
| `600` | SSH 私钥、极敏感文件 |
| `640` | 应用配置、环境变量文件 |
| `644` | 普通只读配置或静态文件 |
| `750` | 应用目录、日志目录、上传目录 |
| `755` | 可执行脚本、公开静态目录 |

### 符号方式

```bash
chmod u+x deploy.sh
chmod g+w 日志s
chmod o-r app.conf
```

含义：

- `u`：属主。
- `g`：属组。
- `o`：其他用户。
- `a`：所有人。
- `+`：增加权限。
- `-`：移除权限。
- `=`：设置为指定权限。

## chown 修改属主

修改文件属主和属组：

```bash
sudo chown app:app app.jar
```

递归修改应用目录：

```bash
sudo chown -R app:app /opt/apps/demo-接口
```

注意：

- 递归操作前确认路径。
- 不要对 `/`、`/etc`、`/usr`、`/var` 这种系统目录随意递归。
- 对应用目录可以递归，对系统目录要非常谨慎。

## chgrp 修改属组

只改属组：

```bash
sudo chgrp deploy app.conf
```

适合：

- 多个用户共享读取配置。
- 部署组管理某些文件。
- 服务组读取特定目录。

## 部署场景示例

应用目录：

```bash
sudo chown -R app:app /opt/apps/demo-接口
sudo chmod 750 /opt/apps/demo-接口
```

配置文件：

```bash
sudo chown app:app /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo chmod 640 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

日志目录：

```bash
sudo chown -R app:app /opt/apps/demo-接口/shared/日志s
sudo chmod 750 /opt/apps/demo-接口/shared/日志s
```

脚本：

```bash
chmod u+x deploy.sh
```

## 不推荐做法

不要这样：

```bash
sudo chmod -R 777 /opt/apps/demo-接口
```

原因：

- 所有人都能读写执行。
- 配置和密钥可能泄露。
- 上传目录和代码目录风险扩大。
- 无法判断真正缺的是哪一级权限。

更好的做法：

1. 确认服务用户。
2. 用 `namei -l` 查路径。
3. 只修目标目录或文件。
4. 再用服务用户验证。

## 验证权限

查看：

```bash
ls -lah /opt/apps/demo-接口/shared/配置
namei -l /opt/apps/demo-接口/shared/配置/demo-接口.env
```

模拟服务用户：

```bash
sudo -u app cat /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo -u app touch /opt/apps/demo-接口/shared/日志s/测试-write
```

## 使用技巧

- 修改权限前先看当前权限。
- 修改后用目标用户验证。
- 配置文件和日志目录分开授权。
- 优先改属主属组，再考虑放宽权限。
- 递归操作前先 `pwd`、`ls`、确认路径。

## 难点

- 递归 chmod/chown 影响范围大。
- 权限修错可能短期可用但长期不安全。
- 服务用户没有 Shell 时，仍可用 `sudo -u app 命令` 测试。
- 权限问题可能出在父目录，不是目标文件。

## 重点

- `chmod` 改权限。
- `chown` 改属主和属组。
- `chgrp` 只改属组。
- 不用 `777` 当万能修复。
- 修改后用服务用户实际验证。

## 练习

1. 创建一个文件，分别设置 `600`、`640`、`644`，观察不同用户读取差异。
2. 创建一个脚本，添加执行权限后运行。
3. 创建一个 `app` 用户，让它能写某个 日志s 目录。
4. 用 `sudo -u app` 验证读配置和写日志。
5. 设计一个部署目录权限方案。

