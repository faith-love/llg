# Linux 目录结构

## 作用

Linux 目录结构用于解决“文件应该放在哪里、配置在哪里、日志在哪里、项目应该部署到哪里”的问题。Linux 不是把所有文件都放在一个目录里，而是按用途划分系统命令、配置、日志、用户数据、临时文件和应用目录。

理解目录结构后，部署和排障会更有方向：找配置先看 `/etc`，找日志先看 `/var/log`，放业务应用优先考虑 `/opt/apps`，不要把项目长期放在 `/root` 或 `/tmp`。

## 痛点

- 不知道 Nginx、SSH、systemd 的配置文件通常在哪里。
- 不知道日志应该去哪找，只能全盘搜索。
- 把业务项目放在 `/root`、`/tmp` 或个人目录，后续权限和清理都混乱。
- 不理解 `/var`、`/opt`、`/usr` 的边界，手动覆盖系统文件。
- 出现磁盘满时，不知道先查哪些目录。

## 优点

- 排障时有明确方向。
- 部署目录更规范，权限更容易控制。
- 配置、日志、数据、程序不混在一起。
- 备份和清理范围更清楚。

## 总体结构

常见 Linux 目录可以粗略分成几类：

| 类型 | 目录 | 主要用途 |
| --- | --- | --- |
| 系统命令 | `/bin`、`/usr/bin`、`/usr/sbin` | 存放命令和系统工具 |
| 系统配置 | `/etc` | 存放配置文件 |
| 运行数据 | `/var` | 日志、缓存、运行时数据 |
| 日志 | `/var/log` | 系统和服务日志 |
| 业务应用 | `/opt` | 第三方应用、公司项目 |
| 用户目录 | `/home` | 普通用户文件 |
| root 用户 | `/root` | root 家目录 |
| 临时文件 | `/tmp` | 临时文件，可能被清理 |

## 核心目录说明

### 1. 根目录 `/`

根目录是所有路径的起点。

```bash
cd /
ls -lah
```

注意：

- 不要在根目录下随意创建业务文件。
- 不要对根目录执行递归删除、递归改权限。
- 全局路径都从 `/` 开始。

### 2. `/etc`

`/etc` 存放系统和软件配置。

常见文件：

```text
/etc/nginx/
/etc/ssh/sshd_config
/etc/systemd/system/
/etc/profile
/etc/environment
/etc/hosts
```

操作规则：

- 修改前先备份。
- 修改后做语法检查。
- 修改系统服务配置后通常要 reload 或 restart。

示例：

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak-$(date +%F-%H%M%S)
sudo nginx -t
```

### 3. `/var` 和 `/var/log`

`/var` 存放经常变化的数据，日志和缓存常在这里。

`/var/log` 是排障重点。

常见日志：

```text
/var/log/nginx/access.log
/var/log/nginx/error.log
/var/log/auth.log
/var/log/syslog
/var/log/messages
```

操作规则：

- 磁盘满优先查 `/var/log`。
- 日志不要直接无脑删除，要先确认服务是否仍打开文件。
- 应配置 logrotate 控制日志增长。

常用命令：

```bash
du -h --max-depth=1 /var | sort -h
tail -n 100 /var/log/nginx/error.log
```

### 4. `/opt`

`/opt` 适合放第三方应用和业务项目。

推荐结构：

```text
/opt/apps/
  demo-api/
    current
    releases/
    shared/
```

优点：

- 与系统文件分开。
- 权限可以按应用控制。
- 备份和发布范围清楚。

注意：

- 不要把业务项目散落在 `/root`。
- 应用目录要设置属主和权限。

### 5. `/home`

`/home` 是普通用户家目录。

常见用途：

- 用户脚本。
- 用户级配置。
- 临时操作文件。

注意：

- 个人目录不适合作为生产部署目录。
- 用户删除或迁移时，家目录内容可能被影响。

### 6. `/root`

`/root` 是 root 用户家目录。

注意：

- 不建议放业务项目。
- 普通用户通常无权访问。
- 长期把项目放这里会导致权限、备份、协作混乱。

### 7. `/tmp`

`/tmp` 是临时目录。

特点：

- 适合临时解压、临时测试。
- 系统可能定期清理。
- 不适合放长期数据、上传文件、生产配置。

安全建议：

- 解压未知包可以先放 `/tmp` 检查结构。
- 重要文件不要只放在 `/tmp`。

## 运维中的路径判断

部署项目：

```text
/opt/apps/应用名
```

应用配置：

```text
/opt/apps/应用名/shared/config
```

应用日志：

```text
/opt/apps/应用名/shared/logs
```

系统服务配置：

```text
/etc/systemd/system/服务名.service
```

Nginx 配置：

```text
/etc/nginx/
```

Nginx 日志：

```text
/var/log/nginx/
```

## 使用技巧

- 找配置先看 `/etc` 和应用的 `shared/config`。
- 找系统日志先看 `/var/log`。
- 业务部署优先放 `/opt/apps`。
- 临时操作可以放 `/tmp`，但不要长期依赖。
- 不清楚文件类型时用 `file`，不清楚路径时用 `find`。

## 难点

- 不同发行版的日志文件名可能不同，例如 Debian 系常见 `/var/log/syslog`，RHEL 系常见 `/var/log/messages`。
- Docker 容器内目录结构和宿主机目录结构不同。
- 包管理安装的软件和手动解压的软件路径不同。
- 软链接会让看到的路径和真实路径不同，需要用 `readlink -f`。

## 重点

- `/etc` 管配置，`/var/log` 管日志，`/opt` 放业务应用，`/tmp` 只放临时文件。
- 不要把生产项目长期放 `/root` 或 `/tmp`。
- 改 `/etc` 前备份，改完做检查。
- 查磁盘满优先看 `/var`、`/var/log`、`/opt`。

## 练习

1. 执行 `ls -lah /`，把每个一级目录的用途写下来。
2. 找到本机 Nginx 或 SSH 的配置目录。
3. 查看 `/var/log` 下最近修改的日志文件。
4. 在 `/opt/apps/demo-api` 下创建推荐部署目录结构。

