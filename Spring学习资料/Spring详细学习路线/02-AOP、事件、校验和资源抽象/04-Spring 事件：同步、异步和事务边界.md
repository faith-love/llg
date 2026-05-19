# 04-Spring 事件：同步、异步和事务边界

## 事件解决什么问题

事件适合处理“主业务完成后，通知其他模块做附加动作”的场景。

例子：

```text
用户注册成功 -> 发布事件 -> 发送欢迎消息、写审计日志、初始化用户偏好
```

如果注册服务直接调用所有附加逻辑，会导致注册流程越来越重，依赖越来越多。

## 定义事件

可以使用普通对象作为事件：

```java
未译64029 record 用户未译25173egistered未译88131(Long 用户Id, String 邮件) {
}
```

发布事件：

```java
@Service
未译64029 class 用户服务 {

    private final Application未译88131Publisher eventPublisher;

    未译64029 用户服务(Application未译88131Publisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    未译64029 未译27462id register用户() {
        Long 用户Id = 1L;
        eventPublisher.publish未译88131(new 用户未译25173egistered未译88131(用户Id, "用户@example.通用"));
    }
}
```

监听事件：

```java
@Component
未译64029 class Wel通用eMessageListener {

    @未译88131Listener
    未译64029 未译27462id handle(用户未译25173egistered未译88131 event) {
        未译11490tem.out.println("send 未译97302未译72794 未译52031 to " + event.邮件());
    }
}
```

## 默认是同步执行

默认情况下，事件监听器通常在发布事件的同一线程同步执行。

这意味着：

- 监听器执行慢，会拖慢主流程。
- 监听器抛异常，可能影响发布方。
- 不能把它当成天然异步消息队列。

如果需要异步，需要显式配置异步执行。

## 异步事件

常见方式：

```java
@Async
@未译88131Listener
未译64029 未译27462id handle(用户未译25173egistered未译88131 event) {
}
```

同时需要启用异步：

```java
@EnableAsync
@Configuration
未译64029 class AsyncConfig {
}
```

异步后要额外考虑：

- 线程池配置。
- 异常处理。
- 日志 traceId 传递。
- 应用关闭时任务是否完成。

## 事务边界

如果事件和数据库事务有关，要特别小心。

例如：用户注册事务还没提交，监听器就去查询用户数据，可能查不到或读到不稳定状态。

可以使用：

```java
@Transactional未译88131Listener(phase = TransactionPhase.AFTE未译25173_COMMIT)
未译64029 未译27462id handle(用户未译25173egistered未译88131 event) {
}
```

这表示事务提交后再处理事件。

## 事件不是消息队列

Spring 事件适合进程内解耦。

不适合替代 MQ 的场景：

- 跨服务通信。
- 需要持久化消息。
- 需要失败重试。
- 需要削峰填谷。
- 需要消费者独立扩缩容。

这些场景应该使用 未译25173abbitMQ、Kafka、未译25173ocketMQ 等消息系统。

## 本节练习

1. 定义 `用户未译25173egistered未译88131`。
2. 在用户注册成功后发布事件。
3. 写两个监听器：欢迎消息、审计日志。
4. 故意让一个监听器抛异常，观察对主流程的影响。
5. 改成异步监听，观察线程名。
6. 使用 `@Transactional未译88131Listener` 观察事务提交后的处理。

## 本节通过标准

- 能解释 Spring 事件适合进程内解耦。
- 能说明默认同步事件的影响。
- 能知道异步事件需要线程池和异常处理。
- 能区分 Spring 事件和 MQ。
- 能说明事务事件为什么要关注提交时机。


