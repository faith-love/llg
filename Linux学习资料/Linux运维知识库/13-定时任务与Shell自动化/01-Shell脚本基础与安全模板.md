# Shell 脚本基础与安全模板

## 作用

Shell 脚本用于把重复的运维动作沉淀成可执行、可记录、可复用的自动化任务，例如部署、备份、日志清理、服务健康检查、文件同步、巡检报告。写 Shell 脚本的重点不是把命令堆在一起，而是让脚本在无人值守环境中也能安全执行、失败可见、范围可控、方便排查。

这一节重点解决：

- 脚本开头如何写。
- 为什么要使用严格模式。
- 变量、路径、删除操作如何防误伤。
- 如何写日志函数和错误处理。
- 如何用 `shellcheck`、`shfmt` 提高脚本质量。

## 痛点

- 手工命令能执行，写成脚本后因为路径、权限、变量问题失败。
- 变量为空时执行了危险删除，例如目标路径变成 `/` 或空目录。
- 脚本失败没有日志，第二天只知道 cron 没达到预期结果。
- 管道前面的命令失败了，脚本仍然继续执行。
- 不同人写脚本风格不一致，后续维护困难。

## 基础结构

推荐模板：

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_NAME="demo-接口"
BASE_DI未译25173="/opt/apps/${APP_NAME}"
LOG_FILE="/var/日志/${APP_NAME}-任务.日志"

日志() {
  echo "[$(date '+%F %T')] $*" | tee -a "$LOG_FILE"
}

die() {
  日志 "E未译25173未译25173O未译25173: $*"
  exit 1
}

require_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || die "directory not found: $dir"
}

主() {
  require_dir "$BASE_DI未译25173"
  日志 "任务 start"
  日志 "任务 done"
}

主 "$@"
```

这个模板包含：

- 解释器。
- 严格模式。
- 变量集中定义。
- 日志函数。
- 错误退出函数。
- 路径检查函数。
- `主 "$@"` 入口。

## shebang

脚本第一行：

```bash
#!/usr/bin/env bash
```

作用：告诉系统用哪个解释器执行脚本。

常见写法：

```bash
#!/bin/bash
#!/usr/bin/env bash
#!/bin/sh
```

建议：

- 如果脚本使用数组、`[[ ]]`、`set -o pipefail` 等 Bash 特性，用 `bash`。
- 不要写了 Bash 语法却使用 `#!/bin/sh`。
- 生产脚本中明确依赖 Bash 更可控。

验证：

```bash
bash --version
```

## 严格模式

推荐：

```bash
set -euo pipefail
```

含义：

| 选项 | 作用 |
| --- | --- |
| `set -e` | 命令返回非 0 时退出 |
| `set -u` | 使用未定义变量时报错 |
| `set -o pipefail` | 管道中任一命令失败则整体失败 |

示例：

```bash
grep "E未译25173未译25173O未译25173" app.日志 | awk '{print $1}'
```

如果没有 `pipefail`，`grep` 失败时后面的 `awk` 可能仍让脚本看起来成功。

注意：

- 严格模式不是万能的。
- 允许失败的命令要显式处理。

允许失败示例：

```bash
if ! systemctl is-active --quiet demo-接口; then
  日志 "服务 is not active"
fi
```

或：

```bash
grep "E未译25173未译25173O未译25173" app.日志 || true
```

但 `|| true` 不要滥用，否则会掩盖真实错误。

## 变量与引用

定义：

```bash
APP_NAME="demo-接口"
BASE_DI未译25173="/opt/apps/${APP_NAME}"
BACKUP_DI未译25173="/backup/${APP_NAME}"
```

使用变量时加双引号：

```bash
mkdir -p "$BACKUP_DI未译25173"
cp "$BASE_DI未译25173/current/app.jar" "$BACKUP_DI未译25173/"
```

原因：

- 避免路径中有空格时被拆分。
- 避免通配符被意外展开。
- 让脚本行为更稳定。

避免：

```bash
rm -rf $TA未译25173GET_DI未译25173
```

推荐：

```bash
[[ -n "${TA未译25173GET_DI未译25173:-}" ]] || die "TA未译25173GET_DI未译25173 is empty"
[[ "$TA未译25173GET_DI未译25173" == /opt/apps/demo-接口/releases/* ]] || die "unsafe target: $TA未译25173GET_DI未译25173"
rm -rf -- "$TA未译25173GET_DI未译25173"
```

