# systemctl 常用命令

## 作用

`systemctl` 是管理 systemd 服务的核心命令，用于查看状态、启动、停止、重启、重载、设置开机自启、检查是否运行。生产环境中，Web 服务、Java 服务、Node 服务、数据库、缓存、定时任务守护进程，通常都应该由 systemd 或容器平台托管，而不是靠手工命令长期运行。

这一节重点掌握：

- 如何判断服务当前状态。
- 如何安全启动、停止、重启、重载服务。
- 如何设置和验证开机自启。
- 如何看 unit 文件和服务运行参数。
- 如何区分 `active`、`enabled`、`failed` 等状态。

## 痛点

- 只执行了 `systemctl start`，没有设置 `enable`，服务器重启后服务没起来。
- 修改 unit 文件后忘记 `daemon-reload`，新配置没有生效。
- 不区分 `restart` 和 `reload`，导致可以平滑重载的服务被重启中断。
- 服务状态显示 `failed`，但只看应用日志，不看 systemd 日志。
- 看到 `active` 就以为业务正常，实际上端口、健康检查或上游依赖仍有问题。

## 核心小点

### 1. 查看服务状态

```bash
systemctl status nginx
systemctl status demo-api --no-pager
```

重点看：

- `Loaded`：unit 文件是否加载，是否 enabled。
- `Active`：当前运行状态。
- `Main PID`：主进程 PID。
- `CGroup`：服务进程树。
- 最近日志：启动失败时经常有关键错误。

常见状态：

| 状态 | 含义 |
| --- | --- |
| `active (running)` | 正在运行 |
| `inactive (dead)` | 未运行 |
| `failed` | 启动或运行失败 |
| `activating` | 正在启动 |
| `deactivating` | 正在停止 |

脚本里更适合用：

```bash
systemctl is-active nginx
systemctl is-failed nginx
```

### 2. 启动和停止

启动：

```bash
sudo systemctl start nginx
```

停止：

```bash
sudo systemctl stop nginx
```

启动后验证：

```bash
systemctl is-active nginx
sudo ss -lntup | grep ':80'
curl -I http://127.0.0.1
```

停止后验证：

```bash
systemctl is-active nginx
sudo ss -lntup | grep ':80' || true
```

注意：停止数据库、缓存、业务 API 前，要确认维护窗口和影响范围。

### 3. restart 和 reload

重启：

```bash
sudo systemctl restart nginx
```

重载：

```bash
sudo systemctl reload nginx
```

区别：

| 操作 | 含义 | 影响 |
| --- | --- | --- |
| `restart` | 停止旧进程并重新启动 | 通常会中断连接 |
| `reload` | 让服务重新加载配置 | 通常影响更小，但要求服务支持 |

Nginx 常见流程：

```bash
sudo nginx -t
sudo systemctl reload nginx
systemctl status nginx --no-pager
```

如果服务不支持 reload，`systemctl reload` 可能失败。可以查看 unit：

```bash
systemctl cat nginx
```

是否有 `ExecReload`。

### 4. 开机自启

设置开机自启：

```bash
sudo systemctl enable nginx
```

取消自启：

```bash
sudo systemctl disable nginx
```

启动并设置自启：

```bash
sudo systemctl enable --now nginx
```

检查：

```bash
systemctl is-enabled nginx
```

常见状态：

| 状态 | 含义 |
| --- | --- |
| `enabled` | 已设置开机自启 |
| `disabled` | 未设置开机自启 |
| `static` | 不能直接 enable，通常被其他 unit 依赖 |
| `masked` | 被屏蔽，不能启动 |

### 5. 重新加载 systemd 配置

修改 unit 文件后必须执行：

```bash
sudo systemctl daemon-reload
```

常见修改包括：

- 编辑 `/etc/systemd/system/demo-api.service`。
- 新增或删除 unit 文件。
- 修改 drop-in 配置。

