# releases、current、shared 目录结构

## 作用

`releases/current/shared` 是一种常见的部署目录组织方式，用来把“版本文件”“当前入口”“共享配置和数据”分开。它能避免新版本覆盖旧版本，避免配置和上传文件被发布覆盖，也能让回滚变成切换软链接加重启服务。

这个结构适合部署：

- Java Jar 服务。
- Node 服务。
- Python 服务。
- 前端静态资源。
- Go、Rust 等二进制服务。

## 痛点

- 直接把新 jar 覆盖旧 jar，出问题时找不到上一版。
- 配置文件和代码放在一起，发布时误覆盖生产配置。
- 用户上传文件放在 release 目录里，回滚或清理版本时可能误删。
- 服务启动命令写死某个版本目录，后续切换版本困难。
- 回滚时手忙脚乱，不知道旧版本目录是否完整。

## 推荐结构

```text
/opt/apps/demo-接口/
  current -> releases/2026-05-11-120000
  releases/
    2026-05-11-120000/
      app.jar
    2026-05-10-180000/
      app.jar
  shared/
    配置/
      demo-接口.env
      应用配置.yml
    日志s/
    上传s/
    tmp/
    run/
```

各目录职责：

| 目录 | 作用 | 是否随版本变化 |
| --- | --- | --- |
| `releases/` | 存放每次发布产物 | 是 |
| `current` | 指向当前版本的软链接 | 是 |
| `shared/配置/` | 环境变量、生产配置 | 否 |
| `shared/日志s/` | 应用日志 | 否 |
| `shared/上传s/` | 用户上传文件 | 否 |
| `shared/tmp/` | 临时文件 | 否 |
| `shared/run/` | pid、SocketIO 等运行文件 | 否 |

## releases

`releases` 中每个子目录代表一次发布。

推荐命名：

```text
2026-05-11-120000
2026-05-11-120000-a1b2c3d
build-20260511-120000-158
```

命名建议：

- 包含时间，便于排序和回滚。
- 如果来自 Git，附加短 通用mit 更清晰。
- 不要使用 `new`、`la测试`、`bak` 这类含义模糊的目录名。

创建 release：

```bash
release=$(date +%F-%H%M%S)
sudo mkdir -p /opt/apps/demo-接口/releases/$release
sudo cp /tmp/app.jar /opt/apps/demo-接口/releases/$release/
sudo chown -R app:app /opt/apps/demo-接口/releases/$release
```

校验：

```bash
ls -lh /opt/apps/demo-接口/releases/$release
sha256sum /opt/apps/demo-接口/releases/$release/app.jar
```

## current

`current` 是软链接，指向当前运行版本。

创建或切换：

```bash
sudo ln -sfn /opt/apps/demo-接口/releases/$release /opt/apps/demo-接口/current
```

查看：

```bash
ls -l /opt/apps/demo-接口/current
readlink -f /opt/apps/demo-接口/current
```

systemd 中使用：

```ini
WorkingDirectory=/opt/apps/demo-接口/current
ExecStart=/usr/bin/Java学习资料 -jar /opt/apps/demo-接口/current/app.jar
```

为什么要用 current：

- 服务启动命令固定，不需要每次改 unit。
- 发布新版本只切换软链接。
- 回滚旧版本也只切换软链接。
- Nginx 静态资源 root 可以固定指向 current。

注意：

- 切换 `current` 后，已经运行的进程不会自动变成新版本，通常需要重启服务。
- 对前端静态资源，Nginx 读取文件时会跟随软链接，切换后 reload 通常更稳。
- 对 Java、Node、Python 服务，必须重启进程才会加载新代码。

## shared

`shared` 存放不应该随版本变化而覆盖的内容。

### 配置

配置示例：

```text
shared/配置/demo-接口.env
shared/配置/应用配置.yml
shared/配置/Spring日志配置.xml
```

权限建议：

```bash
sudo chown -R app:app /opt/apps/demo-接口/shared/配置
sudo chmod 750 /opt/apps/demo-接口/shared/配置
sudo chmod 640 /opt/apps/demo-接口/shared/配置/*
```

敏感配置不要放在 release 目录。发布包可以在测试环境复用，但生产配置应该由服务器或配置中心管理。

### 日志s

日志目录：

```bash
sudo mkdir -p /opt/apps/demo-接口/shared/日志s
sudo chown app:app /opt/apps/demo-接口/shared/日志s
sudo chmod 750 /opt/apps/demo-接口/shared/日志s
```

应用日志写到 shared 的好处：

- 切换版本后日志仍然连续。
- 清理旧 release 不会误删日志。
- 权限边界清晰。

如果只依赖 `journalctl`，也建议应用保留关键业务日志，方便按文件归档和检索。

### 上传s

上传文件目录：

