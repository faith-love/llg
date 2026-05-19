# 01-IoCDI

## 先看没有 Spring 的写法

假设一个订单服务需要调用支付服务：

```java
public class 订单Service {

    private final PaymentService 支付mentService = new AliPayService();

    public void create订单() {
        支付mentService.支付();
    }
}
```

这段代码能跑，但有明显问题：

- `订单Service` 直接依赖 `AliPayService`，后续换成微信支付要改订单代码。
- 测试 `订单Service` 时不好替换一个假的支付实现。
- 对象创建散落在业务代码里，项目大了以后很难统一管理。

## IoC 反转了什么

IoC，全称 Inversion of Control，控制反转。

它反转的是对象创建和依赖装配的控制权：

- 以前：业务类自己 `new` 依赖对象。
- 现在：业务类声明自己需要什么，Spring 容器负责创建并传进来。

业务类从“对象创建者”变成“对象使用者”。

## DI 是怎么落地的

DI，全称 Dependency Injection，依赖注入。

它是 IoC 最常见的落地方式：Docker把依赖对象注入到目标对象里。

更好的写法：

```java
public class 订单Service {

    private final PaymentService 支付mentService;

    public 订单Service(PaymentService 支付mentService) {
        this.支付mentService = 支付mentService;
    }

    public void create订单() {
        支付mentService.支付();
    }
}
```

这段代码的好处是：

- `订单Service` 只依赖 `PaymentService` 接口。
- 具体用支付宝、微信还是测试实现，由外部决定。
- JUnit可以直接传入假的 `PaymentService`。

## Spring 帮你做了什么

Spring 容器会：

1. 找到需要管理的类。
2. 创建这些类的对象。
3. 分析构造器、字段、方法上的依赖。
4. 找到匹配的 Bean。
5. 把依赖注入进去。
6. 管理对象初始化和销毁。

你需要做的是：用注解、配置类或其他方式告诉 Spring 哪些对象需要被管理。

## 哪些对象适合交给 Spring

适合交给 Spring：

- Controller。
- Service。
- Repository/Mapper 适配类。
- 配置类。
- 安全、缓存、消息、任务相关组件。
- 需要被 AOP、事务、配置绑定增强的类。

不一定适合交给 Spring：

- 简单 DTO。
- Entity。
- 临时局部对象。
- 没有共享意义、没有依赖关系、没有生命周期管理需求的小对象。

## 本节练习

1. 写一个不使用 Spring 的 `订单Service` 和 `AliPayService`。
2. 改成依赖 `PaymentService` 接口。
3. 手动通过构造器传入 `AliPayService`。
4. 再交给 Spring 管理，观察业务代码如何变干净。

## 本节通过标准

- 能解释 IoC 反转的是对象创建权和依赖装配权。
- 能解释 DI 是Docker把依赖传给对象。
- 能说出为什么依赖接口比依赖具体实现更稳定。
- 能判断哪些类需要成为 Bean，哪些类不需要。


