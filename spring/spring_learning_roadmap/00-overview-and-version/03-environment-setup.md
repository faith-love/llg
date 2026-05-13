# 03-开发环境和工具准备

## 阶段目标

这一节把 Spring 学习需要的基础工具准备好。环境不稳定会让你把大量时间浪费在无关问题上，比如端口占用、依赖下载失败、JDK 版本不一致、数据库连接错误。

学 Spring 前至少要准备：

- JDK。
- IDE。
- Maven 或 Gradle。
- Git。
- API 调试工具。
- 数据库和 Redis。
- Docker。

## JDK

建议新学习主线使用 JDK 25 LTS。如果教程使用 Java 17 或 21，可以先保持一致，但不要再用 Java 8 作为现代 Spring Boot 学习主线。

检查命令：

```powershell
java -version
javac -version
```

需要确认：

- `java` 和 `javac` 都能执行。
- IDE 使用的 JDK 和命令行使用的 JDK 尽量一致。
- `JAVA_HOME` 指向正确的 JDK 安装目录。

## IDE

推荐 IntelliJ IDEA。

需要熟悉：

- 创建 Maven/Gradle 项目。
- 导入 Spring Boot 项目。
- 运行启动类。
- 查看依赖树。
- 打断点调试 Controller 和 Service。
- 查看运行日志。

初学阶段不要只依赖 IDE 自动修复。每次自动导包、自动生成代码后，都要看一眼它改了什么。

## Maven 或 Gradle

初学建议先用 Maven，因为企业项目和教程里更常见，目录结构也更直观。

检查命令：

```powershell
mvn -version
```

需要掌握的 Maven 命令：

```powershell
mvn clean
mvn test
mvn package
mvn dependency:tree
```

`dependency:tree` 很重要。遇到版本冲突、类找不到、包重复时，它是第一批要看的信息。

## Git

Spring 学习项目要从一开始就使用 Git。

检查命令：

```powershell
git --version
```

建议每完成一个小功能提交一次：

- 初始化项目。
- 新增第一个 Controller。
- 新增统一异常处理。
- 新增数据库访问。
- 新增事务练习。

提交记录会帮你复盘每个阶段到底学会了什么。

## API 调试工具

任选一个：

- Apifox。
- Postman。
- IntelliJ IDEA HTTP Client。
- curl。

初学时建议为每个接口保存请求示例，包括：

- URL。
- Method。
- Header。
- Request Body。
- Response Body。
- 错误响应。

这样后面写接口文档和排查问题会更轻松。

## 数据库、Redis 和 Docker

Spring 后端项目绕不开外部依赖。建议用 Docker 管理本地 MySQL、Redis、RabbitMQ 等服务。

先准备：

- MySQL 或 PostgreSQL。
- Redis。
- Docker Desktop。

最开始可以只跑 MySQL。等学到缓存、消息、部署阶段，再逐步增加 Redis、MQ。

## 建议练习目录

```text
D:\learn\spring\practice\
  spring-boot-hello\
  spring-mvc-book-api\
  spring-transaction-demo\
```

不要把所有练习都写进一个项目。基础阶段项目小一点，便于定位问题。

## 本节练习

1. 检查 `java -version`、`mvn -version`、`git --version`。
2. 在 IDE 中创建一个空的 Spring Boot 项目。
3. 启动项目，确认控制台没有报错。
4. 修改端口为 `8081`，重新启动。
5. 用 API 工具请求一个最小接口。

## 本节通过标准

- 能从命令行确认 JDK、Maven、Git 可用。
- 能在 IDE 里运行 Spring Boot 启动类。
- 能看懂端口占用、依赖下载失败、JDK 不匹配这三类常见错误。
- 能用 API 工具请求本地接口。
