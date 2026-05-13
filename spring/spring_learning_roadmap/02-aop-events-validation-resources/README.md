# 02-阶段导读：AOP、事件、校验和资源抽象

## 这一阶段解决什么问题

学完 IoC 和 DI 后，你已经知道对象如何交给 Spring 管理。接下来要学习 Spring 如何在不破坏业务代码结构的情况下，处理日志、权限、事务、事件通知、参数校验、资源读取和配置绑定。

这一阶段重点不是追求“框架技巧多”，而是理解哪些逻辑应该从业务代码里抽出来，哪些逻辑必须留在业务流程里。

## 学习顺序

建议按下面顺序读：

1. [AOP 解决什么问题](01-aop-purpose-and-concepts.md)
2. [切点、通知和代理机制](02-pointcut-advice-proxy.md)
3. [AOP 实战：日志、耗时和权限入口](03-aop-practice-logging-permission.md)
4. [Spring 事件：同步、异步和事务边界](04-spring-events.md)
5. [Bean Validation 和统一错误响应](05-validation-and-error-response.md)
6. [Resource、Environment 和配置绑定](06-resource-environment-configuration.md)
7. [阶段练习和通过标准](07-stage-practice-checkpoints.md)

## 小白需要先记住的结论

- AOP 适合处理横切逻辑，例如日志、耗时、权限入口、事务、监控。
- Spring AOP 主要基于代理，方法调用必须经过代理对象才会触发增强。
- Spring 事件适合同进程内解耦，不等于消息队列，也不能天然保证最终一致性。
- 参数校验负责输入边界，业务规则仍然要放在业务层判断。
- `Resource` 统一读取资源，`Environment` 统一读取环境和配置，`@ConfigurationProperties` 适合结构化配置。

## 本阶段产出

完成本阶段后，至少产出：

- 一个接口耗时日志切面。
- 一个自定义权限注解和切面入口。
- 一个用户注册事件和两个监听器。
- 一个 DTO 参数校验示例。
- 一个统一异常响应示例。
- 一个读取 classpath JSON 资源的示例。
- 一个 `@ConfigurationProperties` 配置绑定示例。
