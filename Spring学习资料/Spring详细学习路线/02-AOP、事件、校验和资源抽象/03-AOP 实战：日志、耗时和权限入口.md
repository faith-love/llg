# 03-AOP 实战：日志、耗时和权限入口

## 练习目标

这一节通过两个小练习理解 AOP 的实际用法：

- 方法耗时日志。
- 自定义权限注解入口。

重点是理解切面边界，不是做一个完整权限系统。

## 方法耗时日志

先定义注解：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogCost {
}
```

再定义切面：

```java
@Aspect
@Component
public class LogCostAspect {

    @Around("@annotation(LogCost)")
    public Object logCost(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long cost = System.currentTimeMillis() - start;
            System.out.println(joinPoint.getSignature().toShortString() + " cost=" + cost + "ms");
        }
    }
}
```

使用：

```java
@LogCost
public void createUser() {
}
```

这种方式比按包路径匹配更明确，因为只有标了注解的方法才会记录。

## 操作审计日志

可以定义：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditLog {
    String action();
}
```

使用：

```java
@AuditLog(action = "创建用户")
public void createUser() {
}
```

切面里读取注解参数，记录当前用户、操作类型、方法名、请求参数、执行结果。

初学阶段先打印日志，不要急着写数据库。

## 自定义权限入口

定义注解：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String value();
}
```

使用：

```java
@RequirePermission("book:create")
public void createBook() {
}
```

切面里可以先模拟当前用户权限：

```java
Set<String> permissions = Set.of("book:read");
```

如果缺少权限，就抛出业务异常。

注意：这只是为了理解 AOP 权限入口。真实项目里应优先学习 Spring Security 的认证授权体系。

## 切面里不要做什么

不建议：

- 写大量业务判断。
- 直接吞掉异常。
- 随意修改方法参数。
- 返回和目标方法声明不一致的对象。
- 在切面里访问太多数据库。
- 把关键业务流程藏进注解。

切面应该薄，职责要明确。

## 本节练习

1. 创建 `@LogCost`，统计方法耗时。
2. 创建 `@AuditLog`，打印操作名称。
3. 创建 `@RequirePermission`，模拟权限校验。
4. 给 3 个 Service 方法分别加这些注解。
5. 故意让权限不足，观察异常是否清晰。

## 本节通过标准

- 能通过自定义注解精确触发切面。
- 能在切面里读取方法签名和注解参数。
- 能理解权限切面只是入口，完整安全体系要交给 Spring Security。
- 能说出切面里不该塞复杂业务逻辑的原因。


