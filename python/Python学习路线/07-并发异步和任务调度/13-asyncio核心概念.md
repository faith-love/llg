# asyncio核心概念

`asyncio` 是 Python 标准库中的异步编程框架，适合管理大量非阻塞 IO 任务。它和线程、进程的思路不同：asyncio 使用事件循环调度协程，任务在 `await` 处主动让出控制权。

## 协程

用 `async def` 定义协程函数：

```python
async def hello():
    return "hello"
```

调用协程函数不会立即执行函数体，而是得到一个协程对象。

```python
coro = hello()
```

要运行它，需要 `await` 或交给事件循环。

## await

`await` 表示等待一个可等待对象完成，同时把控制权交回事件循环。

```python
import asyncio


async def main():
    await asyncio.sleep(1)
    print("done")


asyncio.run(main())
```

`asyncio.sleep(1)` 不会阻塞整个线程，事件循环可以运行其他协程。

## 事件循环

事件循环负责：

- 调度协程。
- 管理任务。
- 处理 IO 事件。
- 恢复等待完成的协程。

通常使用：

```python
asyncio.run(main())
```

它会创建事件循环、运行主协程、关闭事件循环。

## asyncio 不等于多线程

asyncio 通常在单线程中运行多个协程。

它适合：

- 大量网络 IO。
- 高并发等待。
- 长连接。
- 异步服务。

不适合：

- 大量纯 Python CPU 计算。
- 协程里调用阻塞同步函数。

## 阻塞事件循环

错误示例：

```python
import time


async def bad():
    time.sleep(5)
```

`time.sleep()` 会阻塞整个事件循环。

正确示例：

```python
import asyncio


async def good():
    await asyncio.sleep(5)
```

## 并发运行多个协程

```python
import asyncio


async def work(index):
    await asyncio.sleep(1)
    return index


async def main():
    results = await asyncio.gather(
        work(1),
        work(2),
        work(3),
    )
    print(results)


asyncio.run(main())
```

总耗时接近 1 秒，而不是 3 秒。

## 可等待对象

常见可等待对象：

- 协程对象。
- `Task`。
- `Future`。

初学阶段重点掌握协程和 Task。

## 常见错误

### 忘记 await

调用协程函数后如果不 `await`，函数体不会按预期执行。

### 在 async 函数里调用阻塞函数

会卡住整个事件循环。

### 以为 asyncio 自动并行计算

asyncio 是并发 IO 模型，不是 CPU 并行模型。

### 在已有事件循环中重复 asyncio.run

`asyncio.run()` 通常只在程序入口调用一次。

## 练习

1. 写一个 `async def` 函数并用 `asyncio.run` 执行。
2. 使用 `await asyncio.sleep()`。
3. 用 `gather` 并发运行 3 个协程。
4. 把 `time.sleep()` 放进协程，观察阻塞。
5. 改成 `asyncio.sleep()`。
6. 解释调用协程函数和运行协程的区别。
7. 写一个模拟并发请求脚本。

## 验收标准

- 能解释协程、await 和事件循环。
- 能使用 `asyncio.run()`。
- 能并发运行多个协程。
- 能识别阻塞事件循环的代码。
