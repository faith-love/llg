# 12-必须理解的核心概念

这一节把基础阶段最容易混淆的概念集中说明。不要死背，最好每个点都写代码验证。

## Java 是强类型语言

强类型意味着变量声明时要明确类型。

```java
int age = 18;
String name = "小明";
```

下面是不允许的：

```java
int age = "十八";
```

类型不匹配，编译就会报错。

## 基本类型保存值

```java
int a = 10;
int b = a;
b = 20;

System.out.println(a); // 10
System.out.println(b); // 20
```

`b = a` 是把 `a` 的值复制给 `b`。修改 `b` 不影响 `a`。

## 引用类型保存引用

数组是引用类型。

```java
int[] a = {1, 2, 3};
int[] b = a;

b[0] = 99;

System.out.println(a[0]); // 99
```

`a` 和 `b` 指向同一个数组，所以通过 `b` 修改后，`a` 看到的内容也变了。

## == 和 equals

基本类型用 `==` 比较值：

```java
int a = 10;
int b = 10;
System.out.println(a == b); // true
```

字符串内容用 `equals`：

```java
String a = new String("Java");
String b = new String("Java");
System.out.println(a.equals(b)); // true
```

不要用 `==` 判断字符串内容。

## 字符串不可变

```java
String text = "Java";
text = text + "!";
```

这里不是把原来的 `"Java"` 改了，而是创建了新的字符串，再让 `text` 指向新字符串。

频繁拼接字符串时，用 `StringBuilder`：

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(" ");
builder.append("Java");
System.out.println(builder.toString());
```

基础阶段知道这个结论即可，后面会更深入。

## 方法调用和栈

方法调用时，Java 会记录当前方法执行到哪里，再进入被调用方法。

```java
public static void main(String[] args) {
    a();
}

public static void a() {
    b();
}

public static void b() {
    System.out.println("b");
}
```

执行顺序：

```text
main -> a -> b
```

`b` 执行完回到 `a`，`a` 执行完回到 `main`。

## 递归必须有结束条件

错误递归：

```java
public static void loop() {
    loop();
}
```

这会一直调用自己，最终栈溢出。

正确递归：

```java
public static int sum(int n) {
    if (n == 1) {
        return 1;
    }
    return n + sum(n - 1);
}
```

`n == 1` 就是结束条件。

## 编译错误和运行错误

编译错误：代码还没运行，编译时就发现问题。

例子：

```java
int age = "18";
```

运行错误：代码能编译，但运行时出问题。

例子：

```java
int a = 10 / 0;
```

学习时要区分这两类错误。

## 本节练习

分别写代码验证：

- 基本类型赋值后互不影响。
- 数组引用赋值后会互相影响。
- 字符串 `==` 和 `equals` 的区别。
- 一个编译错误。
- 一个运行错误。
- 一个有结束条件的递归。

## 本节通过标准

- 能解释强类型。
- 能解释基本类型和引用类型。
- 能正确使用 `==` 和 `equals`。
- 知道字符串不可变。
- 能区分编译错误和运行错误。

