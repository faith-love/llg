# Java 详细学习路线

这份路线面向后端开发方向，目标是从 Java 基础逐步走到能独立完成 Spring Boot 后端项目、理解 JVM 和并发基础、具备工程化与面试复盘能力。

## 版本选择

- 新学习主线建议使用 JDK 25 LTS：它是当前长期支持版本，适合新项目和长期学习。
- 如果教程、公司或旧项目使用 Java 17/21，可以先按对应版本练习；17/21 仍然是很多企业项目的常见基线。
- 如果维护 Java 8/11 老项目，先补齐 Java 8 之后的核心变化，再迁移到 17/21/25。
- 新项目必须先确认 Spring、ORM、数据库驱动、中间件客户端和部署环境都支持目标 JDK。
- Spring Boot 当前主线要求 Java 17+，不要用 Java 8 去学习现代 Spring Boot 项目。

## 学习路线总表

| 阶段 | 主题 | 推荐周期 | 阶段产出 |
| --- | --- | ---: | --- |
| 0 | 环境、工具和学习方法 | 2-3 天 | 本地 JDK、IDE、Maven、Git 可正常使用 |
| 1 | Java 基础语法 | 1-2 周 | 30 个基础小程序，能读写控制台程序 |
| 2 | 面向对象和核心 API | 2-3 周 | 小型命令行系统，覆盖集合、异常、泛型、IO |
| 3 | JVM、并发和性能基础 | 2-4 周 | 并发练习、JVM 参数记录、问题排查笔记 |
| 4 | 数据库基础 | 2-3 周 | 能设计表、写 SQL、理解事务、索引和慢查询 |
| 5 | MyBatis 与 MyBatis-Plus | 2-3 周 | 能用 MyBatis/Plus 完成数据访问层 |
| 6 | JDBC、HTTP 和 Web 衔接 | 1-2 周 | 理解 Java 数据访问、HTTP、REST、分层和错误响应 |
| 7 | Spring Boot 主线开发 | 4-6 周 | 完整 CRUD API、登录鉴权、缓存、测试 |
| 8 | 工程化和部署 | 2-3 周 | Docker 部署、日志、配置、CI、接口文档 |
| 9 | 综合项目 | 3-6 周 | 一个可演示项目，一份项目复盘 |
| 10 | 面试复盘和长期提升 | 长期 | 知识清单、项目讲法、错题复盘 |

## 学习原则

- 先能写，再能解释，最后能定位问题。每个知识点至少要有一个可运行例子。
- 不要只看视频。每学习 2 小时，至少写 30-60 分钟代码。
- 不要跳过基础 API。集合、泛型、异常、IO、并发是后面框架学习的地基。
- 学 Spring 之前，必须先理解对象创建、接口、多态、注解、反射、泛型和异常处理。
- 学项目时要保留提交记录，项目复盘比代码数量更重要。

## 文档导航

- [00-总览与版本基线](00-overview-and-version.md)
- [01-基础语法和开发环境](01-foundation-syntax.md)
- [02-面向对象和核心 API](02-oop-and-core-api.md)
- [03-JVM、并发和性能基础](03-jvm-concurrency-performance.md)
- [04-数据库基础](04-database-foundation.md)
- [05-MyBatis 与 MyBatis-Plus](05-mybatis-and-plus.md)
- [06-JDBC、HTTP 和 Web 衔接](06-jdbc-http-web.md)
- [07-Spring Boot 主线](07-spring-boot-mainline.md)
- [08-工程化、测试和部署](08-engineering-testing-deployment.md)
- [09-项目路线和验收标准](09-projects-and-checkpoints.md)
- [10-面试复盘和长期提升](10-interview-and-long-term-growth.md)

## 分部扩展进度

每个阶段会逐步拆成独立小节文件。阶段入口文件负责导航，细节文件负责解释概念、给例子、列练习和验收标准。

| 阶段 | 扩展状态 | 细节目录 |
| --- | --- | --- |
| 00-总览与版本基线 | 已拆分 | [00-overview-and-version/](00-overview-and-version/README.md) |
| 01-基础语法和开发环境 | 已拆分 | [01-foundation-syntax/](01-foundation-syntax/README.md) |
| 02-面向对象和核心 API | 已拆分 | [02-oop-and-core-api/](02-oop-and-core-api/README.md) |
| 03-JVM、并发和性能基础 | 已拆分 | [03-jvm-concurrency-performance/](03-jvm-concurrency-performance/README.md) |
| 04-数据库基础 | 已拆分 | [04-database-foundation/](04-database-foundation/README.md) |
| 05-MyBatis 与 MyBatis-Plus | 已拆分 | [05-mybatis-and-plus/](05-mybatis-and-plus/README.md) |
| 06-JDBC、HTTP 和 Web 衔接 | 已拆分 | [06-jdbc-http-web/](06-jdbc-http-web/README.md) |
| 07-Spring Boot 主线 | 已拆分 | [07-spring-boot-mainline/](07-spring-boot-mainline/README.md) |
| 08-工程化、测试和部署 | 已拆分 | [08-engineering-testing-deployment/](08-engineering-testing-deployment/README.md) |
| 09-项目路线和验收标准 | 已拆分 | [09-projects-and-checkpoints/](09-projects-and-checkpoints/README.md) |
| 10-面试复盘和长期提升 | 已拆分 | [10-interview-and-long-term-growth/](10-interview-and-long-term-growth/README.md) |

## 官方资料入口

- Oracle Java SE Support Roadmap: <https://www.oracle.com/java/technologies/java-se-support-roadmap.html>
- OpenJDK JDK 项目: <https://openjdk.org/projects/jdk/>
- Spring Boot System Requirements: <https://docs.spring.io/spring-boot/system-requirements.html>
- Maven Getting Started Guide: <https://maven.apache.org/guides/getting-started/>
- JUnit 5 User Guide: <https://junit.org/junit5/docs/current/user-guide/>
