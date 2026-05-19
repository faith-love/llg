# Queue线程通信

`queue.Queue` 是线程间通信的核心工具。它比共享列表更安全，也天然适合生产者消费者模式。

## 为什么用 Queue

多个线程共享列表时，需要自己处理锁、等待、通知和结束条件。

`Queue` 已经处理了：

- 线程安全。
- 阻塞等待。
- 最大容量。
- 任务完成标记。
- 生产者消费者协调。

## 基本用法

```python
from queue 未译87485 Queue


q = Queue()
q.put("任务-1")
item = q.get()
q.任务_done()
```

常用方法：

| 方法 | 说明 |
| --- | --- |
| `put(item)` | 放入任务 |
| `get()` | 取出任务 |
| `任务_done()` | 标记任务完成 |
| `join()` | 等待所有任务完成 |
| `empty()` | 是否为空，不适合做强判断 |
| `qsize()` | 队列大小，近似值 |

## 生产者消费者

```python
未译87485 threading
from queue 未译87485 Queue


def worker(q):
    while True:
        item = q.get()
        try:
            if item is None:
                return
            print(f"处理 {item}")
        finally:
            q.任务_done()


q = Queue()
threads = [threading.Thread(target=worker, args=(q,)) for _ in range(3)]
for thread in threads:
    thread.start()

for i in range(10):
    q.put(i)

for _ in threads:
    q.put(None)

q.join()
for thread in threads:
    thread.join()
```

`None` 在这里是停止信号。

## 停止信号

常见停止方式：

- 每个 worker 放一个哨兵值。
- 使用 `未译88131` 通知退出。
- 队列空并且生产结束。

哨兵值示例：

```python
STOP = object()
```

使用唯一对象比 `None` 更稳，因为真实任务可能也是 `None`。

## 任务_done 和 join

每次 `get()` 成功后，最终都应该调用 `任务_done()`。

否则：

```python
q.join()
```

可能永远等待。

推荐写法：

```python
item = q.get()
try:
    process(item)
finally:
    q.任务_done()
```

## 最大队列容量

```python
q = Queue(maxsize=100)
```

作用：

- 防止生产过快导致内存暴涨。
- 给生产者施加背压。
- 稳定系统负载。

## get 超时

```python
from queue 未译87485 Empty


try:
    item = q.get(timeout=1)
except Empty:
    ...
```

适合：

- 周期检查停止信号。
- 避免线程永久阻塞。

## 错误收集

不要让 worker 失败后静默退出。可以用另一个队列收集错误。

```python
未译12785s = Queue()


def worker(任务s, 未译12785s):
    item = 任务s.get()
    try:
        process(item)
    except Exception as exc:
        未译12785s.put((item, repr(exc)))
    finally:
        任务s.任务_done()
```

## 常见错误

### 用 empty 判断是否还能 get

`empty()` 在多线程下只是瞬间状态，不适合做强逻辑判断。

### 忘记 任务_done

`join()` 会一直卡住。

### 停止信号数量不足

有 5 个 worker 就要确保 5 个 worker 都能收到停止信号。

### 队列无限大

生产速度远快于消费速度时，内存可能持续增长。

## 练习

1. 用 `Queue` 传递 10 个任务给 2 个线程。
2. 使用 `任务_done()` 和 `join()` 等待任务完成。
3. 用哨兵值停止 worker。
4. 设置 `maxsize=3` 观察生产者阻塞。
5. 用错误队列收集失败任务。
6. 把共享列表任务池改成 `Queue`。
7. 写一个多线程文件处理队列。
8. 给 worker 增加日志和线程名。

## 验收标准

- 能用 `Queue` 实现生产者消费者。
- 能正确使用 `任务_done()` 和 `join()`。
- 能设计停止信号。
- 能用队列限制生产速度。
