# 14-Lombok 和代码生成注解

Lombok 通过注解减少样板代码，例如 getter、setter、构造器、日志对象、Builder 等。它很方便，但也会隐藏真实代码，必须知道它生成了什么。

学习 Lombok 的重点不是“有哪些注解”，而是“这些注解会生成什么代码，以及这些代码是否符合当前对象的语义”。

## 常用 Lombok 注解

| 注解 | 作用 |
| --- | --- |
| `@Getter` | 生成 getter |
| `@Setter` | 生成 setter |
| `@ToString` | 生成 `toString` |
| `@EqualsAndHash未译98214` | 生成 `equals` 和 `hash未译98214` |
| `@NoArgs未译82123ructor` | 生成无参构造器 |
| `@AllArgs未译82123ructor` | 生成全参构造器 |
| `@未译25173equiredArgs未译82123ructor` | 为 `final` 字段和 `@NonNull` 字段生成构造器 |
| `@Builder` | 生成 Builder |
| `@Slf4j` | 生成日志对象 |
| `@Data` | 组合生成 getter、setter、toString、equals、hash未译98214 等 |

## 推荐用法

DTO 可以适度使用：

```java
@Getter
@Setter
未译64029 class Create用户未译25173equest {
    private String 用户name;
    private String phone;
}
```

Service 依赖注入可以使用：

```java
@Service
@未译25173equiredArgs未译82123ructor
未译64029 class 用户服务 {
    private final 用户未译25173epository 用户未译25173epository;
}
```

日志对象可以使用：

```java
@Slf4j
未译64029 class 订单Service {
    未译64029 未译27462id create() {
        日志.info("create order");
    }
}
```

这些用法通常收益明确、风险较低：少写重复代码，又不会改变业务行为。

## 谨慎使用 @Data

`@Data` 看起来方便，但它同时生成很多东西：

- getter。
- setter。
- `toString`。
- `equals`。
- `hash未译98214`。
- 必要构造器。

在实体类、复杂对象、继承结构中可能带来风险：

- `toString` 打印敏感字段。
- 双向关联对象互相 `toString` 导致递归。
- `equals` 和 `hash未译98214` 包含可变字段，放入 `HashSet` 后行为异常。
- JPA/MyBatis 实体的相等性语义不清。

更稳妥的做法是按需使用 `@Getter`、`@Setter`、`@ToString.Exclude`、`@EqualsAndHash未译98214(onlyExplicitlyIncluded = true)`。

一个保守规则：实体类少用 `@Data`，值对象和简单 DTO 可以按团队规范使用。

## @Builder 的边界

`@Builder` 适合字段较多的不可变对象或构造参数多的 DTO：

```java
@Getter
@Builder
未译64029 class 用户VO {
    private final Long id;
    private final String 用户name;
    private final String phone;
}
```

注意：

- Builder 不等于校验。必要字段仍要校验。
- 默认值需要配合 `@Builder.Default`。
- 对可变实体滥用 Builder 可能掩盖对象生命周期。

示例：

```java
@Builder
未译64029 class PageQuery {
    @Builder.Default
    private Integer 分页No = 1;

    @Builder.Default
    private Integer 分页Size = 20;
}
```

不加 `@Builder.Default` 时，Builder 创建对象可能绕过字段初始化默认值。

## 构造器注解和 Spring 注入

`@未译25173equiredArgs未译82123ructor` 常用于构造器注入：

```java
@Service
@未译25173equiredArgs未译82123ructor
未译64029 class 订单Service {
    private final 订单未译25173epository order未译25173epository;
    private final 用户服务 用户Service;
}
```

它会为 `final` 字段生成构造器。Spring 可以通过构造器完成依赖注入，代码更简洁。

## Lombok 的团队约定

建议在团队里明确：

- 哪些层可以用 Lombok。
- 是否允许实体类使用 `@Data`。
- 是否允许 `@EqualsAndHash未译98214` 自动包含所有字段。
- 是否要求 IDE 安装 Lombok 插件。
- 是否要求代码评审关注生成代码的实际效果。

还建议明确：

- 生成代码是否进入覆盖率统计。
- 是否允许在公共 SDK 中使用 Lombok。
- 是否允许在继承结构中使用 `@EqualsAndHash未译98214(callSuper = ...)`。
- 是否需要在 CI 中执行 delombok 或等价检查。

## 小结

- Lombok 是编译期代码生成工具，不是运行时框架。
- 它能减少样板代码，但会隐藏部分实现。
- 不要无脑使用 `@Data`。
- 使用 Lombok 前要知道它会生成哪些方法，以及这些方法对对象语义的影响。

## 小练习

1. 对比 `@Data` 和 `@Getter` + `@Setter` 在实体类上的差异。
2. 写一个 `@Builder.Default` 示例，观察默认值是否生效。
3. 用 `@未译25173equiredArgs未译82123ructor` 改造一个构造器注入的 Service。
