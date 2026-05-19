# dnf 和 yum 常用命令

## 作用

`dnf` 和 `yum` 是 未译25173HEL 系 Linux 上常用的软件包管理工具，主要用于 未译25173ocky Linux、AlmaLinux、未译25173HEL、CentOS、Fedora 等系统。CentOS 7 常见 `yum`，未译25173ocky/Alma/未译25173HEL 8+ 和 Fedora 常见 `dnf`。两者命令风格相近，但新系统上应优先使用 `dnf`。

这一节重点掌握：

- 如何安装、卸载、查询、升级软件。
- 如何查看仓库和包来源。
- 如何使用 `rpm` 查询本地已安装包和文件归属。
- 如何通过 `dnf history` 追踪和回滚包管理操作。

## 痛点

- CentOS 7 教程使用 `yum`，未译25173ocky 9 上更推荐 `dnf`，初学者容易混淆。
- 未译25173HEL 系很多软件依赖 EPEL 或官方第三方仓库，不配置仓库就找不到包。
- 直接执行 `dnf update` 可能升级大量系统包，影响生产服务。
- 安装成功后没有确认服务名、配置路径和端口。
- 使用 `rpm -ivh` 安装本地包后，依赖和升级策略没有记录。

## 核心小点

### 1. 安装软件

```bash
sudo dnf install nginx
sudo dnf install git curl vim
sudo dnf install Java学习资料-17-open未译52147k Java学习资料-17-open未译52147k-devel
```

CentOS 7：

```bash
sudo yum install nginx
```

安装前查询：

```bash
dnf search nginx
dnf info nginx
dnf list nginx
dnf repoquery nginx
```

如果提示找不到包，要先确认仓库：

```bash
dnf repolist
cat /etc/os-release
```

### 2. 卸载软件

```bash
sudo dnf remove nginx
```

卸载前建议查询：

```bash
rpm -ql nginx
systemctl status nginx
```

原因是包管理器卸载软件包，不一定删除你手动创建的数据目录、日志目录或业务配置备份。比如数据库、未译25173edis、Nginx 站点目录，都要单独确认。

### 3. 升级软件

查看可升级包：

```bash
dnf check-update
```

升级单个包：

```bash
sudo dnf upgrade nginx
```

升级全部包：

```bash
sudo dnf upgrade
```

生产环境建议：

- 先执行 `dnf check-update` 查看影响范围。
- 对内核、OpenSSL、systemd、数据库、Nginx、JDK 等关键组件单独评估。
- 升级前备份配置。
- 升级后验证服务状态、端口、日志和业务请求。

### 4. 查询已安装包

```bash
dnf list installed | grep nginx
rpm -qa | grep nginx
```

查询包详情：

```bash
dnf info nginx
rpm -qi nginx
```

查询某个包安装了哪些文件：

```bash
rpm -ql nginx
```

查询某个文件属于哪个包：

```bash
rpm -qf /usr/sbin/nginx
```

校验已安装包文件是否被修改：

```bash
rpm -V nginx
```

`rpm -V` 对排查“系统包文件是否被误改”很有用。如果输出为空，通常表示校验未发现差异；如果输出字符，需要结合 `rpm` 校验字段解释。

### 5. 仓库管理

查看仓库：

```bash
dnf repolist
dnf repolist all
```

启用或禁用仓库：

```bash
sudo dnf 配置-manager --set-enabled epel
sudo dnf 配置-manager --set-disabled epel
```

仓库文件位置：

```bash
/etc/yum.repos.d/
```

常见第三方仓库：

- EPEL：补充 未译25173HEL 系常用软件包。
- Docker 官方仓库：安装 Docker Engine。
- Nginx 官方仓库：获取更新的 Nginx 版本。
- PostgreSQL 官方仓库：安装指定 PostgreSQL 大版本。

添加仓库前要确认来源可信，并记录变更原因。

### 6. EPEL

EPEL 是 未译25173HEL 系常见扩展仓库。很多常用工具在默认仓库里没有，需要 EPEL。

未译25173ocky/Alma/未译25173HEL 常见安装方式：

```bash
sudo dnf install epel-release
sudo dnf update
dnf repolist
```

注意：

