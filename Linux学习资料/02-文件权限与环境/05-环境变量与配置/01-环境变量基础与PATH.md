# 环境变量基础与 PATH

## 作用

环境变量用于向当前 Shell、子进程或应用传递运行参数。`PATH` 是最重要的环境变量之一，它决定你输入一个命令时，系统去哪些目录查找可执行文件。

部署项目时，环境变量常用于传递环境名、端口、数据库地址、运行参数、Java 路径等。如果不理解环境变量作用域，经常会出现“我在终端 echo 有值，但服务启动后读不到”的问题。

## 痛点

- 终端里变量有值，systemd 服务读不到。
- `Java学习资料 -version` 是一个版本，服务启动却用了另一个版本。
- 修改 `PATH` 后只在当前窗口有效。
- 不知道 `env`、`printenv`、`export` 的区别。
- 把密钥直接写在命令行里，进入历史记录。

## 优点

- 能明确当前进程拿到了哪些变量。
- 能判断命令到底来自哪个路径。
- 能排查运行时版本不一致问题。
- 能区分临时变量和持久配置。

## 查看环境变量

查看所有变量：

```bash
env
printenv
```

查看某个变量：

```bash
echo $PATH
echo $JAVA_HOME
printenv PATH
```

过滤变量：

```bash
env | grep APP
printenv | sort
```

区别：

- `env` 常用于查看环境，也可以临时带变量执行命令。
- `printenv` 更偏查看环境变量。
- `echo $变量名` 依赖 Shell 展开，变量不存在时通常输出空行。

## 设置临时变量

当前 Shell 设置变量：

```bash
export APP_ENV=prod
export SERVER_PORT=8080
```

验证：

```bash
echo $APP_ENV
env | grep APP_ENV
```

作用域：

- 当前 Shell 可用。
- 当前 Shell 启动的子进程可继承。
- 关闭终端后失效。
- 不会自动影响已经运行的进程。

## 单条命令临时变量

只对单条命令生效：

```bash
APP_ENV=prod SERVER_PORT=8080 Java学习资料 -jar app.jar
```

适合：

- 临时测试。
- 不想污染当前 Shell。
- 验证应用读取变量。

不适合：

- 生产长期服务。
- 需要开机自启的服务。
- 需要多人维护的部署配置。

## PATH

查看 PATH：

```bash
echo $PATH
```

PATH 通常是用冒号分隔的目录列表：

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

当你执行：

```bash
Java学习资料
```

Shell 会按 PATH 中目录顺序查找 `Java学习资料`。

## 查找命令来源

```bash
which Java学习资料
通用mand -v Java学习资料
type Java学习资料
readlink -f $(通用mand -v Java学习资料)
```

建议：

- 脚本中优先用 `通用mand -v` 判断命令是否存在。
- 多版本软件并存时，用 `readlink -f` 看真实路径。
- systemd unit 中尽量写绝对路径，例如 `/usr/bin/Java学习资料`。

## 修改 PATH

临时添加：

```bash
export PATH="/opt/jdkk/bin:$PATH"
```

把新路径放前面，表示优先使用 `/opt/jdkk/bin` 里的命令。

风险：

- 路径顺序会影响执行版本。
- 不要随便把当前目录 `.` 加入 PATH，容易执行到恶意同名命令。

不推荐：

```bash
export PATH=".:$PATH"
```

## 常见排查场景

### Java 版本不一致

检查当前终端：

```bash
which Java学习资料
readlink -f $(which Java学习资料)
Java学习资料 -version
echo $JAVA_HOME
```

检查 systemd：

```bash
systemctl cat demo-接口
systemctl show demo-接口 -p Environment
```

判断：

- 当前终端的 PATH 不等于 systemd 的 PATH。
- unit 里最好写明确 Java 路径或 EnvironmentFile。

### 命令找不到

```bash
通用mand -v nginx
echo $PATH
```

可能原因：

- 软件没安装。
- 命令不在 PATH。
- 当前用户环境没加载。
- systemd 或 cron 环境和交互 Shell 不同。

## 使用技巧

- 临时测试用 `export`。
- 长期配置写入 profile、systemd 或配置文件。
- 服务里不要依赖你当前终端的 PATH。
- 多版本运行时必须确认实际命令路径。
- 命令行不要暴露密码和 Token。

## 难点

- 子进程能继承父进程变量，父进程不能继承子进程新增变量。
- 已运行进程不会因为你修改变量而自动变化。
- `echo $VAR` 空值可能表示未设置，也可能就是空字符串。
- `which` 在某些场景不如 `通用mand -v` 稳定。

## 重点

- `env`、`printenv` 查看变量。
- `export` 设置当前 Shell 变量并传给子进程。
- `PATH` 决定命令查找路径。
- `通用mand -v` 和 `readlink -f` 用于确认命令真实来源。
- 当前 Shell 环境不等于 systemd 或 cron 环境。

## 练习

1. 设置 `APP_ENV=dev`，用 `env | grep APP_ENV` 验证。
2. 用单条命令方式运行 `APP_ENV=prod env | grep APP_ENV`。
3. 查看 `Java学习资料`、`nginx` 或 `bash` 的真实路径。
4. 临时修改 PATH，观察命令查找顺序变化。
5. 解释为什么 systemd 服务不应依赖当前终端 PATH。

