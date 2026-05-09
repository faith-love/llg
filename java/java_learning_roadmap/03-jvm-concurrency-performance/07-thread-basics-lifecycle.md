# 07-线程基础和线程状态

## 线程是什么

线程是程序执行的基本单位之一。一个 Java 程序启动后，至少有一个主线程执行 `main` 方法。

多线程可以让多个任务并发执行，例如：

- 一个线程处理用户请求。
- 一个线程写日志。
- 一个线程异步发送消息。
- 一个线程执行定时任务。

## 创建线程的方式

### Thread

```java
Thread thread = new Thread(() -> {
    System.out.println("执行任务");
});
thread.start();
```

注意：启动线程用 `start()`，不是直接调用 `run()`。

### Runnable

```java
Runnable task = () -> System.out.println("执行任务");
new Thread(task).start();
```

### Callable

`Callable` 可以返回结果，也可以抛异常。

```java
Callable<Integer> task = () -> 1 + 2;
FutureTask<Integer> futureTask = new FutureTask<>(task);
new Thread(futureTask).start();
System.out.println(futureTask.get());
```

## 线程状态

常见状态：

- NEW：新建。
- RUNNABLE：可运行。
- BLOCKED：等待锁。
- WAITING：无限期等待。
- TIMED_WAITING：限时等待。
- TERMINATED：结束。

## start 和 run 的区别

错误理解：调用 `run()` 就是启动新线程。

实际：

```java
thread.run();
```

只是普通方法调用，仍然在当前线程执行。

正确：

```java
thread.start();
```

JVM 会创建新线程，再由新线程执行 `run()`。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 线程 | 让任务并发执行 | 提高资源利用率，但会带来安全问题 | 任务明确、命名清楚 | 重点是线程不是越多越好 |
| `Thread` | 直接表达一个执行线程 | 简单直观，但不适合大量创建 | 学习实验可用，项目优先线程池 | 难点是区分线程和任务 |
| `Runnable` | 表达无返回任务 | 任务和线程分离 | 常和线程池搭配 | 重点是它只是任务，不负责调度 |
| `Callable` | 表达有返回值任务 | 能拿结果和异常 | 和 `Future`、线程池搭配 | 重点是 `get()` 可能阻塞 |
| 线程状态 | 帮助定位线程卡在哪里 | 看线程 dump 时必须理解 | 重点关注 BLOCKED、WAITING | 难点是 RUNNABLE 不一定正在占用 CPU |

## 本节练习

- 创建一个线程打印当前线程名。
- 分别调用 `run()` 和 `start()`，观察线程名。
- 用 `Callable` 返回计算结果。
- 写一个线程 `sleep`，观察 TIMED_WAITING。

## 本节通过标准

- 能解释线程和任务的区别。
- 能说明 `start()` 和 `run()` 的区别。
- 能说出常见线程状态。
- 知道大量任务不应该直接大量 `new Thread()`。

