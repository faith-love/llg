# Spring 详细学习路线

这份路线面向 Java 后端开发方向，目标是从 Spring Framework 核心概念走到能独立开发、测试、部署 Spring Boot 后端项目，并能理解常见企业项目里的安全、事务、缓存、消息、监控和微服务协作。

## 版本基线

截至 2026-05-13，官方文档显示 Spring Boot 4.0.6、3.5.14、3.4.13、3.3.13 为稳定版本；Spring Framework 7.0.7 和 6.2.18 为稳定版本。

新学习主线建议：

- JDK：优先使用 JDK 25 LTS；如果公司或教程使用 JDK 17/21，也可以先保持一致。
- Spring Framework：以 7.0.x 为主线，同时知道 6.2.x 仍常见于 Spring Boot 3.x 项目。
- Spring Boot：新项目主线使用 4.0.x；如果学习资料或企业项目仍在 3.x，先用 3.5.x 过渡。
- 构建工具：Maven 3.6.3+ 或 Gradle 8.14+/9.x。
- Web 容器：Spring Boot 4 使用 Jakarta/Servlet 6.1 体系，旧项目从 `javax.*` 迁移时要特别注意包名变化。

## 学习路线总表

| 阶段 | 主题 | 推荐周期 | 阶段产出 |
| --- | --- | ---: | --- |
| 0 | 总览、版本和学习方法 | 2-3 天 | 能解释 Spring、Spring Boot、Spring Cloud 的边界 |
| 1 | IoC、DI 和 Bean 生命周期 | 1 周 | 手写一个基于注解配置的小型容器示例 |
| 2 | AOP、事件、校验和资源抽象 | 1 周 | 完成日志切面、参数校验、事件发布示例 |
| 3 | Spring MVC 和 REST API | 1-2 周 | 完成 CRUD API、统一响应、异常处理、参数校验 |
| 4 | Spring Boot 基础主线 | 2 周 | 能从零搭建 Boot 项目并解释自动配置 |
| 5 | 数据访问和事务 | 2 周 | 完成数据库 CRUD、分页、事务边界和回滚实验 |
| 6 | Spring Security 和认证授权 | 2 周 | 完成登录、JWT/Session、角色权限和接口保护 |
| 7 | 缓存、消息、任务和集成能力 | 2-3 周 | 完成 Redis 缓存、MQ 消费、定时任务、文件/邮件示例 |
| 8 | 测试、可观测性和部署 | 2 周 | 完成单测、集成测试、Actuator、日志、Docker 部署 |
| 9 | Spring Cloud 和分布式基础 | 3-4 周 | 完成服务注册、配置、网关、OpenFeign、限流熔断示例 |
| 10 | 项目实战、面试复盘和长期提升 | 长期 | 一个可演示项目、一份架构复盘和错题清单 |

## 学习原则

- 先理解 Spring Framework，再理解 Spring Boot。Boot 是工程化入口，不是魔法本身。
- 每个注解都要能回答三个问题：谁解析它、什么时候生效、默认值是什么。
- 配置项要能追到源码或官方文档，不要只背 `application.yml` 片段。
- 事务、安全、缓存、消息都要做失败实验。只看成功路径很难真正掌握框架。
- 项目结构要长期稳定：Controller 只处理协议，Service 处理业务，Repository/Mapper 处理数据访问。
- 不要一开始就堆 Spring Cloud。单体项目的分层、事务、测试和部署先做到稳定。

## 文档导航

- [00-总览、版本和学习方法](00-overview-and-version.md)
- [01-IoC、DI 和 Bean 生命周期](01-ioc-di-bean-lifecycle.md)
- [02-AOP、事件、校验和资源抽象](02-aop-events-validation-resources.md)
- [03-Spring MVC 和 REST API](03-spring-mvc-rest-api.md)
- [04-Spring Boot 基础主线](04-spring-boot-foundation.md)
- [05-数据访问和事务](05-data-access-and-transaction.md)
- [06-Spring Security 和认证授权](06-security-authentication-authorization.md)
- [07-缓存、消息、任务和集成能力](07-cache-message-task-integration.md)
- [08-测试、可观测性和部署](08-testing-observability-deployment.md)
- [09-Spring Cloud 和分布式基础](09-spring-cloud-distributed-foundation.md)
- [10-项目实战、面试复盘和长期提升](10-projects-interview-growth.md)

## 分部扩展进度

每个阶段会逐步拆成独立小节文件。阶段入口文件负责导航，细节文件负责解释概念、给例子、列练习和验收标准。

| 阶段 | 扩展状态 | 细节目录 |
| --- | --- | --- |
| 00-总览、版本和学习方法 | 已拆分 | [00-overview-and-version/](00-overview-and-version/README.md) |
| 01-IoC、DI 和 Bean 生命周期 | 已拆分 | [01-ioc-di-bean-lifecycle/](01-ioc-di-bean-lifecycle/README.md) |
| 02-AOP、事件、校验和资源抽象 | 已拆分 | [02-aop-events-validation-resources/](02-aop-events-validation-resources/README.md) |
| 03-Spring MVC 和 REST API | 已拆分 | [03-spring-mvc-rest-api/](03-spring-mvc-rest-api/README.md) |
| 04-Spring Boot 基础主线 | 已拆分 | [04-spring-boot-foundation/](04-spring-boot-foundation/README.md) |
| 05-数据访问和事务 | 已拆分 | [05-data-access-and-transaction/](05-data-access-and-transaction/README.md) |
| 06-Spring Security 和认证授权 | 已拆分 | [06-security-authentication-authorization/](06-security-authentication-authorization/README.md) |
| 07-缓存、消息、任务和集成能力 | 已拆分 | [07-cache-message-task-integration/](07-cache-message-task-integration/README.md) |
| 08-测试、可观测性和部署 | 已拆分 | [08-testing-observability-deployment/](08-testing-observability-deployment/README.md) |
| 09-Spring Cloud 和分布式基础 | 已拆分 | [09-spring-cloud-distributed-foundation/](09-spring-cloud-distributed-foundation/README.md) |
| 10-项目实战、面试复盘和长期提升 | 已拆分 | [10-projects-interview-growth/](10-projects-interview-growth/README.md) |

## 推荐项目路线

1. 图书管理 API：用户、图书、借阅记录、分页查询、统一异常、参数校验。
2. 后台权限系统：登录、菜单权限、角色权限、操作日志、Redis 会话或 JWT。
3. 订单库存项目：下单、库存扣减、事务、幂等、消息补偿、接口压测。
4. 微服务拆分实验：网关、用户服务、订单服务、库存服务、配置中心、服务调用链路。

## 官方资料入口

- Spring Framework Reference: <https://docs.spring.io/spring-framework/reference/>
- Spring Boot Reference: <https://docs.spring.io/spring-boot/index.html>
- Spring Boot System Requirements: <https://docs.spring.io/spring-boot/system-requirements.html>
- Spring Guides: <https://spring.io/guides>
- Spring Initializr: <https://start.spring.io/>
