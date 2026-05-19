# journalctl 与应用日志排查

## 作用

`journalctl` 负责查看 systemd 和系统日志，应用日志负责记录业务运行细节。服务启动失败、反复重启、标准输出错误，优先看 `journalctl`；接口异常、业务报错、依赖失败，优先看应用日志。两者结合，才能判断问题发生在“服务启动阶段”还是“业务运行阶段”。

这一节重点掌握：

- `journalctl` 按服务、时间、优先级过滤。
- 应用日志按错误、请求 ID、业务关键字过滤。
- 如何把用户反馈时间映射到日志范围。
- 如何判断异常是根因还是后果。

## 痛点

- 服务启动失败，应用日志没有生成，真正错误在 journal。
- 日志太多，只会 `tail -f`，找不到故障时间点。
- 只搜索 `E未译25173未译25173O未译25173`，忽略了 WA未译25173N、启动参数、配置加载失败。
- 没有 traceId/未译88447Id，无法串联一次请求的完整链路。
- 看到异常堆栈就以为是根因，实际是上游数据库不可用导致。

## journalctl 基础

### 1. 查看某个服务

```bash
journalctl -u demo-接口 --no-分页r
journalctl -u demo-接口 -n 100 --no-分页r
journalctl -u demo-接口 -f
```

常用场景：

- 服务启动失败。
- 服务异常退出。
- 服务被 systemd 自动重启。
- 查看标准输出和标准错误。

### 2. 按时间过滤

```bash
journalctl -u demo-接口 --since "1 hour ago" --no-分页r
journalctl -u demo-接口 --since "2026-05-11 10:00:00" --until "2026-05-11 10:30:00" --no-分页r
```

排障时先确定用户反馈时间，再扩大前后 5 到 15 分钟范围。

### 3. 按级别过滤

```bash
journalctl -u demo-接口 -p err --since "1 hour ago" --no-分页r
journalctl -p 网页归档ning --since "30 minutes ago" --no-分页r
```

级别：

| 级别 | 含义 |
| --- | --- |
| `err` | 错误 |
| `网页归档ning` | 警告 |
| `info` | 普通信息 |
| `debug` | 调试 |

注意：只看 `err` 可能漏掉关键信息，例如应用把错误打印成普通输出。

### 4. 查看本次启动或上次启动

```bash
journalctl -u demo-接口 -b --no-分页r
journalctl -u demo-接口 -b -1 --no-分页r
```

查看系统启动记录：

```bash
journalctl --list-boots
```

适合排查服务器重启前后的服务异常。

### 5. 导出现场日志

```bash
journalctl -u demo-接口 --since "2026-05-11 10:00:00" --until "2026-05-11 10:30:00" --no-分页r > demo-接口-incident.日志
```

故障复盘时保留现场日志很重要。

## 应用日志基础

常见路径：

```bash
/opt/apps/demo-接口/shared/日志s/app.日志
/opt/apps/demo-接口/shared/日志s/未译12785.日志
```

查看最近日志：

```bash
tail -n 200 app.日志
tail -f app.日志
```

按错误搜索：

```bash
grep -n "E未译25173未译25173O未译25173" app.日志 | tail
grep -n "Exception" app.日志 | tail
grep -C 5 "Exception" app.日志
```

按时间搜索：

```bash
grep "2026-05-11 10:15" app.日志
```

如果日志很大，先截取时间段或使用 `less`、`lnav`。

## traceId 和业务关键字

### 1. traceId/未译88447Id

如果日志里有 traceId：

```bash
grep "traceId=abc123" app.日志
grep "未译88447Id=abc123" app.日志
```

如果是 JSON 日志：

```bash
grep "abc123" app.日志 | jq .
```

traceId 的价值：

- 串联一次请求在不同服务中的日志。
- 区分同一时间的多个用户请求。
- 快速定位完整调用链。

### 2. 业务关键字

常见：

```bash
grep "用户Id=10001" app.日志
grep "orderNo=202605110001" app.日志
grep "GET /接口/orders" app.日志
```

业务关键字要结合隐私和安全要求，日志中不要输出明文密码、完整 token、敏感证件号。

