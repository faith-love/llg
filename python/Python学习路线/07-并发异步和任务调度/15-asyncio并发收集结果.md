# asyncio并发收集结果

asyncio 并发任务不只是“同时启动”，还要正确收集结果、处理异常、控制顺序和失败策略。本节重点掌握 `gather`、`as_completed` 和结构化收集。

## gather

`asyncio.gather()` 用于等待多个可等待对象完成。

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

结果顺序和传入顺序一致。

## gather 异常

默认情况下，如果其中一个任务抛异常，`gather` 会抛出异常。

```python
await asyncio.gather(task1, task2)
```

如果希望把异常作为结果返回：

```python
results = await asyncio.gather(*tasks, return_exceptions=True)
```

之后必须检查结果中是否有异常对象。

## as_completed

`asyncio.as_completed()` 按完成顺序处理任务。

```python
async def main():
    tasks = [asyncio.create_task(work(i)) for i in range(5)]
    for done in asyncio.as_completed(tasks):
        result = await done
        print(result)
```

适合：

- 谁先完成先处理谁。
- 单个任务耗时差异很大。
- 需要流式输出结果。

## 任务元数据

异步任务经常需要知道结果属于哪个输入。

推荐让任务返回结构化结果：

```python
from dataclasses import dataclass


@dataclass
class TaskResult:
    item: str
    success: bool
    message: str


async def work(item):
    try:
        await asyncio.sleep(1)
        return TaskResult(item, True, "ok")
    except Exception as exc:
        return TaskResult(item, False, repr(exc))
```

这样比依赖外部字典更稳。

## TaskGroup 概念

较新 Python 版本提供 `asyncio.TaskGroup`，用于结构化并发。

```python
import asyncio


async def main():
    async with asyncio.TaskGroup() as group:
        task1 = group.create_task(work(1))
        task2 = group.create_task(work(2))
```

它的思想是：一组任务有明确作用域，离开作用域时任务要么完成，要么异常被处理。

学习顺序：

1. 先掌握 `create_task`。
2. 再掌握 `gather`。
3. 再理解 `TaskGroup`。

## 控制并发数量

不要一次性启动无限任务。可以用 `Semaphore`：

```python
async def limited_work(item, semaphore):
    async with semaphore:
        return await work(item)


async def main():
    semaphore = asyncio.Semaphore(10)
    tasks = [limited_work(item, semaphore) for item in items]
    return await asyncio.gather(*tasks)
```

## 分批处理

如果任务数量极大，可以分批：

```python
def chunks(items, size):
    for index in range(0, len(items), size):
        yield items[index:index + size]
```

避免一次创建大量 Task 占用内存。

## 常见错误

### gather 结果顺序误解

`gather` 返回顺序不是完成顺序，而是传入顺序。

### return_exceptions 后不检查

异常会混在结果列表里，必须显式判断。

### 一次创建几十万任务

会造成内存压力。应使用队列、信号量或分批。

### 任务失败策略不明确

要提前决定：一个失败是否终止全部，还是记录后继续。

## 练习

1. 用 `gather` 并发执行 5 个协程。
2. 观察 `gather` 结果顺序。
3. 用 `as_completed` 按完成顺序处理。
4. 让一个任务抛异常，观察 gather 行为。
5. 使用 `return_exceptions=True`。
6. 用结构化结果收集成功和失败。
7. 用 `Semaphore` 限制最多 3 个任务同时运行。
8. 分批处理 1000 个模拟任务。

## 验收标准

- 能使用 `gather` 和 `as_completed`。
- 能解释两者结果顺序差异。
- 能处理任务异常。
- 能限制 asyncio 并发数量。
