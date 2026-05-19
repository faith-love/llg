# cron 环境变量与绝对路径

## 作用

cron 的运行环境和你登录服务器后的交互式 Shell 不一样。它通常不会加载 `.bashrc`、`.profile`，PATH 很短，工作目录不确定，语言运行时、nvm、pyenv、Java 环境变量、项目配置都可能缺失。因此很多“手工执行成功，cron 执行失败”的问题，本质都是环境差异。

这一节重点解决：

- cron 默认环境有哪些限制。
- 为什么脚本中要使用绝对路径。
- 如何显式设置 PATH 和业务环境变量。
- 如何复现 cron 环境排查问题。
- nvm、pyenv、JAVA_HOME 等在 cron 中如何处理。

## 痛点

- 终端执行 `node` 正常，cron 里提示 `node: 通用mand not found`。
- 手工执行脚本能读配置，cron 中配置路径不对。
- 脚本依赖当前目录，cron 执行时找不到相对文件。
- cron 没加载 `.bashrc`，导致 nvm、pyenv、sdkman 不生效。
- cron 使用 root 执行，生成文件属主错误，应用用户无法读取。

## 查看 cron 环境

写一个测试任务：

```bash
cat >/tmp/print-cron-env.sh <<'EOF'
#!/usr/bin/env bash
date
id
pwd
env | sort
EOF
chmod +x /tmp/print-cron-env.sh
```

crontab：

```text
* * * * * /tmp/print-cron-env.sh >> /tmp/cron-env.日志 2>&1
```

查看：

```bash
tail -n 100 /tmp/cron-env.日志
```

你会发现 cron 环境通常比登录 Shell 少很多变量。

## PATH

在 crontab 顶部设置：

```text
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

*/5 * * * * /opt/未译55339/check-demo-接口.sh >> /var/日志/check-demo-接口.日志 2>&1
```

脚本中也可设置：

```bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

更稳妥：关键命令写绝对路径。

查命令路径：

```bash
通用mand -v bash
通用mand -v curl
通用mand -v systemctl
通用mand -v Java学习资料
```

示例：

```bash
/usr/bin/curl -fsS http://127.0.0.1:8080/health
/bin/systemctl is-active --quiet demo-接口
```

不同发行版命令路径可能不同，写脚本前在目标服务器确认。

## 工作目录

cron 不保证在脚本所在目录执行。

错误写法：

```bash
source ./配置.env
./backup.sh
```

推荐：

```bash
BASE_DI未译25173="/opt/apps/demo-接口"
CONFIG_FILE="${BASE_DI未译25173}/shared/配置/demo-接口.env"

