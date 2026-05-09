# 00-阶段导读：Spring Boot 主线

## 这一阶段解决什么问题

前面你已经学习了 Java、数据库、HTTP 和 Web 分层。Spring Boot 阶段要把这些能力组合成真实后端项目。

Spring Boot 的价值不是“少写代码”这么简单，它解决的是：

- 对象创建和依赖装配。
- Web 请求处理。
- 数据库访问整合。
- 事务、校验、异常、配置、日志、测试等工程能力。
- 常见中间件快速接入。

数据访问的细节请先阅读 [04-数据库基础](../04-database-foundation.md) 和 [05-MyBatis 与 MyBatis-Plus](../05-mybatis-and-plus.md)。本章只关注 Spring Boot 如何整合这些能力。

## 版本基线

当前官方 Spring Boot System Requirements 显示：Spring Boot 4.0.6 requires at least Java 17 and is compatible up to and including Java 26。

学习建议：

- 新学习主线使用 Java 17+。
- 如果你使用 Spring Boot 3.x 或 4.x，不要再用 Java 8。
- 教程版本、JDK 版本、Spring Boot 版本、Maven/Gradle 版本必须匹配。

官方入口：<https://docs.spring.io/spring-boot/system-requirements.html>

## 推荐学习顺序

1. [阶段目标和版本基线](01-stage-goal-version-baseline.md)
2. [Spring 容器：IoC、DI 和 Bean](02-ioc-di-bean.md)
3. [注解配置和 Bean 生命周期](03-annotations-bean-lifecycle.md)
4. [AOP、代理和声明式事务原理](04-aop-proxy-transaction-principle.md)
5. [Spring Boot 自动配置、Starter、配置文件和 Profile](05-autoconfiguration-starter-profile.md)
6. [Spring MVC：Controller、参数绑定、异常处理和拦截器](06-spring-mvc.md)
7. [数据访问、MyBatis、JPA 了解和事务管理](07-data-access-transaction.md)
8. [参数校验、统一响应和统一异常](08-validation-response-exception.md)
9. [安全：登录、JWT、RBAC 和常见风险](09-security-login-jwt-rbac.md)
10. [缓存：Redis、缓存模式和缓存风险](10-cache-redis-patterns.md)
11. [消息队列、任务调度和异步处理](11-mq-scheduler-async.md)
12. [监控、日志、Actuator 和健康检查](12-observability-actuator-logging.md)
13. [测试：单元测试、Web 测试和集成测试](13-testing.md)
14. [推荐项目结构和必做功能](14-project-structure-required-features.md)
15. [如何使用现有 spring-boot-demo](15-use-existing-spring-boot-demo.md)
16. [难点错误示例和避坑指南](16-pitfall-guide.md)
17. [通过标准和复盘清单](17-checkpoints.md)

## 小白先记住的主线

- Bean 是容器管理的对象，不是随手 `new` 出来的对象。
- 依赖注入解决对象之间怎么组装的问题。
- AOP 适合事务、日志、权限、监控等横切逻辑。
- 自动配置不是魔法，本质是条件装配和默认配置。
- 事务、校验、异常、测试这些工程能力比单纯 CRUD 更重要。
