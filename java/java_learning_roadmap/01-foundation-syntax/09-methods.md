# 09-方法、参数、返回值、重载和递归

## 方法是什么

方法就是一段可以重复使用的代码。

如果所有逻辑都写在 `main` 里，程序很快会变乱。方法可以把大问题拆成小问题。

## 最简单的方法

```java
public class MethodDemo {
    public static void main(String[] args) {
        sayHello();
    }

    public static void sayHello() {
        System.out.println("Hello");
    }
}
```

`main` 调用 `sayHello`，程序会跳到 `sayHello` 执行。

## 参数

参数是方法接收的输入。

```java
public static void printName(String name) {
    System.out.println("姓名：" + name);
}
```

调用：

```java
printName("小明");
```

## 返回值

返回值是方法计算后给调用方的结果。

```java
public static int add(int a, int b) {
    return a + b;
}
```

调用：

```java
int result = add(3, 5);
System.out.println(result);
```

## void

`void` 表示没有返回值。

```java
public static void printLine() {
    System.out.println("------------");
}
```

没有返回值的方法可以直接执行动作，例如打印、保存、修改状态。

## 方法命名

方法名应该表达动作：

- `calculateTotal`
- `printMenu`
- `findMax`
- `isAdult`
- `checkScore`

不要用：

- `aaa`
- `doIt`
- `test1`

## 方法重载

同一个类里，方法名相同，但参数不同，叫重载。

```java
public static int add(int a, int b) {
    return a + b;
}

public static double add(double a, double b) {
    return a + b;
}
```

Java 会根据传入参数选择对应方法。

## 递归

递归就是方法调用自己。

阶乘示例：

```java
public static int factorial(int n) {
    if (n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
```

调用：

```java
System.out.println(factorial(5)); // 120
```

递归必须有结束条件，否则会栈溢出。

## 什么时候拆方法

遇到这些情况就该拆：

- 一段代码超过 30 行。
- 同样逻辑复制了 2 次以上。
- 一个方法同时做很多事。
- `main` 方法越来越长。

示例：计算器可以拆成：

- `printMenu`
- `add`
- `subtract`
- `multiply`
- `divide`
- `readNumber`

## 本节练习

完成：

- `add(int a, int b)`
- `max(int a, int b)`
- `isEven(int number)`
- `printMultiplicationTable()`
- `factorial(int n)`
- 把简单计算器拆成多个方法。

## 本节通过标准

- 能定义和调用方法。
- 能使用参数和返回值。
- 能解释 `void`。
- 能写简单方法重载。
- 能理解递归必须有结束条件。
- 能把大段代码拆成小方法。

