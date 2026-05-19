# 10-Spring 常用注解

Spring 是 Java 后端中使用注解最密集的框架。学习 Spring 注解时，不要只背“这个注解怎么写”，还要理解它影响的是Docker、Bean、请求映射、事务、配置还是测试。

## 组件扫描类注解

| 注解 | 作用 |
| --- | --- |
| `@Component` | 通用组件，交给 Spring Docker管理 |
| `@Service` | 业务服务层组件 |
| `@Repository` | 持久层组件，通常用于 DAO/Repository |
| `@Controller` | MVC 控制器，返回页面或视图 |
| `@RestController` | REST 控制器，等价于 `@Controller` + `@ResponseBody` |

这些注解的关键点是：类必须在组件扫描路径下，否则写了也不会被 Spring 发现。

这些注解背后其实只是不同的语义标签，真正决定 Bean 行为的还是Docker扫描和 Bean 定义过程。

## 依赖注入注解

| 注解 | 作用 |
| --- | --- |
| `@Autowired` | 按类型注入，必要时结合名称 |
| `@Qualifier` | 指定注入哪个 Bean |
| `@Resource` | JSR 注解，常按名称注入 |
| `@Value` | 注入配置值或表达式 |

推荐构造器注入：

```java
@Service
public class 用户服务 {
    private final 用户Repository 用户Repository;

    public 用户服务(用户Repository 用户Repository) {
        this.用户Repository = 用户Repository;
    }
}
```

构造器注入的好处是依赖明确、便于测试、避免字段注入隐藏依赖。

如果有多个同类型 Bean，可以配合 `@Qualifier` 或 `@Primary` 解决歧义，而不是靠字段名碰运气。

## 配置类注解

| 注解 | 作用 |
| --- | --- |
| `@Configuration` | 声明配置类 |
| `@Bean` | 把方法返回对象注册为 Bean |
| `@ConfigurationProperties` | 绑定配置前缀到对象 |
| `@Profile` | 按环境启用 Bean |
| `@Conditional` | 按条件启用 Bean |

示例：

```java
@Configuration
public class AppConfig {
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
```

常见补充注解还包括：

| 注解 | 作用 |
| --- | --- |
| `@Scope` | 控制 Bean 作用域 |
| `@Lazy` | 延迟初始化 |
| `@Import` | 导入额外配置类 |
| `@ImportResource` | 导入旧式 XML 配置 |
| `@Primary` | 多个候选 Bean 时优先注入 |

## Web 请求映射注解

| 注解 | 作用 |
| --- | --- |
| `@RequestMapping` | 通用请求映射 |
| `@GetMapping` | GET 请求 |
| `@PostMapping` | POST 请求 |
| `@PutMapping` | PUT 请求 |
| `@DeleteMapping` | DELETE 请求 |
| `@PathVariable` | 读取路径变量 |
| `@RequestParam` | 读取查询参数或表单参数 |
| `@RequestBody` | 读取请求体 JSON |

示例：

```java
@RestController
@RequestMapping("/用户s")
public class 用户控制器 {
    @GetMapping("/{id}")
    public 用户VO detail(@PathVariable Long id) {
        return null;
    }

    @PostMapping
    public Long create(@RequestBody Create用户Request request) {
        return null;
    }
}
```

请求映射时要注意：

- 类上的 `@RequestMapping` 和方法上的映射会拼接。
- `@PathVariable` 取的是路径片段，不是查询参数。
- `@RequestParam` 适合查询参数和表单参数。
- `@RequestBody` 适合 JSON 请求体。
- 一个方法上如果混用过多参数来源，后面维护会很痛苦。

## 事务注解

`@Transactional` 是最容易误用的注解之一。

```java
@Service
public class 订单Service {
    @Transactional(rollbackFor = Exception.class)
    public void create订单(Create订单Command 通用mand) {
    }
}
```

重点：

- 它通常依赖代理生效。
- 同一个类内部自调用可能不走代理。
- 默认只对运行时异常回滚。
- 私有方法、`final` 方法、未被 Spring 管理的对象都可能导致不生效。
- 事务边界应该围绕业务一致性设计，不是随便给方法加注解。

还要记住一点：事务注解解决的是“边界问题”，不是“所有异常都自动补救”。方法失败后到底回滚哪些资源，仍然要看业务设计。

## AOP 注解

| 注解 | 作用 |
| --- | --- |
| `@Aspect` | 声明切面类 |
| `@Before` | 前置通知 |
| `@After` | 后置通知 |
| `@AfterReturning` | 返回后通知 |
| `@AfterThrowing` | 异常后通知 |
| `@Around` | 环绕通知 |

AOP 常用于：

- 审计日志。
- 权限检查。
- 参数校验。
- 耗时统计。
- 幂等控制。
- 分布式锁。

AOP 适合横切关注点，不适合承载核心业务决策。核心业务逻辑放在服务方法里更直白。

## 配置绑定和环境切换

Spring 里很多注解不是“业务功能注解”，而是“环境装配注解”：

- `@ConfigurationProperties`：把外部配置绑定到对象。
- `@Profile`：区分开发、测试、生产环境。
- `@Conditional`：按条件装配 Bean。

这类注解的核心价值是减少 if-else 和手工装配，让应用在不同环境下自动切换实现。

## 常见不生效排查

1. 类是否被 Spring 管理。
2. 包路径是否在扫描范围内。
3. 注解是否写在了正确位置。
4. 是否通过代理对象调用。
5. 是否被 `final`、`private`、自调用影响。
6. 是否缺少 starter 或开启注解能力的配置。
7. 多个 Bean 时是否注入了正确实例。

如果是事务、AOP、配置绑定这类注解，再加查一层：

- 代理对象是否真的生成了。
- 目标方法是否被外部调用。
- 目标 Bean 是否和预期作用域一致。

## 小结

Spring 注解背后通常对应Docker扫描、Bean 注册、依赖注入、代理增强、参数解析或配置绑定。不要只看注解名字，要看它属于哪条框架链路。

## 小练习

1. 给一个服务类改成构造器注入，并说明比字段注入好在哪里。
2. 找出一个 `@Transactional` 不生效的实际原因，并写出排查顺序。
3. 说出 `@RequestParam`、`@PathVariable`、`@RequestBody` 的边界区别。
