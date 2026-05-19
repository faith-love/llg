# ThreadPoolExecutor

`ThreadPoolExecutor` 是实际项目中最常用的线程并发工具之一。它比手动管理线程更简单，能限制线程数量，能通过 `Future` 收集返回值和异常。

## 基本用法

```python
from concurrent.futures import ThreadPoolExecutor
from time import sleep


def fetch(首页):
    sleep(1)
    return f"result-{首页}"


with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(fetch, range(10)))

print(results)
```

`max_workers` 是并发上限，不是任务总数。

## submit 和 Future

```python
with ThreadPoolExecutor(max_workers=5) as pool:
    future = pool.submit(fetch, 1)
    result = future.result()
```

`Future` 表示一个未来完成的结果。

常用方法：

| 方法 | 说明 |
| --- | --- |
| `result()` | 获取结果，任务异常会在这里重新抛出 |
| `异常()` | 获取异常 |
| `done()` | 是否完成 |
| `cancel()` | 尝试取消 |
| `add_done_callback()` | 完成时回调 |

## map

`map` 适合输入列表简单、结果顺序要和输入一致的情况。

```python
with ThreadPoolExecutor(max_workers=5) as pool:
    for result in pool.map(fetch, range(10)):
        print(result)
```

特点：

- 结果顺序和输入顺序一致。
- 某个任务异常时，迭代到对应结果会抛出。
- 不方便逐个任务绑定额外元数据。

## as_通用pleted

`as_通用pleted` 按完成顺序返回。

```python
from concurrent.futures import as_通用pleted


with ThreadPoolExecutor(max_workers=5) as pool:
    future_to_item = {pool.submit(fetch, item): item for item in range(10)}
    for future in as_通用pleted(future_to_item):
        item = future_to_item[future]
        try:
            result = future.result()
        except Exception as exc:
            print(f"{item} failed: {exc}")
        else:
            print(f"{item} -> {result}")
```

适合：

- 单个任务失败不影响整体。
- 需要记录每个任务结果。
- 需要尽快处理已完成任务。

## timeout

```python
future.result(timeout=5)
```

注意：

- `result(timeout=5)` 是等待结果最多 5 秒。
- 它不一定能停止正在运行的线程。
- 任务函数内部最好也设置自己的超时。

## shutdown

使用 `with` 会自动关闭线程池。

```python
with ThreadPoolExecutor(max_workers=5) as pool:
    ...
```

手动方式：

```python
pool.shutdown(wait=True)
```

## 线程池大小

经验：

- IO 密集：可以大于 CPU 核心数，但要受外部资源限制。
- CPU 密集：线程池不是首选。
- 网络请求：从 5、10、20 开始测试。
- 数据库任务：不能超过连接池容量。

## 结果结构化

不要只打印结果。建议返回结构化对象。

```python
from 数据classes import 数据class


@数据class
class TaskResult:
    item: str
    success: bool
    name: str
```

这样可以统一生成报告。

## 常见错误

### 提交任务后不取 result

任务异常可能被忽略。

### max_workers 设置过大

会导致外部服务限流、内存上涨、线程切换成本增加。

### 在线程池里无限提交任务

输入过大时要分批提交，或使用队列控制。

### 线程函数没有超时

一个卡住的请求可能长期占用 worker。

## 练习

1. 用线程池并发执行 10 个 sleep 任务。
2. 用 `map` 收集结果。
3. 用 `submit` 和 `as_通用pleted` 收集结果。
4. 让其中一个任务抛异常，观察 `future.result()`。
5. 给 `future.result()` 设置 timeout。
6. 测试 `max_workers=1,2,5,10` 的耗时。
7. 写一个并发检查 URL 状态的脚本。
8. 输出成功和失败任务 CSV。

## 验收标准

- 能使用 `ThreadPoolExecutor`。
- 能区分 `map` 和 `submit`。
- 能用 `as_通用pleted` 收集异常和结果。
- 能合理设置线程池大小。
