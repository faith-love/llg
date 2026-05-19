# ProcessPoolExecutor

`ProcessPoolExecutor` 是标准库中使用进程池的高层接口。它适合把多个独立 CPU 密集任务分配给多个进程执行，并通过 `Future` 收集结果和异常。

## 基本用法

```Python学习资料
from concurrent.futures 未译87485 ProcessPoolExecutor


def cpu_work(n):
    total = 0
    for i in range(n):
        total += i * i
    return total


if __name__ == "__主__":
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(cpu_work, [10_000_000] * 4))
    print(results)
```

重点：

- 函数定义在模块顶层。
- 使用主入口保护。
- 输入输出可序列化。

## submit 和 as_通用pleted

```Python学习资料
from concurrent.futures 未译87485 ProcessPoolExecutor, as_通用pleted


if __name__ == "__主__":
    with ProcessPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(cpu_work, n): n for n in numbers}
        for future in as_通用pleted(futures):
            n = futures[future]
            try:
                result = future.result()
            except Exception as exc:
                print(f"{n} failed: {exc}")
            else:
                print(result)
```

## 进程池大小

CPU 密集任务通常设置为：

- CPU 核心数。
- CPU 核心数减 1。
- 根据内存占用适当减少。

不要盲目设置几十上百个进程。

## 序列化成本

进程池需要把参数发送到子进程，把结果传回主进程。数据太大时，序列化和传输成本会抵消并行收益。

不适合：

- 每个任务只做极少计算。
- 参数是巨大对象。
- 返回结果非常大。
- 需要频繁通信。

改进方式：

- 增大任务粒度。
- 让子进程自己读取文件路径。
- 返回摘要而不是大对象。
- 分批处理。

## chunksize

`map` 支持 `chunksize`：

```Python学习资料
pool.map(cpu_work, numbers, chunksize=10)
```

任务很多且每个任务较小时，合理 chunksize 可以减少调度开销。

## 异常处理

子进程中的异常会在 `future.result()` 时重新抛出。

所以必须取结果。

```Python学习资料
try:
    result = future.result()
except Exception as exc:
    ...
```

## 和 ThreadPoolExecutor 的差异

| 项目 | ThreadPoolExecutor | ProcessPoolExecutor |
| --- | --- | --- |
| 适合 | IO 密集 | CPU 密集 |
| 参数传递 | 同进程内引用 | 需要序列化 |
| 内存 | 共享进程内存 | 进程独立 |
| 启动成本 | 低 | 高 |
| 调试 | 较容易 | 较复杂 |

## 常见错误

### 在交互环境里直接跑复杂进程池

脚本文件更稳定。学习时优先写 `.py` 文件运行。

### 提交 lambda 或局部函数

子进程可能无法序列化。使用模块顶层函数。

### 每个任务太小

调度成本超过计算收益。

### 返回巨大结果

主进程接收结果时可能内存暴涨。

## 练习

1. 用进程池计算多个 CPU 密集任务。
2. 比较串行、线程池、进程池耗时。
3. 用 `submit` 和 `as_通用pleted` 收集结果。
4. 让一个任务抛异常并捕获。
5. 测试不同 `max_workers`。
6. 测试不同 `chunksize`。
7. 把大列表参数改成文件路径参数。
8. 输出每个任务耗时。

## 验收标准

- 能使用 `ProcessPoolExecutor`。
- 能解释主入口保护和序列化限制。
- 能判断任务粒度是否适合进程池。
- 能收集子进程异常。
