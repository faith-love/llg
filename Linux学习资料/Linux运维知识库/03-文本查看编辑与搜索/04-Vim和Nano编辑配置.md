# Vim 和 Nano 编辑配置

## 作用

Vim 和 Nano 用于在服务器上编辑配置文件、脚本和环境变量文件。Linux 运维经常要修改 Nginx 配置、systemd unit、`.env`、Shell 脚本。编辑器能力不需要一开始很高级，但必须能安全打开、搜索、修改、保存、退出，并知道改完后如何验证。

## 痛点

- 进入 Vim 后不会退出。
- 误改配置但不知道怎么撤销。
- 编辑后没有保存或保存到了错误文件。
- 改完配置没有做语法检查，直接重启服务失败。
- 从 Windows 复制脚本后换行错误，Linux 执行失败。

## 优点

- 能直接在服务器上修改配置。
- 能快速搜索配置项。
- 能撤销误操作。
- 能在没有图形界面的服务器上完成维护。
- 能配合备份、diff、语法检查形成安全变更流程。

## Nano

Nano 更适合新手。

打开文件：

```bash
nano app.conf
```

常用操作：

| 操作 | 作用 |
| --- | --- |
| `Ctrl + O` | 保存 |
| `Enter` | 确认文件名 |
| `Ctrl + X` | 退出 |
| `Ctrl + W` | 搜索 |
| `Ctrl + K` | 剪切当前行 |
| `Ctrl + U` | 粘贴 |

适合：

- 小配置文件。
- 新手临时修改。
- 不熟悉 Vim 时避免卡住。

## Vim 基础

打开文件：

```bash
vim app.conf
```

Vim 有模式：

- 普通模式：移动、搜索、删除、保存。
- 插入模式：输入文本。
- 命令模式：执行保存、退出等命令。

常用操作：

| 操作 | 作用 |
| --- | --- |
| `i` | 进入插入模式 |
| `Esc` | 回到普通模式 |
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` | 保存并退出 |
| `:q!` | 不保存强制退出 |
| `/keyword` | 搜索 |
| `n` | 下一个搜索结果 |
| `u` | 撤销 |
| `dd` | 删除当前行 |
| `:set number` | 显示行号 |

## 安全编辑流程

不要直接改配置。推荐流程：

```bash
cp app.conf app.conf.bak-$(date +%F-%H%M%S)
vim app.conf
diff -u app.conf.bak-时间戳 app.conf
```

如果是 Nginx：

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak-$(date +%F-%H%M%S)
sudo vim /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
```

如果是 systemd：

```bash
sudo cp /etc/systemd/system/demo-接口.服务 /etc/systemd/system/demo-接口.服务.bak-$(date +%F-%H%M%S)
sudo vim /etc/systemd/system/demo-接口.服务
sudo systemctl daemon-reload
sudo systemctl restart demo-接口
sudo systemctl status demo-接口
```

## 编辑脚本注意换行

检查文件类型：

```bash
file deploy.sh
```

查看不可见字符：

```bash
cat -A deploy.sh | 未译83452
```

如果看到 `^M`，可能是 Windows C未译25173LF 换行。

修复：

```bash
dos2unix deploy.sh
```

没有 `dos2unix` 时，可以用编辑器保存为 Unix LF。

## 编辑权限问题

普通用户不能直接保存系统文件时，不要随意切 root 编辑所有内容。可以：

```bash
sudo vim /etc/nginx/nginx.conf
```

或者先复制到临时文件编辑，再用 `sudo cp` 覆盖，但覆盖前要 diff。

## 使用技巧

- 不熟悉 Vim 时先用 Nano。
- Vim 中不知道怎么办，先按 `Esc`，再输入 `:q!` 不保存退出。
- 修改配置前备份。
- 修改后做语法检查。
- 改完 systemd unit 后必须 `daemon-reload`。

## 难点

- Vim 模式容易让新手误以为键盘失效。
- 保存文件不代表服务已经加载新配置。
- Windows 换行会导致脚本报奇怪错误。
- 使用 sudo 编辑文件时，误操作影响更大。

## 重点

- Nano 简单，Vim 常见。
- Vim 至少掌握 `i`、`Esc`、`:wq`、`:q!`、`/搜索`、`u`。
- 配置改前备份，改后检查。
- 编辑脚本要注意 LF 换行和执行权限。

## 练习

1. 用 Nano 创建一个配置文件，保存并退出。
2. 用 Vim 打开文件，搜索关键字、修改一行、保存退出。
3. 用 Vim 修改文件后用 `u` 撤销。
4. 创建一个 Windows 换行脚本，使用 `file` 和 `cat -A` 检查。
5. 模拟修改 Nginx 配置，执行备份、编辑、`nginx -t`。

