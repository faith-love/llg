# apt 常用命令

## 作用

`apt` 是 Debian、Ubuntu 系统上最常用的软件包管理工具。它负责从软件仓库下载软件包、解析依赖、安装、升级、卸载和查询信息。运维部署中，`apt` 常用于安装 Nginx、Git、JDK、Redis、MySQL 客户端、构建工具、系统依赖库等。

学习 `apt` 的重点不是背命令，而是理解每个命令会影响什么：

- `update` 更新索引，不升级软件。
- `install` 安装软件和依赖。
- `remove` 卸载程序，通常保留配置。
- `purge` 卸载程序并删除配置。
- `autoremove` 清理不再需要的依赖。
- `show`、`search`、`policy` 用于安装前判断版本和来源。

## 痛点

- 把 `apt update` 误认为“升级系统”，实际上它只是刷新本地软件包索引。
- 安装前不看版本和来源，导致装到不符合项目要求的版本。
- 卸载时不知道 `remove` 和 `purge` 的区别，配置残留影响下次安装。
- 看到 `apt upgrade` 就在生产机器上执行，结果升级了大量系统包。
- 软件装上了，但服务没有启动、端口没有监听、配置文件不是预期路径。

## 核心小点

### 1. 更新软件包索引

```bash
sudo apt update
```

`apt update` 会从仓库同步最新的软件包列表，相当于告诉本机“仓库里现在有哪些包、版本是多少”。它不会升级已安装的软件。

适合场景：

- 新机器第一次安装软件前。
- 修改 `/etc/apt/sources.list` 或 `/etc/apt/sources.list.d/` 后。
- 安装时提示找不到包，先确认索引是否过旧。

需要注意：

- 如果仓库地址不可达，`apt update` 会报错。
- 如果 GPG key 或仓库签名异常，不要直接绕过安全校验，要先确认仓库来源。
- 内网环境要确认是否配置了内网镜像源。

### 2. 安装软件

```bash
sudo apt install nginx
sudo apt install git curl vim
sudo apt install openjdk-17-jdk
```

安装前建议先查：

```bash
apt search nginx
apt show nginx
apt-cache policy nginx
```

`apt-cache policy nginx` 能看到候选版本和来源仓库。生产环境尤其要先确认候选版本是否符合要求。

安装指定版本：

```bash
apt-cache policy nginx
sudo apt install nginx=1.24.0-2ubuntu7
```

实际版本号要以当前仓库输出为准。

### 3. 升级软件

查看可升级包：

```bash
apt list --upgradable
```

升级单个包：

```bash
sudo apt install --only-upgrade nginx
```

升级已安装软件：

```bash
sudo apt upgrade
```

更强的升级：

```bash
sudo apt full-upgrade
```

生产环境原则：

- 不要在业务高峰期随意全量 `apt upgrade`。
- 升级前确认变更包列表。
- 对数据库、Nginx、OpenSSL、运行时环境等关键组件，要准备回滚方案。
- 升级后验证服务状态、端口、日志和业务接口。

### 4. 卸载软件

卸载程序但保留配置：

```bash
sudo apt remove nginx
```

卸载程序并删除配置：

```bash
sudo apt purge nginx
```

清理不再需要的依赖：

```bash
sudo apt autoremove
```

清理下载缓存：

```bash
sudo apt clean
sudo apt autoclean
```

使用建议：

- 只是临时移除程序，优先 `remove`。
- 想重新干净安装，考虑 `purge`，但要先备份配置。
- 执行 `autoremove` 前看清楚将删除哪些包，避免误删仍被业务使用的依赖。

### 5. 查询软件和文件

查询包详情：

```bash
apt show nginx
apt-cache policy nginx
```

查询已安装包：

```bash
apt list --installed | grep nginx
dpkg -l | grep nginx
```

查询某个包安装了哪些文件：

```bash
dpkg -L nginx
```

查询某个文件属于哪个包：

```bash
dpkg -S /usr/sbin/nginx
```

这类查询在排障中很常用。例如你发现 `/usr/bin/java` 路径不符合预期，可以用 `dpkg -S` 判断它是否来自系统包。

### 6. 锁定版本

对不希望自动升级的软件，可以使用 `apt-mark hold`：

```bash
sudo apt-mark hold nginx
apt-mark showhold
sudo apt-mark unhold nginx
```