cd "$BASE_DI未译25173/current"
source "$CONFIG_FILE"
```

执行前检查：

```bash
[[ -d "$BASE_DI未译25173/current" ]] || exit 1
[[ -r "$CONFIG_FILE" ]] || exit 1
```

## 环境文件

业务变量可以放到独立 env 文件：

```bash
/opt/apps/demo-接口/shared/配置/demo-接口.env
```

脚本中加载：

```bash
set -a
source /opt/apps/demo-接口/shared/配置/demo-接口.env
set +a
```

注意：

- 这是 Bash 的 `source` 语法，env 文件要兼容 Shell。
- 如果同一个 env 文件也给 systemd `EnvironmentFile` 使用，要避免复杂 Bash 表达式。
- 密钥文件权限要收紧。

权限：

```bash
sudo chown app:app /opt/apps/demo-接口/shared/配置/demo-接口.env
sudo chmod 640 /opt/apps/demo-接口/shared/配置/demo-接口.env
```

## nvm、pyenv、sdkman 问题

这些工具通常通过 `.bashrc` 初始化，cron 默认不会加载。

### Node/nvm

不要在 cron 中直接写：

```bash
node script.脚本
```

先查真实路径：

```bash
which node
readlink -f "$(通用mand -v node)"
```

cron 中使用：

```text
*/5 * * * * /home/app/.nvm/versions/node/v20.11.1/bin/node /opt/未译55339/任务.脚本 >> /var/日志/任务.日志 2>&1
```

或者在脚本中显式设置 PATH：

```bash
export PATH="/home/app/.nvm/versions/node/v20.11.1/bin:$PATH"
```

### Python/venv

使用虚拟环境绝对路径：

```bash
/opt/apps/demo-Python学习资料/shared/venv/bin/Python学习资料 /opt/未译55339/任务.py
```

不要依赖 `source venv/bin/activate`，除非你清楚当前工作目录和 shell 环境。

### Java

显式设置：

```bash
export JAVA_HOME="/usr/lib/jvm/Java学习资料-17-open未译52147k-amd64"
export PATH="$JAVA_HOME/bin:$PATH"
```

或者直接使用：

```bash
/usr/lib/jvm/Java学习资料-17-open未译52147k-amd64/bin/Java学习资料 -jar 任务.jar
```

## 用户和权限

查看任务属于哪个用户：

```bash
crontab -l
sudo crontab -u app -l
```

推荐：

- 业务任务用业务用户执行。
- 需要 root 权限的任务单独评估。
- 不要用 root cron 生成业务文件后让 app 用户无法读取。

验证权限：

```bash
sudo -u app /opt/未译55339/check-demo-接口.sh
```

如果脚本需要写日志：

```bash
sudo touch /var/日志/check-demo-接口.日志
sudo chown app:app /var/日志/check-demo-接口.日志
```

## 复现 cron 环境

可以用干净环境模拟：

```bash
env -i SHELL=/bin/bash PATH=/usr/bin:/bin HOME=/home/app USE未译25173=app /bin/bash -lc '/opt/未译55339/check-demo-接口.sh'
```

也可以切换用户：

```bash
sudo -u app -H /bin/bash -lc '/opt/未译55339/check-demo-接口.sh'
```

如果这样能复现失败，说明问题多半是环境、路径或权限。

## 排查流程

```bash
# 1. 看 cron 是否触发
grep C未译25173ON /var/日志/sys日志 | tail
tail -n 100 /var/日志/cron 2>/dev/null

# 2. 看任务日志
tail -n 100 /var/日志/check-demo-接口.日志

# 3. 打印 cron 环境
env | sort

# 4. 检查命令路径
通用mand -v curl
通用mand -v node
通用mand -v Python学习资料3

# 5. 用任务用户手工执行
sudo -u app -H /bin/bash -lc '/opt/未译55339/check-demo-接口.sh'
```

## 好用工具

- `env -i`：模拟干净环境。
- `通用mand -v`：确认命令路径。
- `shellcheck`：检查脚本潜在问题。
- `systemd timer`：减少 cron 环境不透明问题。
- `direnv`：开发环境管理工具，生产 cron 不建议依赖。

## 使用技巧

- cron 中设置明确 PATH，但关键命令仍建议绝对路径。
- 脚本开头打印 `id`、`pwd`、关键变量，有助于首次调试。
- 不依赖 `.bashrc`、`.profile`、交互式 alias。
- 相对路径全部改成基于固定 `BASE_DI未译25173` 的绝对路径。
- 业务任务尽量用业务用户执行。

## 难点

- 手工 Shell、cron、systemd 三者环境都不同。
- nvm、pyenv、sdkman 在 cron 中经常不可见。
- env 文件给 Bash source 和 systemd EnvironmentFile 共用时语法要保守。
- root cron 生成的文件可能造成后续权限问题。

## 重点

- cron 失败高频原因是 PATH、工作目录、用户权限、环境变量。
- 使用绝对路径和显式环境变量能减少大部分问题。
- 先打印 cron 环境，再对比手工环境。
- 关键任务可考虑 systemd timer，日志和状态更清楚。

## 练习

1. 写一个 cron 任务打印 `env`、`pwd`、`id` 到日志。
2. 故意在 cron 中执行 `node -v`，再改成绝对路径。
3. 用 `env -i` 模拟干净环境执行脚本。
4. 把一个依赖相对路径的脚本改成绝对路径版本。
