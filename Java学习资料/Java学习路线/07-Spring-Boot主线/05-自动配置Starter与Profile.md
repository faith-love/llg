# 05-Spring Boot 自动配置、Starter、配置文件和 Profile

## 自动配置是什么

Spring Boot 会根据 classpath 中的依赖、配置项和条件，自动创建一批默认 Bean。

它不是魔法，本质是：

```text
看到你引入了某个 starter -> 判断条件满足 -> 创建默认配置
```

## Starter

Starter 是一组依赖的组合。

例如 Web 项目引入：

```xml
spring-boot-starter-web
```

它会带来 Spring MVC、JSON 序列化、内嵌 Web 服务器等常用依赖。

## 配置文件

常见：

```text
应用配置.yml
application-dev.yml
application-prod.yml
```

示例：

```yaml
服务端:
  port: 8080
spring:
  数据源:
    url: JDBC:mySQL学习资料://localhost:3306/library
```

## Profile

Profile 用于区分环境：

- dev。
- 测试。
- prod。

激活：

```yaml
spring:
  profiles:
    active: dev
```

或命令行：

```powershell
Java学习资料 -jar app.jar --spring.profiles.active=prod
```

## ConfigurationProperties

复杂配置可以绑定到类：

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String 上传Dir;
}
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 自动配置 | 提供默认 Bean 和配置 | 减少大量样板配置 | 出问题时看条件和依赖 | 重点是条件装配，不是魔法 |
| Starter | 打包常用依赖组合 | 避免手动找一堆依赖 | 按功能引入 starter | 难点是依赖冲突和版本管理 |
| 配置文件 | 外部化应用参数 | 不把环境差异写死在代码里 | dev/测试/prod 分开 | 重点是敏感信息别提交 |
| Profile | 切换不同环境配置 | 本地和生产配置不混用 | 启动时明确 active profile | 重点是确认当前生效环境 |
| 配置绑定 | 类型安全读取配置 | 避免散落 `@Value` | 多字段配置用 属性 类 | 重点是配置结构清晰 |

## 本节练习

- 创建 `application-dev.yml` 和 `application-prod.yml`。
- 修改端口并启动验证。
- 添加一个自定义配置类。
- 引入 Web starter，观察项目依赖变化。

## 本节通过标准

- 能解释自动配置的基本原理。
- 能说明 starter 解决什么问题。
- 能使用 Profile 区分环境。
- 能把配置绑定到类。

