# 00-阶段导读：JVM、并发和性能基础

## 这一阶段解决什么问题

前面你已经能写 Java 小项目。接下来要理解这些问题：

- Java 代码为什么能运行？
- 对象创建后放在哪里？
- 为什么会内存溢出？
- 为什么多个线程同时改一个变量会出错？
- 为什么不能随便 `new Thread()`？
- 程序变慢时，应该先看什么数据？

## 推荐学习顺序

1. [阶段目标](01-stage-goal.md)
2. [编译、字节码和类加载](02-compile-bytecode-classloading.md)
3. [JVM 运行时内存区域](03-runtime-memory-areas.md)
4. [对象创建和生命周期](04-object-creation-lifecycle.md)
5. [GC 基础和垃圾收集器](05-gc-basics-collectors.md)
6. [JVM 参数、工具和 OOM 实验](06-jvm-tools-oom-experiments.md)
7. [线程基础和线程状态](07-thread-basics-lifecycle.md)
8. [线程安全和 Java 内存模型](08-thread-safety-jmm.md)
9. [锁：synchronized、ReentrantLock 和读写锁](09-locks.md)
10. [原子类和并发集合](10-atomic-concurrent-collections.md)
11. [线程池](11-thread-pools.md)
12. [CompletableFuture 和虚拟线程](12-completablefuture-virtual-threads.md)
13. [性能指标和排查流程](13-performance-troubleshooting.md)
14. [阶段练习](14-practices.md)
15. [难点错误示例和避坑指南](15-pitfall-guide.md)
16. [通过标准和复盘清单](16-checkpoints.md)

## 小白先记住的主线

- JVM 负责运行 Java 字节码。
- 堆主要放对象，栈主要放方法调用。
- GC 负责回收不再使用的对象。
- 并发问题本质上常见于共享可变数据。
- 线程池是为了控制线程数量和任务排队，不是为了让任务无限变快。
- 性能优化必须先测量，再判断，再修改。

## 本阶段产出

完成后应该有：

- 递归触发 `StackOverflowError` 的实验记录。
- 小堆触发 `OutOfMemoryError` 的实验记录。
- 一份 GC 日志观察笔记。
- 多线程售票的错误版和修复版。
- 一个自定义线程池练习。
- 一个 `CompletableFuture` 并发调用练习。
- 一份性能排查流程笔记。

