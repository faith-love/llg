# 04-继承、方法重写和 super

## 继承是什么

继承表示“子类是一种父类”。

例如：

- `Dog` 是一种 `Animal`。
- `Cat` 是一种 `Animal`。

```java
public class Animal {
    public void eat() {
        System.out.println("动物吃东西");
    }
}

public class Dog extends Animal {
}
```

`Dog` 继承 `Animal` 后，可以使用 `eat()`。

## extends

Java 使用 `extends` 表示继承。

```java
public class Dog extends Animal {
}
```

Java 类只能单继承，也就是一个类只能有一个直接父类。

## 方法重写

子类可以重新定义父类方法。

```java
public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("狗吃狗粮");
    }
}
```

`@Override` 表示这是重写。建议始终写上，它能帮你发现方法名或参数写错。

## super

`super` 表示父类。

调用父类构造器：

```java
public class Animal {
    private String name;

    public Animal(String name) {
        this.name = name;
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
}
```

调用父类方法：

```java
@Override
public void eat() {
    super.eat();
    System.out.println("狗吃狗粮");
}
```

## 什么时候适合继承

适合继承：

- 子类确实是父类的一种。
- 子类能复用父类行为。
- 父类代表稳定的公共抽象。

不适合继承：

- 只是为了复用几行代码。
- 父子关系说不通。
- 父类变化会影响很多子类。

## 组合优先

很多时候，组合比继承更稳。

继承表达“是什么”：

```text
Dog 是 Animal
```

组合表达“有什么”：

```text
Car 有 Engine
```

不要为了省代码强行继承。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 继承 | 复用父类的公共能力 | 避免重复写相同字段和方法 | 先判断子类是不是父类的一种 | 重点是“是什么关系”，不是“省代码” |
| 方法重写 | 子类定制自己的行为 | 同一个方法在不同子类里表现不同 | 总是加 `@Override` | 难点是签名必须匹配，重点是行为可以不同但约定一致 |
| super | 访问父类实现 | 解决父类字段和方法的访问问题 | 构造器里优先用 `super(...)` | 重点是先初始化父类部分，再处理子类部分 |
| 组合优先 | 用成员变量复用能力 | 比滥用继承更稳定、更灵活 | 先想“我是不是拥有它” | 难点是控制建模冲动，重点是不要为了复用强行继承 |

## 本节练习

创建：

- `Animal`：字段 `name`，方法 `eat()`。
- `Dog extends Animal`：重写 `eat()`。
- `Cat extends Animal`：重写 `eat()`。

再创建：

- `Employee`：姓名、工资。
- `Manager extends Employee`：奖金。

## 本节通过标准

- 能解释继承表示什么关系。
- 能使用 `extends`。
- 能重写父类方法。
- 能解释 `@Override` 的作用。
- 能使用 `super` 调用父类构造器。
- 知道不要滥用继承。
