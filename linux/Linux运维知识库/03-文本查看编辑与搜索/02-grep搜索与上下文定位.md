# grep 搜索与上下文定位

## 作用

`grep` 用于从文本中搜索关键字，是日志排查和配置定位的核心工具。线上问题发生时，日志可能有几十万行，不能靠人工翻。`grep` 可以按错误等级、异常关键字、请求 ID、用户 ID、订单号、配置项快速缩小范围。

## 痛点

- 日志太多，找不到错误位置。
- 只搜 `ERROR`，但看不到错误前后的上下文。
- 大小写不同导致漏搜。
- 不会递归搜索配置目录。
- 不会排除无关噪声，例如健康检查请求。

## 优点

- 快速定位关键行。
- 能显示行号和上下文。
- 能递归查找配置项。
- 能组合多个条件逐步缩小范围。
- 能排除无关内容。

## 基础用法

搜索关键字：

```bash
grep "ERROR" app.log
```

显示行号：

```bash
grep -n "ERROR" app.log
```

忽略大小写：

```bash
grep -i "error" app.log
```

反向排除：

```bash
grep -v "health" access.log
```

递归搜索：

```bash
grep -R "server.port" /opt/apps/demo-api/shared/config
```

## 上下文定位

显示前后 3 行：

```bash
grep -C 3 "Exception" app.log
```

显示匹配后 20 行：

```bash
grep -A 20 "NullPointerException" app.log
```

显示匹配前 10 行：

```bash
grep -B 10 "OutOfMemoryError" app.log
```

适合场景：

- Java 异常堆栈。
- Python traceback。
- 服务启动失败上下文。
- 请求进入和报错之间的日志链路。

## 多条件搜索

先找错误，再找业务关键字：

```bash
grep "ERROR" app.log | grep "orderId=1001"
```

排除无关错误：

```bash
grep "ERROR" app.log | grep -v "timeout"
```

按请求 ID 定位：

```bash
grep "traceId=abc123" app.log
```

按时间粗筛：

```bash
grep "2026-05-11 10:" app.log | grep "ERROR"
```

## 正则与扩展搜索

匹配多个关键字：

```bash
grep -E "ERROR|Exception|OutOfMemory" app.log
```

只匹配完整单词：

```bash
grep -w "error" app.log
```

显示不匹配文件名：

```bash
grep -L "server.port" *.yml
```

显示匹配文件名：

```bash
grep -l "server.port" *.yml
```

## 配置搜索场景

查应用端口：

```bash
grep -R "server.port" /opt/apps/demo-api/shared/config
```

查 Nginx 代理目标：

```bash
grep -R "proxy_pass" /etc/nginx
```

查 systemd 环境文件：

```bash
grep -R "EnvironmentFile" /etc/systemd/system
```

## 日志排查流程

推荐顺序：

1. 先按时间缩小范围。
2. 再按错误等级搜 `ERROR`、`WARN`。
3. 再按异常关键字搜 `Exception`、`Traceback`、`failed`。
4. 再按业务 ID 搜请求链路。
5. 最后用 `-A`、`-B`、`-C` 看上下文。

示例：

```bash
grep "2026-05-11 10:" app.log \
  | grep -E "ERROR|Exception" \
  | grep "orderId=1001"
```

## 使用技巧

- 搜日志优先加 `-n`，方便回到原文件定位。
- 多行异常用 `-A` 或 `-C`。
- 噪声太多用 `-v` 排除。
- 配置目录搜索用 `-R`。
- 大目录搜索时限制路径，避免全盘递归。

## 难点

- `grep` 默认按行匹配，不天然理解多行堆栈。
- 关键字过宽会返回太多内容。
- 日志时间格式不统一时，按时间 grep 可能漏数据。
- 二进制文件被搜索时可能输出干扰，可加 `-I`。

## 重点

- `grep -n` 显示行号。
- `grep -i` 忽略大小写。
- `grep -v` 排除。
- `grep -R` 递归。
- `grep -A/-B/-C` 看上下文。
- 排障要结合时间、错误、请求 ID 和业务字段。

## 练习

1. 创建一个包含 `INFO`、`WARN`、`ERROR` 的日志文件，用 `grep -n` 搜错误。
2. 制造一段多行异常，用 `grep -A 5` 查看堆栈。
3. 用 `grep -R` 在配置目录查找 `port`。
4. 用 `grep -v` 排除包含 `health` 的访问日志。
5. 设计一个按 traceId 定位请求日志的命令。

