# 05-多态

## 多态是什么

多态可以理解为：同一个父类引用，指向不同子类对象时，调用同一个方法会表现出不同结果。

```java
Animal a1 = new Dog();
Animal a2 = new Cat();

a1.eat();
a2.eat();
```

如果 `Dog` 和 `Cat` 都重写了 `eat()`，输出会不同。

## 为什么需要多态

多态解决的是调用方稳定、实现方可替换的问题。

没有多态时：

```java
public void feedDog(Dog dog) {
    dog.eat();
}

public void feedCat(Cat cat) {
    cat.eat();
}
```

有多态后：

```java
public void feed(Animal animal) {
    animal.eat();
}
```

新增 `Bird` 时，不需要新增 `feedBird`。

## 父类引用指向子类对象

```java
Animal animal = new Dog();
```

这表示：

- 编译时看左边 `Animal`。
- 运行时执行右边真实对象 `Dog` 的重写方法。

## 向上转型

子类对象赋值给父类引用，叫向上转型。

```java
Dog dog = new Dog();
Animal animal = dog;
```

这是安全的，因为狗一定是动物。

## 向下转型

父类引用转回子类，叫向下转型。

```java
Animal animal = new Dog();
Dog dog = (Dog) animal;
```

向下转型有风险。转错会报 `ClassCastException`。

安全写法：

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
}
```

## 多态和接口

多态更常和接口一起用。

```java
public interface Payment {
    void pay(double amount);
}

public class AliPay implements Payment {
    public void pay(double amount) {
        System.out.println("支付宝支付：" + amount);
    }
}

public class WeChatPay implements Payment {
    public void pay(double amount) {
        System.out.println("微信支付：" + amount);
    }
}
```

调用方：

```java
public void checkout(Payment payment) {
    payment.pay(100);
}
```

调用方不关心具体支付方式。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 多态 | 用统一接口处理不同对象 | 减少重复代码，提升扩展性 | 让方法参数接收父类或接口 | 重点是调用方稳定，实现方可替换 |
| 父类引用 | 统一管理子类对象 | 不用为每个子类写一套方法 | 让集合里保存父类类型 | 难点是看懂编译期和运行期的差别 |
| 向上转型 | 子类对象当作父类用 | 简化方法参数和集合使用 | 默认安全，通常不需要强转 | 重点是“可以当成父类看”，但真实对象还是子类 |
| 向下转型 | 从父类引用拿回子类能力 | 只有需要子类特有方法时才用 | 先 `instanceof` 再强转 | 难点是容易转错，重点是安全检查 |
| 接口多态 | 一套调用方式适配多种实现 | 以后替换实现时改动更小 | 调用方依赖接口，不依赖实现类 | 重点是接口定义能力，实现类提供细节 |

## 本节练习

完成：

- `Animal`、`Dog`、`Cat`，使用父类引用调用子类方法。
- `Payment` 接口，两个实现类 `AliPay`、`WeChatPay`。
- 写一个 `checkout(Payment payment)` 方法。

## 本节通过标准

- 能解释多态的含义。
- 能写父类引用指向子类对象。
- 能说明为什么多态能减少重复代码。
- 能理解向上转型和向下转型。
- 能用接口实现简单多态。
