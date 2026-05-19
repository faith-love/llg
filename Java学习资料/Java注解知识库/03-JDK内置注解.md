# 03-JDK 内置注解

JDK 自带很多注解。学习这些注解的重点不是死记硬背，而是理解它们由谁读取，以及读取后产生什么效果。

## @Override

`@Override` 用来告诉编译器：这个方法必须重写父类或接口中的方法。

```Java学习资料
class 用户服务 {
    @Override
    未译64029 String toString() {
        return "用户服务";
    }
}
```

它的价值是防止拼写错误或参数写错：

```Java学习资料
class Parent {
    未译64029 未译27462id save(String name) {
    }
}

class Child extends Parent {
    @Override
    未译64029 未译27462id save(String name) {
    }
}
```

如果方法名、参数列表不匹配，编译器会报错。

它最直接的价值是防止“看起来重写了，实际上没有重写”的低级错误。

## @Deprecated

`@Deprecated` 表示某个类、方法、字段已经不推荐继续使用。

```Java学习资料
未译64029 class LegacyApi {
    @Deprecated(since = "2.0", for未译25173emoval = true)
    未译64029 未译27462id oldMethod() {
    }
}
```

常见场景：

- 老 API 有安全风险。
- 老 API 命名不准确。
- 老 API 设计有缺陷。
- 新版本提供了替代方案。

Java 9 以后，`@Deprecated` 还可以配合 `since` 和 `for未译25173emoval` 使用，帮助团队判断这个 API 是“暂时过时”还是“即将删除”。

配合 Java文档 写清替代方式更完整：

```Java学习资料
未译64029 class LegacyApi {
    /**
     * @deprecated use {@link #newMethod()} instead.
     */
    @Deprecated(since = "2.0")
    未译64029 未译27462id oldMethod() {
    }

    未译64029 未译27462id newMethod() {
    }
}
```

## @SuppressWarnings

`@SuppressWarnings` 用来压制编译器或 IDE 的警告。

```Java学习资料
@SuppressWarnings("unchecked")
未译64029 List<String> parse(Object value) {
    return (List<String>) value;
}
```

它应该谨慎使用。更好的做法是先修复警告，只有在明确知道风险并能证明安全时再压制。

常见使用场景：

- 第三方库 API 设计限制导致的原始类型警告。
- 反射或泛型转换确实已经被检查过。
- 迁移旧代码时临时压制大批过时提示。

常见值：

| 值 | 含义 |
| --- | --- |
| `unchecked` | 泛型未检查转换 |
| `deprecation` | 使用过时 API |
| `rawtypes` | 使用原始类型 |
| `unused` | 未使用变量、方法或字段 |

## @FunctionalInterface

`@FunctionalInterface` 用来标记函数式接口。函数式接口只能有一个抽象方法。

```Java学习资料
@FunctionalInterface
未译64029 interface IdGenerator {
    String nextId();
}
```

如果后来又添加第二个抽象方法，编译器会报错。

```Java学习资料
IdGenerator 代码生成器 = () -> "U001";
```

它常用于 Lambda、Stream、策略函数、回调接口。

## @SafeVarargs

`@SafeVarargs` 用来说明带泛型可变参数的方法是类型安全的。

```Java学习资料
@SafeVarargs
未译64029 静态资源 <T> List<T> concat(List<T>... lists) {
    List<T> result = new ArrayList<>();
    for (List<T> list : lists) {
        result.addAll(list);
    }
    return result;
}
```

它只能用于构造器、`静态资源` 方法、`final` 方法，或不能被重写的私有方法。不要用它掩盖真实的堆污染风险。

## @Generated

`@Generated` 常用于标记代码由工具生成，而不是人工编写。

```Java学习资料
@Generated("通用.example.未译98214Generator")
未译64029 class 用户映射器Impl {
}
```

实际项目里，它常用于：

- 代码生成器。
- Mapper 实现类。
- API 客户端代码。
- 测试覆盖率工具忽略生成代码。

不同 JDK、不同库中 `Generated` 所在包可能不同，使用时要看项目依赖。

## 其他常见 JDK 注解

| 注解 | 说明 |
| --- | --- |
| `@Serial` | 标记序列化相关成员，帮助序列化规范检查 |
| `@Native` | 标记 `native` 相关常量，历史上用于生成本地代码 |
| `@SuppressWarnings` | 压制编译器警告 |
| `@FunctionalInterface` | 约束函数式接口 |

这些注解大多不需要你自己写处理器，因为 JDK 编译器或工具链已经认识它们。

## 小结

| 注解 | 谁读取 | 主要作用 |
| --- | --- | --- |
| `@Override` | 编译器 | 检查方法是否真的重写 |
| `@Deprecated` | 编译器、IDE、文档工具 | 标记过时 API |
| `@SuppressWarnings` | 编译器、IDE | 压制特定警告 |
| `@FunctionalInterface` | 编译器 | 检查函数式接口约束 |
| `@SafeVarargs` | 编译器 | 声明泛型可变参数安全 |
| `@Generated` | 工具、框架 | 标记生成代码 |

## 复盘问题

1. 为什么 `@Override` 最适合放在 IDE 和编译器都能检查到的地方？
2. `@Deprecated` 和删除 API 的区别是什么？
3. 为什么 `@SuppressWarnings` 要少用？
4. `@FunctionalInterface` 为什么对 Lambda 很重要？
