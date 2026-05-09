# 15-反射和注解

## 为什么要学反射和注解

Spring 大量使用反射和注解。

例如：

- `@Controller`
- `@Service`
- `@Autowired`
- `@Transactional`

小白阶段不需要深入 Spring 源码，但要知道这些机制大概是什么。

## 反射是什么

反射允许程序在运行时获取类的信息。

例如获取类名：

```java
Class<Book> clazz = Book.class;
System.out.println(clazz.getName());
```

## 获取字段

```java
Field[] fields = Book.class.getDeclaredFields();

for (Field field : fields) {
    System.out.println(field.getName());
}
```

## 获取方法

```java
Method[] methods = Book.class.getDeclaredMethods();

for (Method method : methods) {
    System.out.println(method.getName());
}
```

## 创建对象

```java
Constructor<Book> constructor = Book.class.getConstructor(String.class, String.class);
Book book = constructor.newInstance("978711", "Java 入门");
```

反射可以绕过普通代码的直接调用方式，所以要谨慎使用。

## 注解是什么

注解是给代码添加的元信息。

```java
@Override
public String toString() {
    return title;
}
```

`@Override` 告诉编译器：这个方法应该是重写父类方法。

## 自定义注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface TableName {
    String value();
}
```

使用：

```java
@TableName("books")
public class Book {
}
```

## 注解保留策略

| 策略 | 含义 |
| --- | --- |
| `SOURCE` | 只在源码中存在，编译后没有 |
| `CLASS` | 编译后存在，运行时不一定能读 |
| `RUNTIME` | 运行时可以通过反射读取 |

Spring 常见注解通常需要运行时读取。

## 读取注解

```java
TableName tableName = Book.class.getAnnotation(TableName.class);
if (tableName != null) {
    System.out.println(tableName.value());
}
```

## 本节学习边界

现在只需要掌握：

- 反射能在运行时获取类、字段、方法、构造器。
- 注解能给代码添加元信息。
- 运行时注解可以通过反射读取。
- Spring 使用这些机制做自动装配、事务、接口映射等。

不需要现在深入：

- 字节码增强。
- 动态代理细节。
- Spring 容器源码。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 反射 | 运行时读取和操作类信息 | 框架可以不提前知道具体类也能工作 | 先用于读取信息，不要滥用修改私有字段 | 难点是运行时错误更多，重点是理解框架基础 |
| `Class` | 表示类的元信息 | 能拿到类名、字段、方法、构造器 | 用 `Book.class` 最直接 | 重点是它描述的是类本身，不是某个对象数据 |
| 注解 | 给代码添加元信息 | 让框架通过标记理解你的意图 | 注解名要表达语义，例如 `@TableName` | 难点是注解本身不执行逻辑 |
| 保留策略 | 决定注解保留到哪个阶段 | 解释为什么有些注解运行时读不到 | 需要反射读取就用 `RUNTIME` | 重点是 `SOURCE`、`CLASS`、`RUNTIME` 的区别 |
| Spring 注解基础 | 支撑自动装配、路由、事务等 | 少写大量手动配置 | 先理解“标记 + 扫描 + 反射处理” | 重点是注解是入口，真正逻辑在框架里 |

## 本节练习

完成：

- 打印 `Book` 的所有字段名。
- 打印 `Book` 的所有方法名。
- 定义 `@TableName` 注解。
- 给 `Book` 添加 `@TableName("books")`。
- 通过反射读取注解值。

## 本节通过标准

- 能解释反射是什么。
- 能获取类名、字段名、方法名。
- 能定义简单注解。
- 能解释 `SOURCE`、`CLASS`、`RUNTIME`。
- 能说明 Spring 为什么会大量使用注解。
