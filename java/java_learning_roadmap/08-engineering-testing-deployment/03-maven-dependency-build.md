# 03-Maven 依赖、构建和冲突排查

## Maven 解决什么问题

Maven 负责项目构建、依赖下载、测试执行、打包和生命周期管理。

没有 Maven 的痛点：

- 手动下载 jar，版本混乱。
- 不知道项目如何编译和打包。
- 测试和构建步骤不统一。
- 依赖冲突时很难排查。

## `pom.xml` 基本结构

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>book-api</artifactId>
    <version>1.0.0</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `mvn clean` | 清理构建产物 |
| `mvn test` | 执行测试 |
| `mvn clean test` | 从干净状态执行测试 |
| `mvn clean package` | 测试并打包 |
| `mvn dependency:tree` | 查看依赖树 |

## 依赖作用域

| Scope | 作用 | 常见场景 |
| --- | --- | --- |
| `compile` | 编译和运行都需要 | 业务依赖 |
| `test` | 只在测试中使用 | JUnit、Mockito |
| `provided` | 编译需要，运行环境提供 | Servlet API 了解即可 |
| `runtime` | 编译不需要，运行需要 | 数据库驱动部分场景 |

## 依赖冲突怎么排查

先看依赖树：

```text
mvn dependency:tree
```

关注：

- 同一个依赖出现多个版本。
- 是否被传递依赖引入。
- Spring Boot 项目是否绕过了官方版本管理。

## 容易出错的示例

### 错误示例：随便指定 Spring 相关依赖版本

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.0</version>
</dependency>
```

### 为什么错

Spring Boot 已经管理了一组兼容版本。手动指定可能导致运行时方法不存在、自动配置异常或依赖冲突。

### 正确做法

优先使用 starter 和 Spring Boot 的依赖管理：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 坐标 | 唯一定位一个依赖 | 避免手工管理 jar | 记住 `groupId/artifactId/version` | 重点是版本兼容 |
| 生命周期 | 固定构建流程 | 统一编译、测试、打包 | 常用 `clean test package` | 难点是插件也会参与生命周期 |
| 依赖传递 | 自动引入间接依赖 | 少配很多 jar | 用依赖树观察 | 重点是冲突来源 |
| Scope | 控制依赖使用范围 | 避免测试依赖进生产 | 测试依赖写 `test` | 重点是不要乱用 |

## 本节练习

- 执行 `mvn clean test`。
- 执行 `mvn dependency:tree` 并保存结果。
- 找出项目中 3 个主要依赖的来源。
- 解释 `spring-boot-starter-web` 会带来哪些能力。

## 本节通过标准

- 能读懂基本 `pom.xml`。
- 能执行测试和打包命令。
- 能通过依赖树排查版本来源。
- 能说明 starter 的作用。
