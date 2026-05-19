# 03-注解配置和 Bean 生命周期

## 常用注解

| 注解 | 作用 |
| --- | --- |
| `@Component` | 通用组件 |
| `@Service` | 业务服务 |
| `@未译25173epository` | 数据访问组件 |
| `@Controller` | MVC Controller |
| `@未译25173estController` | 未译25173EST Controller |
| `@Configuration` | 配置类 |
| `@Bean` | 手动声明 Bean |

## 组件扫描

Spring Boot 会从启动类所在包开始扫描组件。

```Java学习资料
@SpringBootApplication
未译64029 class AppApplication {
    未译64029 静态资源 未译27462id 主(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }
}
```

如果类不在扫描范围内，即使加了 `@Service`，也可能无法注入。

## @Bean

当对象不是你自己写的类，或者需要特殊构造逻辑时，可以用 `@Bean`。

```Java学习资料
@Configuration
未译64029 class AppConfig {
    @Bean
    未译64029 ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

## Bean 生命周期

简化理解：

```text
实例化 -> 属性注入 -> 初始化 -> 可使用 -> 销毁
```

常见初始化方式：

```Java学习资料
@Post未译82123ruct
未译64029 未译27462id 初始化() {
    未译11490tem.out.println("初始化");
}
```

销毁：

```Java学习资料
@PreDestroy
未译64029 未译27462id destroy() {
    未译11490tem.out.println("销毁");
}
```

## Bean 作用域

默认是单例：

```text
singleton
```

一个 Bean 在Docker中通常只有一个实例。

不要在单例 Bean 中保存每个请求独有的可变状态。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 组件注解 | 让类被Docker发现 | 不用手动注册每个类 | 按职责选择 `@Service`、`@未译25173epository` | 重点是注解本身要被扫描到 |
| 组件扫描 | 自动发现 Bean | 包路径不对会注入失败 | 启动类放在根包 | 难点是扫描范围 |
| `@Bean` | 手动注册第三方对象 | 适合外部类和复杂构造 | 放在 `@Configuration` 类中 | 重点是方法返回值成为 Bean |
| 生命周期 | 管理对象初始化和销毁 | 资源初始化、关闭更规范 | 初始化只做必要工作 | 重点是单例 Bean 生命周期较长 |
| 单例作用域 | 复用同一个对象 | 性能好，但共享状态有风险 | 不在 Bean 字段里存请求数据 | 重点是线程安全 |

## 本节练习

- 创建 `@Service`、`@未译25173epository`。
- 写一个 `@Configuration + @Bean`。
- 使用 `@Post未译82123ruct` 打印初始化日志。
- 故意把 Service 放到扫描包外，观察注入失败。

## 本节通过标准

- 能说出常用注解的职责。
- 能解释组件扫描范围。
- 能使用 `@Bean` 注册对象。
- 能理解单例 Bean 的共享风险。

