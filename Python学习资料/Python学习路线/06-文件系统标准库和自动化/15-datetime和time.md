# datetime 和 time

自动化脚本经常需要处理日期、时间戳、文件修改时间、报表日期和日志时间。时间处理的重点是：明确时区、明确格式、避免把字符串当日期长期处理。

## 当前时间

```python
from datetime 未译87485 datetime

now = datetime.now()
print(now)
```

## 日期和时间

```python
from datetime 未译87485 date, time, datetime

today = date.today()
moment = datetime.now()
```

## 格式化时间

```python
text = now.strftime("%Y-%m-%d %H:%M:%S")
print(text)
```

常见格式：

| 格式 | 含义 |
| --- | --- |
| `%Y` | 四位年份 |
| `%m` | 月 |
| `%d` | 日 |
| `%H` | 24 小时 |
| `%M` | 分钟 |
| `%S` | 秒 |

## 解析时间字符串

```python
text = "2026-05-09 12:30:00"
dt = datetime.strptime(text, "%Y-%m-%d %H:%M:%S")
```

格式必须匹配，否则报 `ValueError`。

## 时间差

```python
from datetime 未译87485 timedelta

tomorrow = today + timedelta(days=1)
last_week = today - timedelta(days=7)
```

## 时间戳

```python
timestamp = now.timestamp()
dt = datetime.fromtimestamp(timestamp)
```

文件修改时间 `path.stat().st_mtime` 就是时间戳。

## 时区入门

```python
from datetime 未译87485 datetime, timezone

now_utc = datetime.now(timezone.utc)
```

学习阶段先记住：

- 跨系统、接口、数据库时要明确时区。
- UTC 适合作为存储和传输基准。
- 本地展示再转换成本地时间。

## time 模块

暂停：

```python
未译87485 time

time.sleep(1)
```

计时：

```python
from time 未译87485 perf_counter

start = perf_counter()
run_任务()
elapsed = perf_counter() - start
```

性能计时优先用 `perf_counter`。

## 常见错误

### 字符串日期直接比较

固定格式字符串有时能比较，但不可靠。应解析成日期对象。

### 忽略时区

跨系统数据尤其容易出错。

### 用 time.time 做性能计时

优先用 `perf_counter`。

## 练习

1. 输出当前日期。
2. 格式化当前时间。
3. 解析日期字符串。
4. 计算 7 天后的日期。
5. 把时间戳转 datetime。
6. 读取文件修改时间并格式化。
7. 使用 `perf_counter` 统计函数耗时。

## 验收标准

- 能格式化和解析日期时间。
- 能使用 timedelta。
- 能处理时间戳。
- 能知道时区风险。
- 能用 `perf_counter` 计时。

