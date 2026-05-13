# 06-Resource、Environment 和配置绑定

## Resource 解决什么问题

Java 读取文件时，经常会遇到 classpath、绝对路径、URL、jar 包内资源等差异。

Spring 的 `Resource` 抽象用于统一资源读取。

常见前缀：

- `classpath:`：读取 classpath 下资源。
- `file:`：读取文件系统资源。
- `http:` 或 `https:`：读取网络资源。

## 读取 classpath 资源

示例：

```java
@Component
public class TemplateLoader {

    private final ResourceLoader resourceLoader;

    public TemplateLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public String load() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:templates/welcome.txt");
        return resource.getContentAsString(StandardCharsets.UTF_8);
    }
}
```

注意：

- 资源在 IDE 中能读，不代表打成 jar 后还能用文件路径读。
- classpath 资源优先使用 `Resource` 或流读取，不要依赖普通文件路径。

## Environment

`Environment` 用于读取当前环境、Profile 和属性。

示例：

```java
@Component
public class EnvPrinter {

    private final Environment environment;

    public EnvPrinter(Environment environment) {
        this.environment = environment;
    }

    public void print() {
        System.out.println(environment.getProperty("spring.application.name"));
    }
}
```

适合：

- 读取少量环境信息。
- 判断当前 Profile。
- 调试配置来源。

## @Value

`@Value` 适合读取简单配置：

```java
@Value("${app.upload.max-size}")
private String maxSize;
```

缺点：

- 配置分散。
- 不适合复杂结构。
- 类型绑定和校验不如 `@ConfigurationProperties` 清晰。

## @ConfigurationProperties

结构化配置优先使用 `@ConfigurationProperties`。

配置：

```yaml
app:
  sms:
    endpoint: https://sms.example.com
    timeout-seconds: 3
    enabled: true
```

绑定类：

```java
@ConfigurationProperties(prefix = "app.sms")
public class SmsProperties {
    private String endpoint;
    private int timeoutSeconds;
    private boolean enabled;
}
```

再通过配置类启用或扫描。

优点：

- 配置集中。
- 类型清晰。
- 方便生成配置元数据。
- 方便校验。

## 配置优先级

Spring Boot 支持多种配置来源：

- 默认配置。
- `application.yml`。
- Profile 配置。
- 环境变量。
- 命令行参数。

遇到配置不生效时，要先判断到底是哪一个来源覆盖了它。

## 本节练习

1. 在 `src/main/resources/templates` 下创建 `welcome.txt`。
2. 使用 `ResourceLoader` 读取并打印内容。
3. 使用 `Environment` 打印应用名和当前 Profile。
4. 用 `@Value` 读取一个简单配置。
5. 用 `@ConfigurationProperties` 绑定短信配置。
6. 修改环境变量或命令行参数，观察配置覆盖。

## 本节通过标准

- 能用 `Resource` 读取 classpath 资源。
- 能解释为什么 jar 包里的资源不应该当普通文件路径处理。
- 能说出 `Environment`、`@Value`、`@ConfigurationProperties` 的区别。
- 能排查配置不生效的常见原因。
