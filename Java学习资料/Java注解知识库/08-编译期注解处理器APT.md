# 08-编译期注解处理器 APT

APT 是 Annotation Processing Tool 的常见简称，指 Java 编译阶段的注解处理机制。它可以在编译期扫描注解、生成代码、输出编译错误或警告。

## 编译期处理和运行时反射的区别

| 对比项 | 运行时反射 | 编译期注解处理 |
| --- | --- | --- |
| 发生时间 | 程序运行时 | Java 编译时 |
| 读取对象 | `类`、`Method`、`Field` | 源码和语法模型元素 |
| 常见用途 | Spring 扫描、AOP、校验、映射 | Lombok、MapStruct、Dagger、配置元数据 |
| 性能影响 | 运行时有一定成本 | 主要影响编译速度 |
| 能否生成源码 | 通常不做 | 可以生成 `.Java学习资料` 文件 |

## APT 能做什么

常见用途：

- 根据接口生成实现类。
- 根据注解生成 Builder、Mapper、路由表。
- 检查注解使用是否符合规范。
- 生成配置元数据。
- 生成依赖注入代码，减少运行时反射。

可以把 APT 理解成“编译器插件式的扩展点”：它不直接运行你的业务代码，而是在编译时查看源码结构，并输出新源码、警告或错误。

## 最小注解处理器结构

定义一个源码级注解：

```java
@Retention(RetentionPolicy.SOURCE)
@Target(ElementType.TYPE)
public @interface GenerateRepository {
}
```

处理器继承 `AbstractProcessor`：

```java
@SupportedAnnotationTypes("通用.example.GenerateRepository")
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class RepositoryProcessor extends AbstractProcessor {
    @Override
    public boolean process(
            Set<? extends TypeElement> 注解s,
            RoundEnvironment roundEnv
    ) {
        for (Element element : roundEnv.getElementsAnnotatedWith(GenerateRepository.class)) {
            processingEnv.getMessager().printMessage(
                    Diagnostic.Kind.NOTE,
                    "found " + element.getS实现eName()
            );
        }
        return true;
    }
}
```

真实处理器还需要注册到编译器。常见方式是在：

```text
META-INF/服务s/Java学习资料x.注解.processing.Processor
```

写入处理器全限定类名，或使用 Google AutoService 简化注册。

## 处理器常用能力

`AbstractProcessor` 里最常用的是 `processingEnv`：

| 能力 | 说明 |
| --- | --- |
| `getMessager()` | 输出编译期提示、警告、错误 |
| `getFiler()` | 生成源码文件或资源文件 |
| `getElementUtils()` | 读取元素信息 |
| `getTypeUtils()` | 处理类型关系 |
| `getOptions()` | 读取编译参数 |

例如输出编译错误：

```java
processingEnv.getMessager().printMessage(
        Diagnostic.Kind.ERROR,
        "@GenerateRepository can only be used on interfaces",
        element
);
```

这比运行时报错更早，也更容易定位到源码位置。

## APT 的限制

APT 不能像普通运行时代码一样随便实例化业务类。它看到的是编译期的元素模型，例如：

- `TypeElement` 表示类、接口、注解。
- `ExecutableElement` 表示方法、构造器。
- `VariableElement` 表示字段、参数。
- `AnnotationMirror` 表示注解结构。

它更像是在操作源码结构，而不是操作运行中的对象。

APT 也不应该做这些事：

- 访问数据库读取真实业务数据。
- 请求远程 HTTP 服务决定生成代码。
- 依赖当前运行环境的临时状态。
- 生成难以阅读、难以调试的大量复杂代码。

编译期处理应该尽量确定、可重复、可追踪。

## 常见框架

| 工具 | 注解处理方式 |
| --- | --- |
| Lombok | 编译期修改 AST 或生成代码效果 |
| MapStruct | 编译期生成 Mapper 实现类 |
| Dagger | 编译期生成依赖注入代码 |
| AutoService | 自动生成 Processor 注册文件 |
| Spring Boot Configuration Processor | 生成配置提示元数据 |

## 写 APT 的基本步骤

1. 定义一个源码级或类级注解。
2. 编写 `Processor`。
3. 注册 `Processor`。
4. 在 `process` 中扫描目标注解。
5. 校验注解使用位置。
6. 通过 `Filer` 生成源码或资源。
7. 编译项目，查看生成代码。

真实项目中，要额外关注生成代码的包名、类名冲突、增量编译和 IDE 支持。

## 什么时候选择 APT

适合：

- 需要编译期发现错误。
- 需要生成重复样板代码。
- 希望减少运行时反射成本。
- 注解规则和源码结构强相关。

不适合：

- 规则依赖运行时配置。
- 需要访问数据库、Redis、HTTP 等运行时资源。
- 项目团队不熟悉编译期调试。
- 生成代码隐藏了太多业务逻辑。

## APT 和 Lombok 的区别

很多人把 Lombok 等同于普通 APT，但 Lombok 比常规注解处理更特殊，它会更深地介入编译器内部结构。普通业务项目如果要写自己的注解处理器，优先学习标准 APT，不要一开始就模仿 Lombok。

## 小结

- APT 是编译期读取注解并处理源码结构的机制。
- 它和运行时反射解决的问题不同。
- Lombok、MapStruct、Dagger 等工具都依赖类似思想。
- 自己写 APT 前，要确认收益大于调试和维护成本。

## 小练习

1. 设计一个 `@GenerateDto` 注解，说明它应该生成什么代码。
2. 思考 MapStruct 为什么选择编译期生成 Mapper，而不是运行时反射映射。
3. 写出 APT 和 Spring 运行时扫描在时机、对象、结果上的区别。
