# 01-阶段导读：IoC、DI 和 Bean 生命周期

## 这一阶段解决什么问题

Spring 最核心的能力不是写接口，而是管理对象。IoC 容器负责创建对象、装配依赖、管理生命周期，并在合适的时候给对象加上事务、AOP 等增强能力。

如果这个阶段没有学清楚，后面会反复遇到这些问题：

- Bean 找不到。
- 同类型 Bean 太多，不知道注入哪个。
- 循环依赖。
- `@Transactional`、AOP 不生效。
- 配置类和组件扫描边界混乱。

## 学习顺序

建议按下面顺序读：

1. [IoC 和 DI 到底解决什么问题](01-IoC 和 DI 到底解决什么问题.md)
2. [容器、BeanDefinition 和 ApplicationContext](02-容器、BeanDefinition 和 ApplicationContext.md)
3. [组件扫描和 Bean 注册方式](03-组件扫描和 Bean 注册方式.md)
4. [依赖注入方式和选择标准](04-依赖注入方式和选择标准.md)
5. [Bean 作用域和生命周期](05-Bean 作用域和生命周期.md)
6. [常见注入错误和排查方法](06-常见注入错误和排查方法.md)
7. [阶段练习和通过标准](07-阶段练习和通过标准.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

8. [Bean 名称、别名、`@Primary` 和 `@Qualifier`](08-Bean 名称、别名、@Primary 和 @Qualifier.md)
9. [懒加载、可选依赖和 `ObjectProvider`](09-懒加载、可选依赖和 ObjectProvider.md)
10. [`@Configuration`、`@Bean` 和配置类代理](10-@Configuration、@Bean 和配置类代理.md)
11. [Aware、初始化和销毁回调](11-Aware、初始化和销毁回调.md)
12. [BeanPostProcessor 和 `FactoryBean`](12-BeanPostProcessor 和 FactoryBean.md)
13. [作用域代理和线程安全边界](13-作用域代理和线程安全边界.md)
14. [循环依赖和设计拆解](14-循环依赖和设计拆解.md)
15. [IoC 练习项目落地](15-IoC 练习项目落地.md)
16. [阶段总验收](16-阶段总验收.md)

## 小白需要先记住的结论

- IoC 不是一个注解，而是一种对象创建权交给容器的设计方式。
- DI 是 IoC 的主要落地方式，由容器把依赖对象传给需要它的对象。
- 构造器注入优先于字段注入，因为依赖更清楚，也更容易测试。
- `@Component` 适合注册自己的业务类，`@Bean` 适合注册第三方对象或需要复杂构造的对象。
- Spring 默认 Bean 作用域是 singleton，但它只代表同一个 Spring 容器里的单例。
- 生命周期和后置处理器是很多框架能力的入口，例如配置绑定、AOP、事务代理。

## 本阶段产出

完成本阶段后，至少产出：

- 一个 `spring-ioc-practice` 练习项目。
- 一个支付接口多实现注入示例。
- 一个 `@Configuration` + `@Bean` 注册第三方对象示例。
- 一个 Bean 生命周期日志示例。
- 一个循环依赖和注入冲突的错误记录。
- 一份 IoC/DI 自测问答。