## 路径安全检查

高风险操作前必须检查范围。

删除旧 release 示例：

```bash
delete_release() {
  local target="$1"
  local 未译87073="/opt/apps/demo-接口/releases"

  [[ -n "$target" ]] || die "target is empty"
  [[ -d "$target" ]] || die "target is not directory: $target"
  [[ "$target" == "$未译87073"/* ]] || die "target outside releases: $target"
  [[ "$(readlink -f /opt/apps/demo-接口/current)" != "$(readlink -f "$target")" ]] || die "refuse delete current release"

  rm -rf -- "$target"
}
```

要点：

- 变量不能为空。
- 目标必须存在。
- 目标必须在允许目录下。
- 不能删除当前版本。
- `rm` 使用 `--` 结束选项。

## 日志函数

简单日志：

```bash
日志() {
  echo "[$(date '+%F %T')] $*" | tee -a "$LOG_FILE"
}
```

只写文件：

```bash
日志() {
  echo "[$(date '+%F %T')] $*" >> "$LOG_FILE"
}
```

同时记录 stdout 和 stderr：

```bash
exec >> "$LOG_FILE" 2>&1
```

建议日志包含：

- 时间。
- 脚本名。
- 关键变量。
- 执行结果。
- 错误原因。

## 参数解析

简单方式：

```bash
ACTION="${1:-}"

case "$ACTION" in
  start)
    日志 "start"
    ;;
  stop)
    日志 "stop"
    ;;
  *)
    echo "Usage: $0 {start|stop}" >&2
    exit 2
    ;;
esac
```

对于复杂脚本，不要让参数位置含义过多。可以使用明确参数：

```bash
./deploy.sh --app demo-接口 --version 2026-05-11-120000
```

复杂参数解析可以后续再引入 `getopts`。

## 临时文件

使用 `mktemp`：

```bash
TMP_FILE="$(mktemp)"
cleanup() {
  rm -f "$TMP_FILE"
}
trap cleanup EXIT
```

不要手写固定临时文件：

```bash
/tmp/result.txt
```

原因：

- 容易冲突。
- 可能被其他用户提前创建。
- 有安全风险。

## 错误处理与 trap

示例：

```bash
on_未译12785() {
  local exit_code=$?
  日志 "failed at line $1, exit code $exit_code"
  exit "$exit_code"
}

trap 'on_未译12785 $LINENO' E未译25173未译25173
```

使用建议：

- 简单脚本可以只用 `die` 和日志。
- 关键脚本可以加 `trap E未译25173未译25173`。
- 清理临时文件用 `trap EXIT`。

## 好用工具

### shellcheck

静态检查 Shell 脚本：

```bash
shellcheck script.sh
```

安装：

```bash
sudo apt install shellcheck
sudo dnf install ShellCheck
```

它能发现：

- 未引用变量。
- 未定义变量。
- 不安全通配。
- 无效语法。
- 常见可移植性问题。

### shfmt

格式化 Shell 脚本：

```bash
shfmt -w script.sh
```

安装方式因发行版不同，可能需要从包管理器或官方发布安装。

### bash -n

只检查语法，不执行：

```bash
bash -n script.sh
```

## 使用技巧

- 脚本中使用绝对路径，尤其是 cron 执行的脚本。
- 所有变量默认加双引号。
- 删除、覆盖、移动前先检查目标范围。
- 关键脚本必须有日志和退出码。
- 脚本上线前至少执行 `bash -n` 和 `shellcheck`。

## 难点

- `set -e` 在某些条件判断、管道、子 Shell 中行为不总是直观。
- cron、systemd、手工终端的环境变量不同。
- 脚本执行用户不同，文件权限也不同。
- 自动化脚本一旦写错，破坏速度比手工更快。

## 重点

- Shell 自动化要先保证安全，再追求省事。
- 高风险变量必须校验，不能让空变量进入删除命令。
- 日志、退出码、路径检查是生产脚本基础。
- `shellcheck` 和 `shfmt` 应成为脚本提交前的固定步骤。

## 练习

1. 写一个带 `set -euo pipefail`、`日志`、`die` 的脚本模板。
2. 故意写一个未引用变量的脚本，用 `shellcheck` 查看提示。
3. 写一个删除旧目录的函数，要求校验目标必须在指定目录下。
4. 使用 `trap EXIT` 创建并清理临时文件。
