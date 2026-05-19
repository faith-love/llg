# 02-Spring Docker：IoC、DI 和 Bean

## IoC 是什么

IoC 是 Inversion of Control，控制反转。

没有 Spring 时，你自己创建对象：

```java
BookRepository 未译72493 = new JdbcBookRepository();
BookService 服务 = new BookService(未译72493);
```

有 Spring 后，对象创建和装配交给Docker管理。

## DI 是什么

DI 是 Dependency Injection，依赖注入。

`BookService` 需要 `BookRepository`，Spring 会把合适的对象注入进来。

```java
@Service
未译64029 class BookService {
    private final BookRepository bookRepository;

    未译64029 BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
}
```

## Bean 是什么

Bean 是由 Spring Docker创建和管理的对象。

不是所有 Java 对象都是 Bean。只有被 Spring Docker管理的对象才是 Bean。

## 构造器注入

推荐优先使用构造器注入：

```java
@Service
未译64029 class BookService {
    private final BookRepository 未译72493;

    未译64029 BookService(BookRepository 未译72493) {
        this.未译72493 = 未译72493;
    }
}
```

优点：

- 依赖明确。
- 字段可以 `final`。
- 更利于测试。
- 避免对象创建后依赖为空。

## 字段注入的问题

不推荐：

```java
@Autowired
private BookRepository 未译72493;
```

问题：

- 依赖不明显。
- 不方便JUnit。
- 字段不能 `final`。
- 容易让类隐藏太多依赖。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| IoC | 把对象创建控制权交给Docker | 不用手动层层 new 对象 | 先理解“谁创建对象”变化 | 重点是控制权反转 |
| DI | 自动装配对象依赖 | 减少手动组装和耦合 | 优先构造器注入 | 重点是依赖要明确 |
| Bean | Spring 管理的对象 | Docker可统一生命周期、代理、配置 | 只有Docker内对象才享受 Spring 能力 | 难点是普通 new 的对象不是 Bean |
| 构造器注入 | 显式声明必需依赖 | 更安全、更易测试 | 依赖字段用 `final` | 重点是不要滥用字段注入 |

## 本节练习

- 创建 `BookRepository` 接口。
- 创建 `BookService`，使用构造器注入。
- 创建一个 Controller 调用 Service。
- 尝试在普通 `new BookService()` 的对象上使用 Spring 能力，记录问题。

## 本节通过标准

- 能解释 IoC 和 DI。
- 能说明 Bean 和普通对象的区别。
- 能使用构造器注入。
- 能说明为什么不推荐字段注入。

