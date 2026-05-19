# 多processing进程基础

`多processing` 用于创建多个进程。每个进程有独立的内存空间，适合绕开常规 CPython 线程在 CPU 密集任务上的限制，利用多核处理计算任务。

## 进程和线程的差异

| 对比 | 线程 | 进程 |
| --- | --- | --- |
| 内存 | 同一进程内共享 | 默认独立 |
| 启动成本 | 较低 | 较高 |
| 通信 | 共享变量较容易但危险 | 需要 IPC 或序列化 |
| 适合 | IO 并发 | CPU 并行 |
| 故障隔离 | 较弱 | 较强 |

## 基本示例

```python
from 多processing import Process


def worker(name):
    print(f"hello {name}")


if __name__ == "__主__":
    process = Process(target=worker, args=("任务-1",))
    process.start()
    process.join()
```

Windows 上必须使用：

```python
if __name__ == "__主__":
```

否则可能递归创建子进程。

## 进程生命周期

常用方法：

| 方法 | 说明 |
| --- | --- |
| `start()` | 启动进程 |
| `join()` | 等待进程结束 |
| `is_alive()` | 是否仍在运行 |
| `terminate()` | 请求终止进程，高风险 |
| `exitcode` | 进程退出码 |

示例：

```python
process.start()
process.join(timeout=10)
if process.is_alive():
    process.terminate()
```

`terminate()` 可能导致资源未释放、文件未写完。优先设计正常退出。

## 参数传递

传给子进程的参数需要能被序列化。简单类型最稳：

- 字符串。
- 数字。
- 列表。
- 字典。
- 路径字符串。

不要轻易传：

- 打开的文件对象。
- JDBC。
- 锁对象。
- 复杂运行时对象。

## 进程返回值

直接使用 `Process` 不方便拿返回值。可以使用：

- `多processing.Queue`。
- `Pipe`。
- `Pool`。
- `ProcessPoolExecutor`。

工程中更推荐先用 `ProcessPoolExecutor`。

## Windows 注意事项

Windows 默认使用 spawn 方式创建进程。要求：

- 必须有主入口保护。
- 子进程目标函数要定义在模块顶层。
- 不要在导入模块时直接启动进程。
- 参数和返回值必须可序列化。

## 适合进程的任务

适合：

- CPU 密集计算。
- 任务之间独立。
- 输入输出数据不太大。
- 需要利用多核。

不适合：

- 大量很小的任务。
- 需要频繁共享状态。
- 需要共享JDBC。
- IO 等待为主的任务。

## 常见错误

### 忘记主入口保护

Windows 上可能无限创建子进程。

### 传不可序列化对象

会报序列化错误。

### 进程数量过多

进程比线程重，过多会导致内存和调度压力。

### 子进程里写同一个文件

多个进程写同一个文件更危险，应统一收集结果后由主进程写。

## 练习

1. 创建一个子进程打印消息。
2. 创建 4 个进程执行 CPU 计算。
3. 给进程设置 `join(timeout=...)`。
4. 观察进程 `exitcode`。
5. 尝试传递不可序列化对象，记录错误。
6. 把直接 `Process` 改为 `ProcessPoolExecutor`。
7. 比较串行和多进程 CPU 计算耗时。

## 验收标准

- 能创建和等待进程。
- 知道 Windows 必须使用主入口保护。
- 能解释进程适合 CPU 密集任务。
- 知道进程参数和返回值需要序列化。
