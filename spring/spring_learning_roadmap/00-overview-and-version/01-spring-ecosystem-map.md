# 01-Spring 体系地图

## 为什么要先看体系地图

Spring 不是单个框架名，而是一组项目的集合。初学者最容易把 Spring Framework、Spring MVC、Spring Boot、Spring Cloud 混成一个东西，结果学到后面会出现两个问题：

- 看到一个注解，不知道它属于哪个层次。
- 项目出问题时，不知道该查 Spring 核心、Boot 自动配置，还是 Web、数据访问、安全模块。

先看体系地图，是为了后续定位问题更快。

## Spring Framework

Spring Framework 是整个 Spring 体系的基础。

它提供的核心能力包括：

- IoC 容器：统一管理对象创建、依赖注入和生命周期。
- AOP：处理日志、事务、权限、监控等横切逻辑。
- 数据访问：统一事务、JDBC、ORM 集成。
- Web：Spring MVC、WebFlux 等 Web 开发能力。
- 测试：让测试可以加载 Spring 容器、Mock Web 请求、管理测试事务。

你后面学到的 `@Component`、`@Bean`、`@Autowired`、`@Transactional`、`@Controller`，本质上都离不开 Spring Framework。

## Spring MVC

Spring MVC 是 Spring Framework 里的 Web MVC 模块。

它负责把 HTTP 请求映射到 Java 方法，再把 Java 对象转换成 HTTP 响应。

常见能力：

- 请求路径映射：`@RequestMapping`、`@GetMapping`、`@PostMapping`。
- 参数绑定：路径参数、查询参数、请求体、请求头。
- JSON 转换：对象和 JSON 之间的序列化、反序列化。
- 异常处理：`@ControllerAdvice`、`@ExceptionHandler`。
- 参数校验：配合 Bean Validation 校验 DTO。

如果你的目标是写后端接口，Spring MVC 是必学主线。

## Spring Boot

Spring Boot 不是替代 Spring Framework，而是帮你更快、更规范地使用 Spring。

它主要解决：

- 依赖组合：Starter 帮你引入一组常用依赖。
- 自动配置：根据 classpath、配置项、已有 Bean 自动创建默认对象。
- 外部化配置：通过配置文件、环境变量、命令行参数调整应用。
- 嵌入式服务器：让 Web 应用可以直接 `java -jar` 启动。
- 运行时能力：Actuator 提供健康检查、指标、应用信息。

简单理解：Spring Framework 提供能力，Spring Boot 负责把这些能力快速组织成一个可运行应用。

## Spring Data

Spring Data 是数据访问项目族。

常见项目：

- Spring Data JPA：面向 JPA/Hibernate 的对象关系映射。
- Spring Data Redis：访问 Redis。
- Spring Data MongoDB：访问 MongoDB。
- Spring Data Elasticsearch：访问 Elasticsearch。

如果你使用 MyBatis，也仍然可以用 Spring Boot 和 Spring 事务。Spring Data 不是所有项目的必选项。

## Spring Security

Spring Security 负责认证和授权。

它解决：

- 用户是谁。
- 用户能访问哪些接口。
- 密码如何加密保存。
- 登录失败、未登录、无权限如何响应。
- Session、JWT、OAuth2/OIDC 如何接入。

安全模块不要等项目做完再补。接口一旦涉及用户和权限，就要尽早设计认证授权边界。

## Spring Cloud

Spring Cloud 是分布式系统工具箱。

它通常解决：

- 服务注册和发现。
- 配置中心。
- 网关路由。
- 服务间调用。
- 熔断、限流、降级。
- 链路追踪和分布式治理。

Spring Cloud 不是初学阶段的第一步。单体项目的分层、事务、测试、日志和部署还不稳时，直接上微服务只会增加复杂度。

## 初学者判断方法

遇到一个知识点时，先问它属于哪一层：

| 问题 | 更可能属于 |
| --- | --- |
| Bean 为什么注入失败 | Spring Framework |
| REST 接口为什么参数绑定失败 | Spring MVC |
| 配置为什么没生效 | Spring Boot |
| SQL 和事务为什么不符合预期 | Spring Framework + 数据访问框架 |
| 登录后为什么还是 401 | Spring Security |
| 服务之间为什么调用失败 | Spring Cloud |

## 本节练习

写一份 `spring-ecosystem-map.md`，用自己的话回答：

1. Spring Framework 和 Spring Boot 的区别是什么？
2. Spring MVC 负责请求链路中的哪一段？
3. Spring Security 解决认证还是授权，还是两者都解决？
4. 为什么不建议一开始就学 Spring Cloud？

## 本节通过标准

- 能用一段话解释 Spring、Spring Boot、Spring Cloud 的关系。
- 能说出 IoC、MVC、Boot 自动配置、安全、Cloud 分别解决什么问题。
- 看到常见注解时，能大致判断它属于哪个模块。