适合场景：

- 业务运行依赖某个固定 JDK、Nginx、数据库客户端版本。
- 升级需要单独评估和验证。

不适合场景：

- 长期忽略安全更新。
- 没有记录原因就随手 hold，后续交接无人知道为什么不能升级。

## 常用命令清单

```bash
# 更新索引
sudo apt update

# 安装
sudo apt install nginx
sudo apt install git curl vim

# 查询
apt search nginx
apt show nginx
apt-cache policy nginx
apt list --installed | grep nginx
dpkg -L nginx
dpkg -S /usr/sbin/nginx

# 升级
apt list --upgradable
sudo apt install --only-upgrade nginx
sudo apt upgrade

# 卸载和清理
sudo apt remove nginx
sudo apt purge nginx
sudo apt autoremove
sudo apt clean

# 版本锁定
sudo apt-mark hold nginx
apt-mark showhold
sudo apt-mark unhold nginx
```

## 配置文件和日志

常见配置位置：

```bash
/etc/apt/sources.list
/etc/apt/sources.list.d/
/etc/apt/keyrings/
/etc/apt/preferences.d/
```

常见日志：

```bash
/var/log/apt/history.log
/var/log/apt/term.log
/var/log/dpkg.log
```

排查“谁升级了某个包”时，可以先看：

```bash
grep nginx /var/log/apt/history.log
grep nginx /var/log/dpkg.log
```

## 常见故障

### 1. Could not get lock

常见原因是另一个 `apt` 或自动更新进程正在运行。

排查：

```bash
ps aux | grep -E 'apt|dpkg'
systemctl status apt-daily.service
systemctl status apt-daily-upgrade.service
```

处理原则：

- 先确认是否真的有安装任务在运行。
- 不要上来就删除 lock 文件。
- 如果前一个安装中断，可能需要执行 `sudo dpkg --configure -a` 修复。

### 2. Unable to locate package

可能原因：

- 没有执行 `apt update`。
- 包名写错。
- 当前系统仓库没有该包。
- 需要启用额外仓库。

排查：

```bash
apt search 包名关键词
apt-cache policy 包名
cat /etc/os-release
```

### 3. 依赖冲突

修复常用命令：

```bash
sudo apt --fix-broken install
sudo dpkg --configure -a
```

执行前要看清楚它准备安装、删除或升级哪些包。

## 好用工具

- `apt-file`：查询某个文件由哪个未安装的软件包提供。
- `aptitude`：更强的包管理交互工具，适合复杂依赖分析。
- `needrestart`：升级库文件后提示哪些服务需要重启。
- `unattended-upgrades`：自动安全更新工具，生产使用前要明确策略和维护窗口。

安装示例：

```bash
sudo apt install apt-file needrestart
sudo apt-file update
apt-file search bin/nginx
```

## 使用技巧

- 安装前用 `apt-cache policy` 看候选版本和仓库来源。
- 升级前用 `apt list --upgradable` 看影响范围。
- 卸载前用 `dpkg -L` 看软件安装了哪些文件，避免误删自己手动创建的数据目录。
- 对关键组件使用 `apt-mark hold` 时，必须在运维文档里记录原因。
- 安装后不要停在“命令成功”，要继续验证版本、路径、服务状态和端口。

## 难点

- `remove` 和 `purge` 的差别容易被忽略，配置残留会影响重新安装。
- 系统自动更新可能和手工 `apt` 操作抢锁。
- 第三方仓库可能改变候选版本，导致升级时引入非预期包。
- 包管理器安装的软件路径清晰，但如果同时存在手动安装版本，`PATH` 顺序仍可能让命令指向另一个版本。

## 重点

- `apt update` 是刷新索引，不是升级软件。
- 生产环境升级要先看包列表，再定维护窗口和回滚方案。
- 查询包来源、安装文件、历史日志，是排障的基本动作。
- 关键软件安装后必须验证路径、版本、服务、自启、端口和日志。

## 练习

1. 在 Ubuntu 测试机上安装 `nginx`，记录 `apt-cache policy nginx` 的输出。
2. 用 `dpkg -L nginx` 找出 Nginx 配置目录和二进制路径。
3. 查看 `/var/log/apt/history.log`，找出最近一次安装或升级记录。
4. 安装 `apt-file`，查询 `ifconfig` 命令由哪个软件包提供。
