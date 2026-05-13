# 00-阶段导读：总览、版本和学习方法

## 这一阶段解决什么问题

很多人学 Spring 会直接从 `@RestController`、`@Autowired`、`@SpringBootApplication` 开始抄代码。代码可能能跑，但一旦遇到依赖冲突、配置不生效、Bean 找不到、事务不回滚，就不知道从哪里查。

第 00 阶段先解决三个问题：

- Spring 体系到底包含哪些东西。
- 新学习主线该选什么版本。
- 后续每个阶段应该怎么学、怎么练、怎么验收。

这个阶段代码不多，但会决定后面学习是否顺畅。

## 学习顺序

建议按下面顺序读：

1. [Spring 体系地图](01-spring-ecosystem-map.md)
2. [版本基线和兼容关系](02-version-baseline.md)
3. [开发环境和工具准备](03-environment-setup.md)
4. [学习顺序和时间安排](04-learning-order.md)
5. [第一个 Spring Boot 项目](05-first-spring-boot-project.md)
6. [阶段通过标准](06-stage-checkpoints.md)

## 小白需要先记住的结论

- Spring Framework 是底层核心，Spring Boot 是工程化入口，Spring Cloud 是分布式工具箱。
- 新学习主线可以用 Spring Boot 4.x + Spring Framework 7.x + JDK 25 LTS。
- 企业项目里 Spring Boot 3.x 仍然常见，遇到 3.x 不要慌，但不要再拿 Java 8 老教程当新主线。
- 学 Spring 不能只背注解，要知道注解由谁解析、什么时候生效、默认行为是什么。
- 每个阶段都要保留可运行代码和错误记录。只看视频、只抄笔记，不算完成。

## 本阶段产出

完成本阶段后，至少产出这些东西：

- 本机可用的 JDK、IDE、Maven 或 Gradle、Git。
- 一个最小 Spring Boot Web 项目。
- 一个能访问的健康检查接口。
- 一份自己的 Spring 学习计划。
- 一份版本选择记录，说明当前学习使用的 JDK、Spring Boot、Spring Framework 版本。
- 一个问题记录文件，例如 `spring-learning-log.md`。

## 建议文件夹

```text
D:\learn\spring\
  spring_learning_roadmap\
  practice\
    spring-boot-hello\
    spring-ioc-practice\
    spring-mvc-book-api\
  notes\
    spring-learning-log.md
    version-baseline.md
```

如果暂时没有 `practice` 和 `notes` 目录，也没关系。先读完本阶段，再开始创建练习项目。
