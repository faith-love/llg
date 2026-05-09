# 07-内部类、匿名类和枚举

## 内部类

内部类是定义在另一个类里面的类。

```java
public class Outer {
    private String name = "outer";

    public class Inner {
        public void print() {
            System.out.println(name);
        }
    }
}
```

初学阶段不需要大量使用内部类，只要能看懂即可。

## 静态内部类

静态内部类常用于把强相关的小类型放在一起。

```java
public class Result {
    public static class Error {
        private String code;
        private String message;
    }
}
```

## 匿名类

匿名类是没有名字的类，常用于临时实现接口。

```java
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("执行任务");
    }
};
```

后面学 Lambda 后，这类代码经常可以简化。

## 枚举

枚举用于表示固定的一组值。

不要用字符串硬写状态：

```java
String status = "BORROWED";
```

更好的写法：

```java
public enum BookStatus {
    AVAILABLE,
    BORROWED,
    LOST
}
```

使用：

```java
BookStatus status = BookStatus.AVAILABLE;
```

## 带字段的枚举

```java
public enum BookStatus {
    AVAILABLE("可借"),
    BORROWED("已借出"),
    LOST("丢失");

    private final String description;

    BookStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
```

## 枚举适合什么场景

适合：

- 订单状态。
- 用户角色。
- 图书状态。
- 支付状态。
- 星期。

不适合：

- 会频繁动态增加的数据。
- 来自数据库的大量配置项。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 内部类 | 把紧密相关的类放在一起 | 避免命名污染，表达关联关系 | 只有强相关时再用 | 难点是语法嵌套，重点是结构表达 |
| 匿名类 | 临时实现接口或父类 | 需要一次性行为时更直接 | 适合一次性回调或任务 | 重点是读懂旧代码，后面常被 Lambda 替代 |
| 枚举 | 表示固定有限状态 | 比字符串常量更安全，不易写错 | 状态、角色、类型优先用枚举 | 难点是带字段枚举的写法，重点是固定集合的表达 |
| 枚举字段 | 给状态附加说明 | 让状态更易读、更可展示 | 用 `final` 保存说明文本 | 重点是状态和值分离，避免到处写魔法字符串 |

## 本节练习

完成：

- `BookStatus` 枚举：`AVAILABLE`、`BORROWED`、`LOST`。
- 给每个状态添加中文描述。
- 在 `Book` 类中使用 `BookStatus` 替代 `boolean borrowed`。
- 写一个匿名类实现 `Runnable`。

## 本节通过标准

- 能看懂内部类。
- 能写一个简单匿名类。
- 能使用枚举表示固定状态。
- 能解释为什么枚举比字符串状态更安全。
