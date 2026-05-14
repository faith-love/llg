# 01-IoC、DI 和 Bean 生命周期

## 阶段目标

IoC 和 DI 是 Spring 的地基。这个阶段不追求背注解数量，而是理解对象为什么交给容器管理、依赖为什么由容器注入、Bean 在容器里经历了哪些阶段。

学完后要能回答：

- Bean 是什么，和普通 Java 对象有什么区别。
- `ApplicationContext` 和 `BeanFactory` 的关系。
- 构造器注入、Setter 注入、字段注入的差异。
- `@Component`、`@Service`、`@Repository`、`@Controller` 的定位。
- `@Configuration` 和 `@Bean` 适合解决什么问题。
- Bean 生命周期里初始化、销毁、后置处理器分别做什么。

## 学习重点

### 容器和 Bean 定义

先从最小例子开始：一个接口、一个实现类、一个调用者。对比手动 `new` 和交给 Spring 容器创建的差异。

需要掌握：

- 组件扫描：`@ComponentScan` 如何发现类。
- Bean 命名：默认名称、显式名称、冲突时的处理。
- Bean 作用域：singleton、prototype、request、session。
- 条件注册：`@Profile`、`@Conditional` 的基本思路。

### 依赖注入

优先使用构造器注入，因为依赖关系清晰，便于测试，也能避免对象处于半初始化状态。

需要做的实验：

- 一个 Service 依赖一个 Repository。
- 一个 Service 依赖多个同类型 Bean，用 `@Primary` 和 `@Qualifier` 区分。
- 故意制造循环依赖，观察报错信息。
- 用接口替换实现类，体会依赖倒置。

### 生命周期

Bean 生命周期至少要掌握下面的顺序：

1. 实例化对象。
2. 填充依赖属性。
3. 执行 Aware 回调。
4. 执行 BeanPostProcessor 前置处理。
5. 执行初始化方法。
6. 执行 BeanPostProcessor 后置处理。
7. 容器关闭时执行销毁逻辑。

## 必做练习

- 写一个 `PaymentService` 接口和两个实现：`AliPayService`、`WechatPayService`。
- 用 `@Qualifier` 指定注入其中一个实现。
- 写一个配置类，通过 `@Bean` 注册第三方工具类。
- 给一个 Bean 添加 `@PostConstruct` 和 `@PreDestroy`，观察日志。
- 写一个简单的 `BeanPostProcessor`，在 Bean 初始化前后打印 Bean 名称。

## 验收标准

- 能解释“控制反转”到底反转了什么。
- 能说明为什么推荐构造器注入。
- 能定位 `NoSuchBeanDefinitionException`、`NoUniqueBeanDefinitionException` 的常见原因。
- 能区分组件扫描注册和配置类 `@Bean` 注册。

## 常见误区

- 误区：所有类都要加 `@Component`。
  纠正：只有需要容器管理生命周期、依赖注入或框架增强的类才需要注册。

- 误区：字段注入最方便，所以默认使用字段注入。
  纠正：字段注入隐藏依赖，不利于测试和构造期校验。

- 误区：singleton 就是 JVM 全局唯一。
  纠正：Spring singleton 通常指同一个容器里的单例。


