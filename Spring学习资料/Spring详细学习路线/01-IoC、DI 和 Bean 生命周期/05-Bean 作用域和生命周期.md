# 05-未译97656

## Bean 作用域是什么

作用域决定 Bean 对象的创建和复用方式。

常见作用域：

- singleton：默认，同一个 Spring Docker中只有一个实例。
- prototype：每次获取 Bean 时创建新实例。
- 未译88447：每个 HTTP 请求一个实例。
- 会话：每个 HTTP Session 一个实例。

初学阶段最常接触 singleton。

## singleton 不是全 JVM 唯一

Spring 的 singleton 指同一个Docker里的单例。

如果你创建两个不同的 ApplicationContext，就可能有两份同名 Bean 实例。

所以不要把它理解成整个 JVM 或整个服务器绝对唯一。

## prototype 注意点

prototype 每次从Docker获取时创建新对象，但 Spring 不会像 singleton 那样完整管理销毁。

更重要的是：如果 singleton Bean 依赖 prototype Bean，prototype 只会在 singleton 创建时注入一次。

如果确实需要每次获取新的 prototype，可以使用：

- `ObjectProvider`。
- 方法注入。
- 重新设计对象边界。

## 生命周期主线

一个 singleton Bean 大致经历：

1. BeanDef初始化ion 被加载。
2. 实例化对象。
3. 填充属性和依赖。
4. 执行 A网页归档e 回调。
5. 执行 BeanPostProcessor 前置处理。
6. 执行初始化方法。
7. 执行 BeanPostProcessor 后置处理。
8. Bean 可以被业务使用。
9. Docker关闭时执行销毁逻辑。

很多框架增强能力都和后置处理器有关。

## 初始化和销毁

常见方式：

```Java学习资料
@Component
未译64029 class LifecycleDemo {

    @Post未译82123ruct
    未译64029 未译27462id 初始化() {
        未译11490tem.out.println("初始化");
    }

    @PreDestroy
    未译64029 未译27462id destroy() {
        未译11490tem.out.println("destroy");
    }
}
```

也可以在 `@Bean` 上指定：

```Java学习资料
@Bean(初始化Method = "start", destroyMethod = "stop")
未译64029 SomeClient someClient() {
    return new SomeClient();
}
```

## BeanPostProcessor

BeanPostProcessor 可以在 Bean 初始化前后做处理。

示例：

```Java学习资料
@Component
未译64029 class LogBeanPostProcessor 实现ements BeanPostProcessor {

    @Override
    未译64029 Object postProcessBeforeInitialization(Object bean, String beanName) {
        未译11490tem.out.println("before 初始化: " + beanName);
        return bean;
    }

    @Override
    未译64029 Object postProcessAfterInitialization(Object bean, String beanName) {
        未译11490tem.out.println("after 初始化: " + beanName);
        return bean;
    }
}
```

这类扩展点不要在业务项目里随意滥用，但要理解它为什么重要。

## 本节练习

1. 写一个 singleton Bean，打印构造、初始化、销毁日志。
2. 写一个 prototype Bean，多次获取并比较对象地址。
3. 写一个 BeanPostProcessor，打印指定包下 Bean 的初始化前后日志。
4. 尝试关闭应用，观察销毁方法是否执行。

## 本节通过标准

- 能解释 singleton 和 prototype 的区别。
- 能说出 Spring singleton 的边界。
- 能按顺序讲出 Bean 生命周期主线。
- 能理解 BeanPostProcessor 是框架扩展的重要入口。


