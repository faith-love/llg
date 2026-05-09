# threading线程基础

`threading` 是 Python 标准库中的线程模块。它适合学习线程生命周期、线程协作、后台任务和阻塞 IO 并发。工程中更常用线程池，但理解 `threading` 能帮助你看懂线程池背后的基本行为。

## 创建线程

```python
import threading


def worker(name):
    print(f"hello {name}")


thread = threading.Thread(target=worker, args=("task-1",))
thread.start()
thread.join()
```

流程：

1. 创建 `Thread` 对象。
2. `start()` 启动线程。
3. 线程运行 `target` 函数。
4. `join()` 等待线程结束。

## start 和 run 的区别

应该调用：

```python
thread.start()
```

不要直接调用：

```python
thread.run()
```

`run()` 只是普通方法调用，不会启动新线程。

## join

`join()` 用于等待线程完成。

```python
thread.join(timeout=5)
```

如果设置超时，超时后主线程继续执行。可以用 `is_alive()` 判断线程是否仍在运行。

## 多个线程

```python
import threading
from time import sleep


def worker(index):
    sleep(1)
    print(f"done {index}")


threads = []
for index in range(5):
    thread = threading.Thread(target=worker, args=(index,))
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()
```

## daemon 线程

daemon 线程是后台线程。当只剩 daemon 线程时，程序可以直接退出。

```python
thread = threading.Thread(target=worker, daemon=True)
```

适合：

- 非关键后台监控。
- 临时辅助任务。

不适合：

- 必须完整写入文件的任务。
- 必须释放资源的任务。
- 必须保证完成的业务任务。

## 线程命名

给线程命名有助于日志排查。

```python
thread = threading.Thread(target=worker, name="download-worker-1")
```

日志中可以输出线程名：

```python
import logging

logging.basicConfig(format="%(asctime)s %(threadName)s %(message)s")
```

## 线程异常

线程里的异常不会像普通函数那样直接在主线程抛出。你需要记录日志或在线程函数里捕获。

```python
import logging


def worker():
    try:
        raise ValueError("bad task")
    except Exception:
        logging.exception("线程任务失败")
```

工程中通常用 `ThreadPoolExecutor`，通过 `future.result()` 收集异常。

## 传递停止信号

不要强行杀线程。常见做法是使用 `threading.Event`。

```python
import threading
from time import sleep


stop_event = threading.Event()


def worker():
    while not stop_event.is_set():
        print("working")
        sleep(1)


thread = threading.Thread(target=worker)
thread.start()
sleep(3)
stop_event.set()
thread.join()
```

## 线程适用场景

适合：

- 阻塞 IO。
- 调用同步库。
- 后台监控。
- 简单生产者消费者。
- 少量长期运行任务。

不适合：

- 大量纯 Python CPU 计算。
- 需要强隔离的任务。
- 很大规模连接管理。
- 复杂任务编排。

## 常见错误

### 忘记 join

主线程可能提前退出，或测试无法确定任务是否完成。

### 直接共享变量

多个线程修改共享数据会产生竞态条件。

### daemon 滥用

daemon 线程可能在写文件、发请求、释放资源前被终止。

### 线程数量无限增长

每个线程都有系统资源成本。批量任务优先用线程池。

## 练习

1. 创建一个线程打印消息。
2. 创建 5 个线程并等待完成。
3. 给线程命名并在日志中打印线程名。
4. 演示 `start()` 和 `run()` 的区别。
5. 使用 `join(timeout=...)` 等待线程。
6. 在线程中捕获异常并记录日志。
7. 用 `Event` 停止一个循环线程。
8. 把多个手动线程改写为线程池。

## 验收标准

- 能创建、启动和等待线程。
- 能解释 daemon 线程的风险。
- 能用 `Event` 传递停止信号。
- 知道线程异常需要显式处理。
