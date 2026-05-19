# 04-Spring-Boot基础主线

## 阶段目标

Spring Boot 的目标是让 Spring 应用更快进入可运行、可配置、可部署的状态。这个阶段要把自动配置、Starter、配置绑定、Profile、日志、Actuator 串起来。

学完后要能回答：

- Starter 解决了什么问题。
- 自动配置什么时候生效，什么时候不生效。
- 配置文件的加载优先级如何影响运行结果。
- Profile 如何隔离本地、测试、生产环境。
- Actuator 能暴露哪些运行时信息。

## Starter 和依赖管理

Starter 本质上是依赖组合和约定入口。例如：

- `spring-boot-starter-web`：Web MVC、JSON、嵌入式服务器。
- `spring-boot-starter-validation`：参数校验。
- `spring-boot-starter-测试`：测试基础设施。
- `spring-boot-starter-监控端点`：健康检查和监控端点。

学习时不要只复制依赖，要打开依赖树看它引入了什么。

## 自动配置

自动配置的核心问题是：在满足特定条件时，Boot 帮你注册一批默认 Bean。

需要重点理解：

- 条件注解：`@ConditionalOn类`、`@ConditionalOnMissingBean`、`@ConditionalOnProperty`。
- 自动配置类：由 Boot 管理，不是业务代码随意扫描出来的。
- 默认值：没有自定义 Bean 或配置时才启用。
- 覆盖方式：提供自己的 Bean、修改配置项、排除自动配置。

## 外部化配置

必须掌握：

- `application.yml` 和 `application.properties`。
- Profile 文件：`application-dev.yml`、`application-prod.yml`。
- 环境变量覆盖配置。
- 命令行参数覆盖配置。
- `@ConfigurationProperties` 绑定配置。

## 必做练习

- 创建 `dev`、`测试`、`prod` 三套 Profile。
- 配置不同端口、日志级别、JDBC。
- 写一个 `AppProperties` 配置类，绑定业务配置。
- 引入 Actuator，打开 health、info、metrics 端点。
- 排除一个自动配置，观察启动变化。
- 用 `mvn dependency:tree` 或 Gradle dependencies 查看依赖树。

## 验收标准

- 能解释 `@SpringBootApplication` 的三个核心组成。
- 能定位“配置没生效”的原因。
- 能解释自动配置报告里 positive matches 和 negative matches 的含义。
- 能说明为什么不要把生产密码直接写进仓库配置文件。

## 常见误区

- 误区：Boot 默认配置都适合生产。
  纠正：默认配置只帮助快速启动，生产环境要显式设置连接池、日志、安全、监控和资源限制。

- 误区：看到自动配置就不需要理解 Spring。
  纠正：自动配置只是帮你注册 Bean，运行时机制仍然是 Spring。


