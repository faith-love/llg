# 02-AOP、事件、校验和资源抽象

## 阶段目标

这个阶段学习 Spring 对横切逻辑和通用基础设施的封装。重点不是把所有扩展点背下来，而是知道什么时候该用框架能力，什么时候直接写业务代码更清晰。

学完后要能说明：

- AOP 适合处理日志、权限、事务、监控这类横切逻辑。
- Spring 事件适合做同进程内的解耦通知，不等于消息队列。
- Bean Validation 适合做输入边界校验，不替代业务规则判断。
- Resource 抽象让文件、classpath、URL 资源可以用统一方式读取。

## AOP 学习重点

需要掌握的概念：

- Aspect：切面，横切逻辑的载体。
- Join Point：连接点，Spring AOP 主要是方法执行。
- Pointcut：切点，定义哪些方法被增强。
- Advice：通知，定义增强逻辑。
- Proxy：代理，Spring AOP 的核心实现方式。

先写一个接口和实现类，再给方法加日志切面。观察代理对象类型，理解 JDK 动态代理和 CGLIB 代理的差异。

## 事件机制

Spring 事件适合处理“业务已经完成后，通知别的模块做附加动作”的场景。

示例：

- 用户注册成功后发布 `UserRegisteredEvent`。
- 监听器发送欢迎消息或写审计日志。
- 主流程不直接依赖消息发送实现。

需要注意：默认事件仍在同一应用进程里，失败、事务边界、异步执行都要明确设计。

## 参数校验

Web 项目里常用 Jakarta Bean Validation 做入参校验。

练习内容：

- DTO 字段使用 `@NotBlank`、`@NotNull`、`@Size`、`@Email`。
- Controller 参数使用 `@Valid` 或 `@Validated`。
- 统一异常处理校验失败结果。
- 区分“格式校验”和“业务校验”。

## 资源和环境抽象

需要掌握：

- `Resource`：统一读取 classpath、file、URL 等资源。
- `Environment`：读取 Profile、属性和系统环境变量。
- `@Value`：读取简单配置。
- `@ConfigurationProperties`：绑定结构化配置。

## 必做练习

- 写一个接口耗时日志切面，记录方法名、参数、耗时、异常。
- 写一个用户注册事件和两个监听器。
- 写一个用户创建接口，用 DTO 校验用户名、手机号、邮箱。
- 从 classpath 读取一个 JSON 文件并打印内容。
- 用 `@ConfigurationProperties` 绑定一个自定义业务配置。

## 验收标准

- 能解释为什么同类内部方法调用可能不会触发 AOP。
- 能说明事件监听器同步、异步、事务边界的差异。
- 能把校验失败统一转换成前端可读的错误响应。
- 能说清 `@Value` 和 `@ConfigurationProperties` 的适用场景。