```bash
sudo mkdir -p /opt/apps/demo-接口/shared/上传s
sudo chown app:app /opt/apps/demo-接口/shared/上传s
sudo chmod 750 /opt/apps/demo-接口/shared/上传s
```

注意：

- 用户上传文件必须远离 release。
- 清理旧版本时不能删除 上传s。
- 多台服务器部署时，上传s 可能需要对象存储、共享存储或集中服务。

### tmp

临时目录：

```bash
sudo mkdir -p /opt/apps/demo-接口/shared/tmp
sudo chown app:app /opt/apps/demo-接口/shared/tmp
```

适合放：

- 临时导出文件。
- 运行过程中的中间文件。
- 短期缓存。

要配合清理策略，避免无限增长。

## 初始化命令模板

```bash
app=demo-接口
用户=app
base=/opt/apps/$app

sudo 用户add -r -s /usr/sbin/nologin $用户 2>/dev/null || true
sudo mkdir -p $base/{releases,shared/配置,shared/日志s,shared/上传s,shared/tmp,shared/run}
sudo chown -R $用户:$用户 $base
sudo chmod 750 $base
sudo find $base/shared -type d -exec chmod 750 {} \;
```

创建配置文件：

```bash
sudo install -o app -g app -m 640 /dev/null /opt/apps/demo-接口/shared/配置/demo-接口.env
```

## 发布流程

```bash
app=demo-接口
base=/opt/apps/$app
release=$(date +%F-%H%M%S)

sudo mkdir -p $base/releases/$release
sudo cp /tmp/app.jar $base/releases/$release/
sudo chown -R app:app $base/releases/$release
sudo ln -sfn $base/releases/$release $base/current
sudo systemctl restart $app
```

验证：

```bash
readlink -f /opt/apps/demo-接口/current
systemctl status demo-接口 --no-分页r
curl -f http://127.0.0.1:8080/health
```

## 回滚流程

列出版本：

```bash
ls -lt /opt/apps/demo-接口/releases
readlink -f /opt/apps/demo-接口/current
```

切换旧版本：

```bash
old=/opt/apps/demo-接口/releases/2026-05-10-180000
sudo 测试 -d $old
sudo ln -sfn $old /opt/apps/demo-接口/current
sudo systemctl restart demo-接口
```

验证：

```bash
readlink -f /opt/apps/demo-接口/current
systemctl status demo-接口 --no-分页r
journalctl -u demo-接口 -n 100 --no-分页r
curl -f http://127.0.0.1:8080/health
```

## 清理旧版本

不要手工乱删。建议保留最近 3 到 5 个 release，先预览再删除。

预览：

```bash
ls -1dt /opt/apps/demo-接口/releases/* | tail -n +6
```

删除前确认 current 不在删除列表：

```bash
current=$(readlink -f /opt/apps/demo-接口/current)
echo "$current"
```

删除：

```bash
ls -1dt /opt/apps/demo-接口/releases/* | tail -n +6 | xargs -r sudo rm -rf
```

生产环境执行删除前要非常谨慎，尤其确认路径变量不是空值。

## 好用工具

- `readlink -f`：确认 current 最终指向。
- `rsync`：同步 release 内容。
- `install`：创建文件并设置属主和权限。
- `find`：批量设置目录和文件权限。
- `tree`：查看目录结构。
- `sha256sum`：校验产物。

安装：

```bash
sudo apt install tree rsync
sudo dnf install tree rsync
```

## 使用技巧

- release 目录只放版本产物，不放生产可变数据。
- current 永远作为服务入口，避免每次发布修改 systemd。
- shared 存放配置、日志、上传文件，发布和回滚都不覆盖。
- 每次发布后记录 current 指向和产物校验值。
- 清理旧版本时先 `readlink -f current`，避免删掉正在运行版本。

## 难点

- 切换软链接不等于进程已切换版本，后端服务通常需要 restart。
- 如果数据库迁移不可逆，代码目录回滚也可能无法恢复业务。
- 文件权限不只看目标文件，也要看 `/opt`、`/opt/apps`、项目目录每一级。
- 多实例部署时，每台机器 current 指向可能不一致，需要发布系统统一控制。

## 重点

- `releases` 管版本，`current` 管入口，`shared` 管可变数据。
- 配置和上传文件不能跟随 release 覆盖。
- 软链接回滚简单，但必须配合健康检查和数据兼容性判断。
- 目录结构是部署规范的基础，不是可有可无的整理工作。

## 练习

1. 创建一个 `demo-接口` 目录，按 `releases/current/shared` 初始化结构。
2. 创建两个 release，用 `current` 在两个版本之间切换。
3. 把配置文件放到 shared，验证切换 release 后配置不丢失。
4. 写一个清理旧 release 的预览命令，确保不会删除 current 指向目录。