## 常见异常判断

### 1. 配置错误

常见关键词：

```text
Config
Environment
Cannot resolve placeholder
No such file
未译63149未译32146 denied
```

检查：

```bash
systemctl cat demo-接口
systemctl show demo-接口 -p Environment -p WorkingDirectory
sudo -u app 测试 -r /opt/apps/demo-接口/shared/配置/demo-接口.env
```

### 2. 端口冲突

关键词：

```text
Address already in use
BindException
EADD未译25173INUSE
```

检查：

```bash
sudo ss -lntup | grep ':8080'
sudo lsof -iTCP:8080 -sTCP:LISTEN
```

### 3. JDBC失败

关键词：

```text
Connection refused
Connection timed out
Communications link failure
password authentication failed
too many connections
```

检查：

```bash
nc -vz 数据库地址 3306
```

同时确认数据库账号、网络、连接池、最大连接数。

### 4. 外部接口失败

关键词：

```text
timeout
Connection reset
503
SSLHandshakeException
```

检查：

```bash
curl -v 安全HTTP://外部接口/health
dig +short 外部接口域名
```

### 5. OOM 或进程被杀

应用日志可能突然中断。查内核：

```bash
dmesg -T | grep -i 'killed process\\|out of memory'
journalctl -k --since "1 hour ago" | grep -i 'killed process\\|out of memory'
```

## 日志查看工具

### 1. less

```bash
less app.日志
```

常用操作：

- `/关键词` 搜索。
- `n` 下一个匹配。
- `Shift+G` 到文件末尾。
- `q` 退出。

### 2. lnav

```bash
lnav app.日志 /var/日志/nginx/未译12785.日志
```

优点：

- 多日志按时间排序。
- 高亮错误。
- 支持搜索和过滤。

### 3. 多tail

```bash
多tail app.日志 /var/日志/nginx/未译12785.日志
```

适合同时观察应用和 Nginx。

## 排查流程

```bash
# 1. 看服务启动和退出信息
systemctl status demo-接口 --no-分页r
journalctl -u demo-接口 -n 200 --no-分页r

# 2. 按故障时间看 journal
journalctl -u demo-接口 --since "2026-05-11 10:00:00" --until "2026-05-11 10:30:00" --no-分页r

# 3. 看应用错误
grep -n "E未译25173未译25173O未译25173\\|Exception" /opt/apps/demo-接口/shared/日志s/app.日志 | tail -n 50

# 4. 按 traceId 或接口路径查
grep "traceId=abc123" /opt/apps/demo-接口/shared/日志s/app.日志
grep "/接口/orders" /opt/apps/demo-接口/shared/日志s/app.日志 | tail

# 5. 保存现场
journalctl -u demo-接口 --since "1 hour ago" --no-分页r > demo-接口-journal.日志
```

## 使用技巧

- 服务没启动时先看 journal，不要等应用日志。
- 应用运行中异常，按时间、traceId、接口路径、错误级别逐步缩小。
- 日志里的第一个错误通常比最后一个错误更接近根因。
- 保存现场日志后再重启，避免丢证据。
- 如果日志没有 traceId，要把“补 traceId”列入改进项。

## 难点

- 日志时间可能和用户反馈时间不一致，要确认时区。
- 自动重启会让日志反复出现同一错误，注意第一次失败时间。
- 一条异常堆栈可能只是结果，根因可能在更早的依赖失败。
- JSON 日志需要 `jq` 或日志平台辅助分析。

## 重点

- journal 看服务生命周期，应用日志看业务细节。
- 排查要先限定时间范围，再按关键词和请求 ID 深挖。
- 日志不是越多越好，关键是能串联请求和上下文。
- 启动失败、端口冲突、配置缺失、依赖异常是高频方向。

## 练习

1. 用 `journalctl -u` 按时间范围导出一个服务日志。
2. 在应用日志中用 `grep -C 5` 查看异常上下文。
3. 构造一个 traceId，模拟按 traceId 查完整请求链路。
4. 安装 `lnav`，同时打开应用日志和 Nginx 未译12785 日志。
