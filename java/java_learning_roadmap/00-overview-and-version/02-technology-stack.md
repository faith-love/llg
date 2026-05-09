# 02-推荐技术栈

## 技术栈是什么

技术栈就是完成一个项目需要的一组技术。Java 后端常见技术栈不只有 Java 语言本身，还包括构建工具、数据库、框架、测试、缓存、部署工具等。

小白可以把它理解成做饭需要的工具：

- Java 语言是食材处理能力。
- JDK 是厨房基础设施。
- IDE 是操作台。
- Maven 是配料管理工具。
- Spring Boot 是常用做菜流程。
- MySQL/Redis 是数据存放工具。
- Docker 是打包和运行环境。

## 推荐清单

| 类别 | 推荐 | 小白理解 |
| --- | --- | --- |
| JDK | JDK 25 LTS，新项目主线；Java 17/21 兼容企业教程 | Java 程序运行和编译的基础 |
| IDE | IntelliJ IDEA | 写代码、运行、调试的主要工具 |
| 构建工具 | Maven | 管理依赖、打包、运行测试 |
| 版本控制 | Git | 保存代码历史，方便回滚和协作 |
| 数据库 | MySQL 或 PostgreSQL | 保存业务数据 |
| 数据访问 | JDBC -> MyBatis -> JPA 了解 | Java 访问数据库的方式 |
| Web 框架 | Spring Boot、Spring MVC | 写后端接口的主线框架 |
| 测试 | JUnit 5、Mockito、Spring Boot Test | 验证代码是否正确 |
| 缓存 | Redis | 提升读性能，存放临时数据 |
| 部署 | Docker、Linux 基础 | 让项目在本机或服务器稳定运行 |

## 学习顺序

不要一开始就同时安装和学习所有东西。推荐顺序如下：

1. JDK + IDE：先能写和运行 Java。
2. Git：从第一天就保存代码。
3. Maven：开始写多文件项目和引入依赖时学习。
4. MySQL：学完集合和 IO 后引入数据库。
5. Spring Boot：理解 OOP、注解、异常、HTTP 后再学。
6. Redis：完成基础 CRUD 项目后再学。
7. Docker：项目能跑起来后再学部署。
8. 消息队列、微服务：不要太早学，先把单体项目做好。

## JDK

JDK 是 Java Development Kit，包含编译和运行 Java 程序需要的工具。

你需要会：

```powershell
java -version
javac -version
```

如果这两个命令都能输出版本，说明 JDK 基本安装成功。

常见问题：

- 只安装了 JRE，没有 `javac`。
- 环境变量配置错误。
- 电脑上装了多个 JDK，IDE 使用的版本和命令行不一致。

## IDE

推荐使用 IntelliJ IDEA。

小白先掌握这些操作：

- 新建 Java 项目。
- 新建类。
- 运行 `main` 方法。
- 设置断点调试。
- 查看报错堆栈。
- 格式化代码。
- 搜索类和方法。

先不要沉迷插件。IDE 的核心能力是运行、调试、导航和重构。

## Maven

Maven 用来管理依赖和构建项目。

你需要先理解三个词：

- `groupId`：组织或公司名。
- `artifactId`：项目或模块名。
- `version`：版本号。

常用命令：

```powershell
mvn -version
mvn clean test
mvn clean package
```

小白常见误区：

- 以为 Maven 只是下载 jar 包。
- 不知道依赖冲突会导致运行时错误。
- 不知道测试失败时打包可能失败。

## Git

Git 用来保存代码历史。

最小命令集合：

```powershell
git status
git add .
git commit -m "docs: add java learning note"
```

学习阶段也要用 Git。因为你会频繁写错代码，有提交记录就能回到正常状态。

## 数据库

Java 后端必须学习数据库。建议先学 SQL，再用 Java 连接数据库。

学习顺序：

1. 会建表。
2. 会增删改查。
3. 会使用索引。
4. 会理解事务。
5. 会用 Java 执行 SQL。
6. 会用 MyBatis 简化数据库访问。

如果已经有 `D:\learn\sql` 的资料，可以作为 SQL 学习入口。

## Spring Boot

Spring Boot 不是第一天就学的内容。它会用到很多基础：

- 类和对象。
- 接口和多态。
- 注解。
- 反射。
- 异常。
- 泛型。
- HTTP。
- 数据库。

如果这些都没学，直接学 Spring Boot 会变成“会复制代码，但不知道为什么能跑”。

## 本节练习

检查本机环境，并记录到 `environment-check.md`：

```markdown
# Java 环境检查

## JDK

## IDE

## Maven

## Git

## MySQL

## 当前问题
```

## 本节通过标准

- 能说清 JDK、IDE、Maven、Git 各自解决什么问题。
- 能在命令行查看 JDK、Maven、Git 版本。
- 能解释为什么 Spring Boot 不适合第一天直接学。

