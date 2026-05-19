# 03-Java 基础高频清单

## Java 基础为什么高频

Java 基础决定你能不能读懂框架、写出稳定代码。很多 Spring、MyBatis、并发问题，最后都会回到对象、集合、异常、泛型和反射。

## 必会问题

- 基本类型和包装类型有什么区别。
- `String` 为什么不可变。
- `StringBuilder` 和 `StringBuffer` 区别。
- `ArrayList` 和 `LinkedList` 区别。
- `HashMap` 原理和扩容。
- `equals` 和 `hashCode` 的关系。
- 泛型和类型擦除。
- 异常体系。
- lambda 和 Stream 适用场景。
- 反射和注解的作用。

## 回答模板：HashMap

```text
HashMap 是基于哈希表的数据结构，用来按 key 快速存取 value。它通过 key 的 hash 定位桶位，冲突时使用链表或树结构处理。需要注意 key 的 equals 和 hashCode 必须一致，否则可能出现相同业务对象取不到值的问题。项目里如果用对象作为 Map key，要保证这两个方法正确实现。
```

## 容易出错的示例

### 错误示例：只重写 equals，不重写 hashCode

```java
class 用户 {
    private Long id;

    @Override
    public boolean equals(Object obj) {
        return obj instanceof 用户 用户 && id.equals(用户.id);
    }
}
```

### 为什么错

放入 `HashMap` 或 `HashSet` 时，hashCode 不一致会导致相等对象落到不同桶里。

### 正确做法

`equals` 和 `hashCode` 一起重写。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 基本类型 | 表达基础数据 | 性能直接，无对象开销 | 注意包装类型判空 | 重点是拆箱 NPE |
| String | 保存不可变文本 | 线程安全，适合常量 | 拼接多用 `StringBuilder` | 难点是常量池 |
| 集合 | 存储和操作对象 | 业务代码高频使用 | 按查询、顺序、去重选集合 | 重点是复杂度 |
| 泛型 | 提供类型约束 | 减少强转错误 | 集合优先写泛型 | 难点是类型擦除 |
| 异常 | 表达失败 | 让错误可处理 | 业务异常和系统异常分开 | 重点是不要吞异常 |

## 本节练习

- 手写一个 `equals/hashCode` 示例。
- 解释 `ArrayList` 扩容。
- 写 3 个 Stream 使用场景和 2 个不适合场景。
- 整理 Java 基础 20 个问题。

## 本节通过标准

- 能用自己的话讲集合区别。
- 能解释常见基础 API 的使用场景。
- 能举出项目中的错误处理例子。
- 能把基础知识和框架底层联系起来。
