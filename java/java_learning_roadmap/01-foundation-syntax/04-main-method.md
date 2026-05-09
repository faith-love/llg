# 04-程序入口 main 方法

## main 方法是什么

Java 程序需要一个入口。入口就是程序开始执行的地方。

最常见入口写法：

```java
public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
```

运行这个类时，Java 会从 `main` 方法里的第一行代码开始执行。

## main 方法逐词解释

```java
public static void main(String[] args)
```

先不用背得很深，但要知道大概意思：

- `public`：公开的，Java 运行环境能访问它。
- `static`：静态的，不需要先创建对象就能运行。
- `void`：没有返回值。
- `main`：固定入口方法名。
- `String[] args`：命令行参数，先了解即可。

## 类名和文件名

如果代码是：

```java
public class HelloJava {
}
```

文件名必须是：

```text
HelloJava.java
```

这是 Java 的基本规则。

## 执行顺序

示例：

```java
public class RunOrderDemo {
    public static void main(String[] args) {
        System.out.println("第一行");
        System.out.println("第二行");
        System.out.println("第三行");
    }
}
```

输出：

```text
第一行
第二行
第三行
```

默认情况下，代码从上到下执行。

## 命令行参数

`String[] args` 可以接收命令行传入的参数。

```java
public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println("参数个数：" + args.length);

        for (int i = 0; i < args.length; i++) {
            System.out.println("第 " + i + " 个参数：" + args[i]);
        }
    }
}
```

执行：

```powershell
javac ArgsDemo.java
java ArgsDemo Java SQL Spring
```

输出会包含 3 个参数。

初学阶段不常用命令行参数，但要知道它是什么。

## 常见错误

### 写成 Main

错误：

```java
public static void Main(String[] args) {
}
```

`main` 必须小写。

### 少了 static

错误：

```java
public void main(String[] args) {
}
```

作为程序入口时，标准写法需要 `static`。

### 类名和文件名不一致

错误：

```text
文件名：Hello.java
类名：public class HelloJava
```

公开类名和文件名必须一致。

## 本节练习

完成 3 个类：

1. `HelloJava`：输出一句欢迎语。
2. `RunOrderDemo`：输出 3 行内容，观察执行顺序。
3. `ArgsDemo`：打印命令行参数数量。

## 本节通过标准

- 能不看资料写出标准 `main` 方法。
- 能解释程序从哪里开始执行。
- 能区分类名和文件名。
- 能看懂最基础的运行错误。

