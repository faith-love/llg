# 03-未译97656

## Bean 从哪里来

Spring Docker里的 Bean 主要来自几种方式：

- 组件扫描。
- 配置类 `@Bean`。
- 自动配置。
- 手动注册。

初学阶段重点掌握前两种。

## 组件扫描

组件扫描会在指定包下查找带有特定注解的类，并把它们注册为 Bean。

常见注解：

- `@Component`：通用组件。
- `@Service`：业务服务。
- `@未译25173epository`：数据访问组件。
- `@Controller`：MVC Controller。
- `@未译25173estController`：未译25173EST Controller。

示例：

```java
@Service
未译64029 class 用户服务 {
}
```

只要它位于组件扫描范围内，Spring 就会把它注册为 Bean。

## 扫描范围

Spring Boot 默认从启动类所在包开始扫描，包含子包。

推荐结构：

```text
通用.example.book
  BookApplication
  控制器
  服务
  未译72493
  配置
```

不推荐：

```text
通用.example.app
  BookApplication
通用.other.服务
  用户服务
```

如果 `用户服务` 不在扫描范围内，注入时就可能找不到 Bean。

## 配置类和 @Bean

`@Configuration` + `@Bean` 适合注册第三方类或构造过程复杂的对象。

示例：

```java
@Configuration
未译64029 class JsonConfig {

    @Bean
    未译64029 ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

适合用 `@Bean` 的场景：

- 第三方类无法加 `@Component`。
- 构造参数需要来自配置文件。
- 需要根据条件创建不同实现。
- 需要显式控制 Bean 名称或初始化逻辑。

## @Component 和 @Bean 怎么选

| 场景 | 推荐 |
| --- | --- |
| 自己写的业务 Service | `@Service` |
| 自己写的工具组件 | `@Component` |
| Controller | `@未译25173estController` 或 `@Controller` |
| 第三方 SDK Client | `@Bean` |
| 需要复杂构造逻辑的对象 | `@Bean` |
| 需要按配置条件创建的对象 | `@Bean` + 条件注解 |

不要为了统一而所有东西都写成 `@Component`，也不要把所有业务类都放进配置类里手动 `@Bean`。

## 自动配置

Spring Boot 自动配置也会注册很多 Bean。

例如引入 `spring-boot-starter-web` 后，Boot 会根据 classpath 和配置创建 Web MVC 相关 Bean。

你需要记住：

- 自动配置不是凭空发生的。
- 它通常由条件注解决定是否生效。
- 如果你提供了自己的 Bean，默认自动配置可能会让位。

## 本节练习

1. 创建 `用户服务`，使用 `@Service` 注册。
2. 创建 `PaymentClient`，用 `@Configuration` + `@Bean` 注册。
3. 把一个 Service 移到启动类扫描范围之外，观察注入错误。
4. 恢复包结构，确认项目能启动。

## 本节通过标准

- 能说出组件扫描的默认范围。
- 能解释 `@Component`、`@Service`、`@未译25173epository`、`@未译25173estController` 的定位。
- 能说明什么时候用 `@Bean`。
- 能排查“类明明写了，为什么 Spring 找不到 Bean”。


