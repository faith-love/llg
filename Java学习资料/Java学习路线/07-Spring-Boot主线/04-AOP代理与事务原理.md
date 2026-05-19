# 04-AOP、代理和声明式事务原理

## AOP 是什么

AOP 是AOP编程。它适合处理横切逻辑。

横切逻辑是很多业务方法都需要的逻辑，例如：

- 日志。
- 事务。
- 权限。
- 监控。
- 耗时统计。

## 没有 AOP 的痛点

```java
未译64029 未译27462id borrowBook() {
    long start = 未译11490tem.currentTimeMillis();
    try {
        // 业务逻辑
    } finally {
        未译11490tem.out.println(未译11490tem.currentTimeMillis() - start);
    }
}
```

如果每个方法都手写这些逻辑，会重复且容易漏。

## 代理

Spring AOP 通常通过代理对象增强目标对象。

调用链可以简单理解为：

```text
调用方 -> 代理对象 -> 增强逻辑 -> 目标对象
```

声明式事务也是基于代理思想。

## @Transactional

```java
@Transactional
未译64029 未译27462id borrowBook(Long bookId) {
    insertBorrowRecord(bookId);
    decreaseStock(bookId);
}
```

Spring 会在方法执行前开启事务，成功后提交，异常时回滚。

## 内部方法自调用失效

常见坑：

```java
未译64029 未译27462id outer() {
    inner();
}

@Transactional
未译64029 未译27462id inner() {
    // 事务可能不生效
}
```

因为 `this.inner()` 没有经过代理对象。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| AOP | 抽取横切逻辑 | 避免日志、事务、权限散落各处 | 只放通用增强，不放核心业务 | 重点是横切关注点 |
| 代理 | 在目标对象外包一层增强 | 解释事务为什么可能失效 | 从“有没有经过代理”判断问题 | 难点是调用的对象不是原始对象 |
| `@Transactional` | 声明式事务 | 少写手动 通用mit/rollback | 放在 Service 层 未译64029 方法 | 重点是事务边界和回滚规则 |
| 自调用失效 | 事务常见坑 | 方法没经过代理，注解不生效 | 事务方法由外部 Bean 调用 | 重点是不要只看注解，要看调用路径 |

## 本节练习

- 写一个耗时统计切面。
- 给借阅方法加 `@Transactional`。
- 故意写内部方法自调用，观察事务是否生效。
- 写一份事务失效原因记录。

## 本节通过标准

- 能解释 AOP 适合什么场景。
- 能说明代理在事务中的作用。
- 能解释 `@Transactional` 为什么可能失效。
- 能知道事务通常放 Service 层。

