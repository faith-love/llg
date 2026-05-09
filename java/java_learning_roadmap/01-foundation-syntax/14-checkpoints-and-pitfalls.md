# 14-通过标准和常见坑

## 阶段通过标准

完成这一阶段后，你应该能做到：

- 不查资料写出 50 行以内的控制台程序。
- 能解释基本类型和引用类型的区别。
- 能正确使用循环和数组。
- 能把一个大方法拆成 3-5 个小方法。
- 能用 `Scanner` 做基础输入。
- 能用 Git 保存每次练习结果。
- 能读懂基础编译错误和运行错误。

## 自查问题

| 问题 | 是/否 |
| --- | --- |
| 我能独立写 `main` 方法吗？ |  |
| 我能解释 `int`、`double`、`boolean` 的用途吗？ |  |
| 我知道字符串比较为什么用 `equals` 吗？ |  |
| 我能写 `if else` 成绩判断吗？ |  |
| 我能写 `for` 循环和 `while` 循环吗？ |  |
| 我能遍历数组吗？ |  |
| 我能写一个简单菜单程序吗？ |  |
| 我有 30 个以上练习吗？ |  |

## 常见坑 1：`=` 和 `==` 混用

`=` 是赋值：

```java
int age = 18;
```

`==` 是比较：

```java
if (age == 18) {
    System.out.println("18岁");
}
```

## 常见坑 2：字符串用 `==` 比较

错误：

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);
```

正确：

```java
System.out.println(a.equals(b));
```

## 常见坑 3：整数除法丢小数

```java
int a = 5;
int b = 2;
System.out.println(a / b); // 2
```

想得到 2.5：

```java
System.out.println(a * 1.0 / b);
```

## 常见坑 4：数组越界

```java
int[] arr = {1, 2, 3};
System.out.println(arr[3]);
```

数组长度是 3，下标只有 0、1、2。

正确循环：

```java
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
```

## 常见坑 5：死循环

```java
int i = 1;
while (i <= 10) {
    System.out.println(i);
}
```

`i` 没有变化，会一直循环。

修复：

```java
int i = 1;
while (i <= 10) {
    System.out.println(i);
    i++;
}
```

## 常见坑 6：递归没有结束条件

错误：

```java
public static void run() {
    run();
}
```

递归必须有停止条件。

## 常见坑 7：`nextInt` 和 `nextLine` 混用

`nextInt()` 后面可能留下换行，导致后面的 `nextLine()` 直接读到空字符串。

修复：

```java
int age = scanner.nextInt();
scanner.nextLine();
String name = scanner.nextLine();
```

## 常见坑 8：所有代码都写在 main 里

`main` 太长会很难维护。

差的结构：

```java
public static void main(String[] args) {
    // 200 行代码
}
```

更好的结构：

```java
public static void main(String[] args) {
    printMenu();
    int choice = readChoice();
    handleChoice(choice);
}
```

## 阶段毕业练习

写一个“简单 ATM”作为阶段毕业练习。

必须包含：

- 循环菜单。
- 查询余额。
- 存款。
- 取款。
- 退出。
- 非法输入处理。
- 至少 4 个方法。

通过标准：

- 程序能持续运行直到选择退出。
- 金额不能为负数。
- 取款不能超过余额。
- 代码不是全部堆在 `main` 方法里。

## 下一阶段准备

如果你完成了本阶段，就可以进入 `02-面向对象和核心 API`。

进入前确认：

- 基础语法不再频繁卡住。
- 能写小程序。
- 知道哪里该拆方法。
- 对类和对象有初步感觉。