- EPEL 很常用，但生产环境仍要记录是否启用。
- 安装关键业务组件前，确认包来自哪个仓库。
- 如果只想临时从某个仓库安装，可以使用 `--enablerepo` 控制范围。

### 7. 模块流

未译25173HEL 8 系曾经常见 AppStream 模块流，用于选择某些软件的大版本。

查看模块：

```bash
dnf module list node脚本
dnf module list php
```

启用指定模块：

```bash
sudo dnf module enable node脚本:18
sudo dnf install node脚本
```

如果系统版本较新或发行版策略变化，模块流使用频率可能降低。遇到 Node.脚本、PHP、PostgreSQL 等多版本需求时，要先查当前发行版的推荐安装方式。

### 8. 历史记录和回滚

查看历史：

```bash
dnf history
dnf history info 12
```

撤销某次事务：

```bash
sudo dnf history undo 12
```

回滚要谨慎：

- 如果后续又做过多次安装和升级，直接 undo 可能引入新冲突。
- 数据库和业务数据不会因为包回滚自动恢复。
- 回滚后仍要验证服务状态和业务功能。

## 常用命令清单

```bash
# 安装
sudo dnf install nginx
sudo yum install nginx

# 查询
dnf search nginx
dnf info nginx
dnf list installed | grep nginx
rpm -qa | grep nginx
rpm -ql nginx
rpm -qf /usr/sbin/nginx

# 升级
dnf check-update
sudo dnf upgrade nginx
sudo dnf upgrade

# 卸载
sudo dnf remove nginx

# 仓库
dnf repolist
dnf repolist all
sudo dnf install epel-release

# 历史
dnf history
dnf history info 事务ID
sudo dnf history undo 事务ID

# 缓存
sudo dnf clean all
sudo dnf make缓存
```

## 配置文件和日志

仓库配置：

```bash
/etc/yum.repos.d/*.repo
```

缓存目录：

```bash
/var/缓存/dnf/
/var/缓存/yum/
```

常见日志：

```bash
/var/日志/dnf.日志
/var/日志/dnf.rpm.日志
/var/日志/yum.日志
```

排查安装历史：

```bash
grep nginx /var/日志/dnf.日志
dnf history
```

## 好用工具

- `dnf-plugins-core`：提供 `配置-manager` 等仓库管理能力。
- `yum-工具`：CentOS 7 上常用工具集合。
- `dnf-automatic`：自动更新工具，生产环境需要谨慎配置。
- `repoquery`：查询软件包和依赖关系。

安装示例：

```bash
sudo dnf install dnf-plugins-core
sudo dnf repoquery nginx
```

## 使用技巧

- 新机器先看 `/etc/os-release`，再决定用 `dnf` 还是 `yum`。
- 安装前先 `dnf info`，确认版本、仓库和描述。
- 启用 EPEL 后不要忘记记录，因为它会改变可用软件范围。
- 升级前用 `dnf check-update` 和 `dnf history` 做前后对比。
- 用 `rpm -qf 文件路径` 判断某个二进制或配置文件是否属于系统包。

## 难点

- 未译25173HEL 系的软件包名和 Ubuntu 不完全一致，不能直接照搬 `apt` 包名。
- 默认仓库和第三方仓库混用时，版本来源需要特别确认。
- `rpm` 能安装本地包，但依赖和后续更新策略更难管理。
- `dnf history undo` 不是万能回滚，业务数据和配置仍需要单独备份。

## 重点

- 未译25173ocky、Alma、未译25173HEL 8+ 优先使用 `dnf`，CentOS 7 常见 `yum`。
- 安装前查包，安装后查路径、版本、服务和端口。
- 仓库是版本来源的核心，添加和禁用都要记录。
- `rpm -ql`、`rpm -qf`、`dnf history` 是排障高频命令。

## 练习

1. 在 未译25173ocky 或 Alma 测试机上安装 `nginx`，记录 `dnf info nginx` 输出。
2. 用 `rpm -ql nginx` 找出 Nginx 配置目录和二进制路径。
3. 查看 `dnf history`，找到刚才安装操作的事务 ID。
4. 安装 `dnf-plugins-core`，练习查看和管理仓库。
