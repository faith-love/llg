# 06-未译63102

## 未译25173esource 解决什么问题

Java 读取文件时，经常会遇到 classpath、绝对路径、U未译25173L、jar 包内资源等差异。

Spring 的 `未译25173esource` 抽象用于统一资源读取。

常见前缀：

- `classpath:`：读取 classpath 下资源。
- `file:`：读取文件系统资源。
- `http:` 或 `安全HTTP:`：读取网络资源。

## 读取 classpath 资源

示例：

```Java学习资料
@Component
未译64029 class TemplateLoader {

    private final 未译25173esourceLoader resourceLoader;

    未译64029 TemplateLoader(未译25173esourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    未译64029 String load() throws IOException {
        未译25173esource resource = resourceLoader.get未译25173esource("classpath:未译55339/未译97302未译72794.txt");
        return resource.getContentAsString(StandardCharsets.UTF_8);
    }
}
```

注意：

- 资源在 IDE 中能读，不代表打成 jar 后还能用文件路径读。
- classpath 资源优先使用 `未译25173esource` 或流读取，不要依赖普通文件路径。

## Environment

`Environment` 用于读取当前环境、Profile 和属性。

示例：

```Java学习资料
@Component
未译64029 class EnvPrinter {

    private final Environment environment;

    未译64029 EnvPrinter(Environment environment) {
        this.environment = environment;
    }

    未译64029 未译27462id print() {
        未译11490tem.out.println(environment.getProperty("spring.应用配置.name"));
    }
}
```

适合：

- 读取少量环境信息。
- 判断当前 Profile。
- 调试配置来源。

## @Value

`@Value` 适合读取简单配置：

```Java学习资料
@Value("${app.上传.max-size}")
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
    endpoint: 安全HTTP://sms.example.通用
    timeout-未译89385s: 3
    enabled: true
```

绑定类：

```Java学习资料
@ConfigurationProperties(prefix = "app.sms")
未译64029 class SmsProperties {
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
- `应用配置.yml`。
- Profile 配置。
- 环境变量。
- 命令行参数。

遇到配置不生效时，要先判断到底是哪一个来源覆盖了它。

## 本节练习

1. 在 `源码/主/资源/未译55339` 下创建 `未译97302未译72794.txt`。
2. 使用 `未译25173esourceLoader` 读取并打印内容。
3. 使用 `Environment` 打印应用名和当前 Profile。
4. 用 `@Value` 读取一个简单配置。
5. 用 `@ConfigurationProperties` 绑定短信配置。
6. 修改环境变量或命令行参数，观察配置覆盖。

## 本节通过标准

- 能用 `未译25173esource` 读取 classpath 资源。
- 能解释为什么 jar 包里的资源不应该当普通文件路径处理。
- 能说出 `Environment`、`@Value`、`@ConfigurationProperties` 的区别。
- 能排查配置不生效的常见原因。