标准流程：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-api
systemctl status demo-api --no-pager
```

如果忘记 `daemon-reload`，可能出现“文件改了但服务仍按旧配置启动”的问题。

### 6. 查看 unit 内容

查看最终合并后的 unit：

```bash
systemctl cat demo-api
```

查看属性：

```bash
systemctl show demo-api -p User -p Group -p ExecStart -p Restart -p WorkingDirectory
```

查看依赖：

```bash
systemctl list-dependencies demo-api
systemctl list-dependencies --reverse demo-api
```

查看服务进程：

```bash
systemctl status demo-api --no-pager
systemctl show demo-api -p MainPID
```

### 7. mask 和 unmask

屏蔽服务，禁止启动：

```bash
sudo systemctl mask 服务名
```

取消屏蔽：

```bash
sudo systemctl unmask 服务名
```

适合场景：

- 禁止某个冲突服务被误启动。
- 临时阻止旧服务自动拉起。

注意：`mask` 比 `disable` 更强，`disable` 只是取消开机自启，仍可手动启动；`mask` 会阻止启动。

## 常用命令清单

```bash
# 状态
systemctl status demo-api --no-pager
systemctl is-active demo-api
systemctl is-enabled demo-api
systemctl is-failed demo-api

# 启停
sudo systemctl start demo-api
sudo systemctl stop demo-api
sudo systemctl restart demo-api
sudo systemctl reload demo-api

# 自启
sudo systemctl enable demo-api
sudo systemctl disable demo-api
sudo systemctl enable --now demo-api

# 配置加载
sudo systemctl daemon-reload

# unit 查看
systemctl cat demo-api
systemctl show demo-api
systemctl list-unit-files | grep demo
systemctl list-units --type=service --state=running

# 屏蔽
sudo systemctl mask demo-api
sudo systemctl unmask demo-api
```

## 部署服务常用流程

新建服务后：

```bash
sudo cp demo-api.service /etc/systemd/system/demo-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now demo-api
systemctl status demo-api --no-pager
journalctl -u demo-api -n 100 --no-pager
```

更新服务配置后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart demo-api
systemctl status demo-api --no-pager
```

更新应用包但 unit 不变时：

```bash
sudo systemctl restart demo-api
journalctl -u demo-api -n 100 --no-pager
curl http://127.0.0.1:8080/health
```

## 好用工具

- `systemd-analyze verify`：检查 unit 文件语法和明显问题。
- `systemctl cat`：查看最终生效 unit。
- `journalctl -u`：查看服务日志。
- `loginctl`：查看登录会话，排查用户服务时有用。
- `busctl`：高级 systemd/DBus 排查工具，普通运维不常用。

示例：

```bash
systemd-analyze verify /etc/systemd/system/demo-api.service
```

## 使用技巧

- `start` 只启动当前服务，不代表开机自启；自启要看 `enable`。
- `enable --now` 可以同时启动和设置开机自启。
- 改 unit 文件后必须 `daemon-reload`。
- 能 `reload` 的服务，改配置优先走语法检查加 reload。
- 服务异常先看 `systemctl status`，再看 `journalctl -u`。
- 脚本判断服务状态时，用 `is-active` 比解析 `status` 文本更可靠。

## 难点

- `enabled` 不代表当前正在运行，`active` 也不代表开机自启。
- `reload` 是否可用取决于 unit 是否定义和服务是否支持。
- `After=` 只是启动顺序，不等于强依赖和健康保证。
- `failed` 状态可能需要修复后用 `systemctl reset-failed` 清理展示状态。

## 重点

- systemd 服务管理要区分运行状态和自启状态。
- 修改 unit 后执行 `daemon-reload` 是固定步骤。
- 生产操作优先 `status -> 变更 -> status/journalctl -> 业务验证`。
- 对核心服务执行 `stop/restart` 前要评估业务影响。

## 练习

1. 查看 `nginx` 或任意服务的 `status`、`is-active`、`is-enabled`。
2. 找一个支持 reload 的服务，比较 `reload` 和 `restart` 的差异。
3. 新建一个测试 service，执行 `daemon-reload`、`enable --now` 和状态验证。
4. 用 `systemctl cat` 查看服务完整 unit，并找出 `ExecStart`。
