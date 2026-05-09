# 05-基本类型

## 什么是基本类型

基本类型保存的是简单的值，例如整数、小数、字符、真假。

Java 有 8 种基本类型：

| 类型 | 含义 | 示例 |
| --- | --- | --- |
| `byte` | 很小的整数 | `byte b = 10;` |
| `short` | 小整数 | `short s = 100;` |
| `int` | 常用整数 | `int age = 18;` |
| `long` | 大整数 | `long count = 100000L;` |
| `float` | 单精度小数 | `float price = 9.9F;` |
| `double` | 常用小数 | `double score = 98.5;` |
| `char` | 单个字符 | `char level = 'A';` |
| `boolean` | 真或假 | `boolean passed = true;` |

初学最常用的是：

- `int`
- `long`
- `double`
- `char`
- `boolean`

## 变量声明

变量就是给一个值起名字。

```java
int age = 18;
double price = 19.9;
boolean isStudent = true;
```

结构是：

```text
类型 变量名 = 值;
```

## int 和 long

`int` 是最常用整数类型。

```java
int age = 20;
int count = 100;
```

如果数字很大，用 `long`，并在数字后加 `L`：

```java
long population = 1400000000L;
```

建议用大写 `L`，不要用小写 `l`，因为小写容易和数字 `1` 混淆。

## float 和 double

小数默认是 `double`。

```java
double price = 12.5;
```

如果要写 `float`，后面加 `F`：

```java
float score = 98.5F;
```

初学阶段，小数优先使用 `double`。

## char

`char` 表示单个字符，用单引号：

```java
char grade = 'A';
char gender = '男';
```

注意：

- 单个字符用单引号。
- 字符串用双引号。

```java
char c = 'A';
String s = "A";
```

## boolean

`boolean` 只有两个值：

```java
boolean passed = true;
boolean deleted = false;
```

常用于判断：

```java
boolean isAdult = age >= 18;
```

## 类型转换

### 自动类型转换

小范围类型可以自动转成大范围类型：

```java
int a = 10;
long b = a;
double c = b;
```

### 强制类型转换

大范围类型转小范围类型，需要强制转换，可能丢失数据：

```java
double price = 19.9;
int intPrice = (int) price;

System.out.println(intPrice); // 19
```

小数部分会被截掉，不是四舍五入。

## 整数除法

这是小白高频坑：

```java
int a = 5;
int b = 2;
System.out.println(a / b); // 2
```

因为两个整数相除，结果仍然是整数。

如果想得到小数：

```java
int a = 5;
int b = 2;
System.out.println(a * 1.0 / b); // 2.5
```

## 本节练习

写 `BasicTypeDemo`：

- 定义姓名、年龄、身高、是否学生、成绩等级。
- 输出这些变量。
- 计算两个整数相除的结果。
- 再改成小数结果。

示例：

```java
public class BasicTypeDemo {
    public static void main(String[] args) {
        int age = 18;
        double height = 1.75;
        boolean student = true;
        char grade = 'A';

        System.out.println(age);
        System.out.println(height);
        System.out.println(student);
        System.out.println(grade);
    }
}
```

## 本节通过标准

- 能说出 8 种基本类型。
- 能正确声明变量。
- 能解释 `int` 除法为什么可能丢小数。
- 能区分单引号字符和双引号字符串。

