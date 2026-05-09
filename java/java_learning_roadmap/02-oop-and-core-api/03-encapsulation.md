# 03-封装、getter/setter 和不可变对象

## 封装是什么

封装就是把对象内部数据保护起来，只暴露必要的操作。

没有封装时，外部代码可以随便改字段：

```java
book.borrowed = false;
book.title = null;
```

这会让对象状态很容易被改坏。

## private

字段通常用 `private` 修饰。

```java
public class Book {
    private String isbn;
    private String title;
    private boolean borrowed;
}
```

`private` 表示只能在当前类内部访问。

## getter

getter 用来读取字段。

```java
public String getTitle() {
    return title;
}
```

## setter

setter 用来修改字段，但可以加校验。

```java
public void setTitle(String title) {
    if (title == null || title.isBlank()) {
        throw new IllegalArgumentException("标题不能为空");
    }
    this.title = title;
}
```

这比外部直接 `book.title = null` 更安全。

## 封装行为

封装不只是 getter/setter，更重要的是把业务行为放到对象里。

```java
public void borrow() {
    if (borrowed) {
        throw new IllegalStateException("图书已借出");
    }
    borrowed = true;
}

public void returnBook() {
    borrowed = false;
}
```

外部不需要知道 `borrowed` 怎么改，只调用方法即可。

## 不可变对象

不可变对象创建后不能修改。

```java
public final class BookId {
    private final String value;

    public BookId(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("ISBN 不能为空");
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
```

特点：

- 类可以用 `final`。
- 字段用 `private final`。
- 不提供 setter。
- 构造器完成校验。

## 小白先掌握的规则

- 字段默认写 `private`。
- 需要读取就写 getter。
- 需要修改才写 setter。
- setter 里可以做校验。
- 业务状态变化优先写成方法，例如 `borrow()`。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| private | 保护字段不被随便修改 | 防止对象状态被外部改坏 | 字段默认 private，先暴露方法再考虑字段 | 难点是习惯改变，重点是把修改权限收回来 |
| getter | 提供只读访问 | 外部可以看数据，但不直接碰内部实现 | 命名保持标准，例如 `getTitle` | 重点是只提供必要读取，不要无意义全开放 |
| setter | 安全修改字段 | 可以在修改前做校验 | 在 setter 里检查空值、非法范围 | 难点是区分“数据修改”和“业务行为”，重点是有些动作不该只是 setter |
| 行为封装 | 把规则放进对象内部 | 外部只调用方法，不直接改状态 | 例如 `borrow()`、`returnBook()` | 重点是对象要自己维护合法状态 |
| 不可变对象 | 创建后不允许修改 | 天然更安全，适合当值对象 | 用 `final` 字段和无 setter 设计 | 难点是初始化一次要到位，重点是减少后续修改风险 |

## 本节练习

改造 `Book`：

- 字段全部改成 `private`。
- 添加 getter。
- 标题和作者的 setter 要校验不能为空。
- 添加 `borrow()` 和 `returnBook()`。
- 如果图书已借出，再借出时抛出异常。

## 本节通过标准

- 能解释为什么字段不应该随便公开。
- 能写 getter 和 setter。
- 能在 setter 中加入校验。
- 能理解封装行为比暴露字段更可靠。
- 能写一个简单不可变类。
