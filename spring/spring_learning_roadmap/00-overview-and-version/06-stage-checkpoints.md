# 06-阶段通过标准

## 为什么要有通过标准

学习路线如果没有验收标准，很容易变成“我感觉看懂了”。Spring 学习尤其如此：很多注解看起来简单，但真正排查问题时才知道是否理解。

第 00 阶段通过标准不是要求你掌握所有 Spring 细节，而是确认你已经具备继续进入 IoC、DI、Bean 生命周期的准备。

## 概念验收

你需要能用自己的话解释：

- Spring Framework、Spring Boot、Spring Cloud 的关系。
- Spring MVC 在 HTTP 请求链路中的作用。
- Spring Boot Starter 解决什么问题。
- 自动配置大致是什么意思。
- 为什么现代 Spring 项目要关注 `jakarta.*`。
- 为什么不建议一开始就直接学微服务。

如果只能背定义，不能举例，还不算通过。

## 环境验收

你需要完成：

- `java -version` 可以正常输出。
- `mvn -version` 或 Gradle 版本可以正常输出。
- Git 可以正常使用。
- IDE 能导入 Spring Boot 项目。
- 一个最小 Spring Boot 项目可以启动。
- API 工具能请求本地接口。

建议把命令输出和版本记录到 `version-baseline.md`。

## 项目验收

最小项目需要具备：

- 一个启动类。
- 一个 `/health/simple` 接口。
- 一个 `application.yml`。
- 自定义应用名。
- 自定义端口。
- Actuator health 端点。
- 一份 README，写清楚如何启动和访问接口。

README 至少包含：

```markdown
# spring-boot-hello

## 环境

- JDK:
- Spring Boot:
- Maven:

## 启动

## 接口

## 常见问题
```

## 错误记录验收

至少记录 3 个错误：

- 端口占用。
- 404。
- 配置不生效。

每个错误按下面格式写：

```markdown
## 问题：端口被占用

### 现象

### 原因

### 定位过程

### 解决方法

### 下次如何避免
```

能记录错误，比一次性跑通更有价值。后端开发的大量能力来自定位问题。

## 自测问题

在进入下一阶段前，回答下面问题：

1. `@SpringBootApplication` 放在哪个类上？为什么？
2. Controller 类为什么要放在启动类所在包或子包下？
3. `server.port` 改了不生效，可能有哪些原因？
4. Starter 和普通依赖有什么区别？
5. `javax.validation.Valid` 和 `jakarta.validation.Valid` 的差异为什么重要？
6. Actuator 的 health 端点能说明什么，不能说明什么？

## 阶段完成标记

当你能做到下面这些事，就可以进入 01 阶段：

- 不看教程也能创建一个最小 Spring Boot Web 项目。
- 能解释 Spring 体系的几个主要模块。
- 能确定自己的版本基线。
- 能用 API 工具访问本地接口。
- 能根据启动日志定位基础问题。
- 能把本阶段练习整理成 README。
