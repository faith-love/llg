# 07-阶段练习和通过标准

## 阶段练习项目

创建练习项目：

```text
D:\learn\spring\practice\spring-ioc-practice
```

项目目标：通过支付场景练习 IoC、DI、多实现注入、Bean 注册、生命周期和错误排查。

## 练习一：支付接口多实现

创建接口：

```java
public interface PaymentService {
    String channel();

    void pay(long orderId, int amount);
}
```

创建两个实现：

- `AliPayService`
- `WechatPayService`

要求：

- 两个实现都注册为 Spring Bean。
- `OrderService` 使用构造器注入。
- 分别用 `@Qualifier` 和 `@Primary` 解决多实现冲突。
- 再尝试注入 `List<PaymentService>` 打印全部支付渠道。

## 练习二：第三方 Client 注册

模拟一个第三方 SDK：

```java
public class SmsClient {

    private final String endpoint;

    public SmsClient(String endpoint) {
        this.endpoint = endpoint;
    }
}
```

要求：

- 用 `@Configuration` + `@Bean` 注册。
- endpoint 从配置文件读取。
- 在 `NotifyService` 中通过构造器注入。

## 练习三：生命周期日志

创建 `LifecycleLogger`：

- 构造方法打印日志。
- `@PostConstruct` 打印初始化日志。
- `@PreDestroy` 打印销毁日志。
- 写一个 `BeanPostProcessor` 打印初始化前后日志。

观察启动和关闭顺序。

## 练习四：错误排查

故意制造：

- 找不到 Bean。
- 多个 Bean 冲突。
- 循环依赖。
- 配置类不在扫描范围内。

每个错误都要保留截图或日志片段，并写入 `ioc-error-notes.md`。

## 阶段自测问题

进入下一阶段前，回答：

1. IoC 反转的是什么？
2. DI 和 IoC 是什么关系？
3. 为什么构造器注入优先？
4. `@Component` 和 `@Bean` 分别适合什么场景？
5. Spring Boot 默认扫描范围是什么？
6. BeanDefinition 里通常包含哪些信息？
7. singleton 作用域是否等于 JVM 全局唯一？
8. Bean 生命周期中 BeanPostProcessor 大致在什么时候执行？
9. 多实现注入冲突怎么解决？
10. 循环依赖应该优先怎么处理？

## 阶段通过标准

能做到下面这些，就可以进入 02 阶段：

- 能独立写一个多实现接口注入示例。
- 能用构造器注入组织 Controller、Service、Client。
- 能用 `@Bean` 注册第三方对象。
- 能解释 Bean 注册和组件扫描范围。
- 能说出 Bean 生命周期主线。
- 能排查至少 4 类常见注入错误。
- 能把错误记录整理成可复用笔记。
