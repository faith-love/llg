# 02-容器、BeanDefinition 和 ApplicationContext

## 容器是什么

Spring 容器可以理解为一个对象管理中心。它不是简单的 Map，而是负责 Bean 定义、创建、依赖注入、生命周期回调、后置处理和事件发布的一整套机制。

常见容器接口：

- `BeanFactory`：最基础的 Bean 工厂。
- `ApplicationContext`：更常用的应用上下文，扩展了事件、资源、国际化、环境等能力。

日常 Spring Boot 项目里，你主要接触的是 `ApplicationContext`。

## BeanDefinition 是什么

BeanDefinition 是 Bean 的“设计图”。

它描述：

- Bean 的 class。
- Bean 名称。
- 作用域。
- 构造参数。
- 属性依赖。
- 初始化和销毁方法。
- 是否懒加载。
- 是否 primary。

Spring 通常不是一上来就直接创建所有对象，而是先收集 BeanDefinition，再根据这些定义创建 Bean。

## Bean 和普通对象的区别

普通对象：

```java
UserService userService = new UserService();
```

Bean：

- 由 Spring 容器创建。
- 可以被依赖注入。
- 可以参与生命周期回调。
- 可以被 AOP 代理。
- 可以被配置、条件、Profile 控制。

Bean 本质上仍然是 Java 对象，但它被纳入了 Spring 容器管理。

## Bean 名称

Spring 中每个 Bean 都有名称。

默认规则：

- `UserService` 类注册为 Bean 时，默认名称通常是 `userService`。
- `@Bean` 方法名通常就是 Bean 名称。

例如：

```java
@Service
public class UserService {
}
```

默认 Bean 名称是：

```text
userService
```

配置类：

```java
@Bean
public ObjectMapper objectMapper() {
    return new ObjectMapper();
}
```

默认 Bean 名称是：

```text
objectMapper
```

## ApplicationContext 能做什么

除了获取 Bean，ApplicationContext 还提供：

- 读取资源：classpath、文件、URL。
- 读取环境变量和配置。
- 发布和监听事件。
- 国际化消息。
- 管理父子上下文。

初学时不要频繁在业务代码里直接 `getBean`。如果一个类需要依赖，优先通过构造器注入。

## 本节练习

写一个启动后打印所有 Bean 名称的小例子：

```java
@Component
public class BeanPrinter implements ApplicationRunner {

    private final ApplicationContext applicationContext;

    public BeanPrinter(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (String name : applicationContext.getBeanDefinitionNames()) {
            System.out.println(name);
        }
    }
}
```

观察：

- 你自己写的 Bean 名称。
- Spring Boot 自动配置创建的 Bean。
- Controller、Service 是否都在列表里。

## 本节通过标准

- 能解释 BeanDefinition 是 Bean 的定义信息。
- 能说明 ApplicationContext 比 BeanFactory 多了哪些常用能力。
- 能说出默认 Bean 名称规则。
- 能明白 Bean 是被容器管理的 Java 对象，不是特殊语法。
