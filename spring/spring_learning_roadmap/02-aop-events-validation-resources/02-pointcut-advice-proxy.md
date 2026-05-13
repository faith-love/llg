# 02-切点、通知和代理机制

## 切点是什么

切点负责回答：哪些方法需要被增强。

常见写法：

```java
@Pointcut("execution(* com.example.demo.service..*(..))")
public void serviceMethods() {
}
```

含义：匹配 `com.example.demo.service` 包及子包下的方法。

初学时先会读常见表达式，不需要一开始背所有 Pointcut 语法。

## 通知是什么

通知负责回答：增强逻辑什么时候执行。

常见通知：

- `@Before`：方法执行前。
- `@After`：方法结束后，无论成功还是异常。
- `@AfterReturning`：方法成功返回后。
- `@AfterThrowing`：方法抛出异常后。
- `@Around`：包住整个方法调用，最灵活，也最容易误用。

耗时统计通常使用 `@Around`，因为要在方法执行前后都插入逻辑。

## 环绕通知示例

```java
@Aspect
@Component
public class CostLogAspect {

    @Around("execution(* com.example.demo.service..*(..))")
    public Object logCost(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long cost = System.currentTimeMillis() - start;
            System.out.println(joinPoint.getSignature() + " cost=" + cost + "ms");
        }
    }
}
```

关键点：

- `joinPoint.proceed()` 才是真正执行目标方法。
- 忘记调用 `proceed()`，目标方法不会执行。
- 不要吞掉异常，否则调用方会误以为业务成功。

## 代理机制

Spring AOP 主要通过代理对象生效。

调用链可以理解成：

```text
调用方 -> 代理对象 -> 切面逻辑 -> 目标对象方法
```

如果调用没有经过代理对象，切面就不会生效。

## JDK 动态代理和 CGLIB

常见代理方式：

- JDK 动态代理：基于接口创建代理。
- CGLIB：基于子类创建代理。

日常开发不需要手动选择太多，但要知道代理对象可能不是原始类本身。

这会影响：

- 类型判断。
- final 类和 final 方法。
- 同类内部方法调用。

## 同类内部调用为什么容易失效

示例：

```java
@Service
public class OrderService {

    public void outer() {
        inner();
    }

    @LogCost
    public void inner() {
    }
}
```

`outer()` 里直接调用 `inner()`，本质是 `this.inner()`，没有经过 Spring 代理对象，因此 `inner()` 上的切面可能不会生效。

这也是事务失效的常见原因之一。

## 本节练习

1. 写一个 `@Around` 耗时切面。
2. 在 `UserService` 方法上触发切面。
3. 故意删掉 `proceed()`，观察业务方法是否执行。
4. 写一个同类内部调用示例，观察切面是否生效。
5. 打印 Bean 的运行时 class，观察是否为代理类。

## 本节通过标准

- 能说清切点和通知分别负责什么。
- 能解释 `@Around` 中 `proceed()` 的作用。
- 能说明 Spring AOP 为什么依赖代理。
- 能解释同类内部调用为什么可能绕过 AOP。
