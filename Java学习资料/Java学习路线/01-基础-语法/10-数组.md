# 10-数组

## 数组是什么

数组用来保存一组相同类型的数据。

如果没有数组，保存 5 个成绩可能要写：

```java
int score1 = 90;
int score2 = 80;
int score3 = 70;
int score4 = 85;
int score5 = 95;
```

使用数组：

```java
int[] scores = {90, 80, 70, 85, 95};
```

## 创建数组

方式 1：直接给值。

```java
int[] scores = {90, 80, 70};
```

方式 2：先指定长度。

```java
int[] scores = new int[3];
scores[0] = 90;
scores[1] = 80;
scores[2] = 70;
```

## 下标

数组下标从 0 开始。

```java
int[] scores = {90, 80, 70};

System.out.println(scores[0]); // 90
System.out.println(scores[1]); // 80
System.out.println(scores[2]); // 70
```

访问 `scores[3]` 会越界，因为长度是 3，最大下标是 2。

## 长度

```java
int[] scores = {90, 80, 70};
System.out.println(scores.length);
```

注意是 `length`，不是 `length()`。

## 遍历数组

使用 `for`：

```java
int[] scores = {90, 80, 70};

for (int i = 0; i < scores.length; i++) {
    System.out.println(scores[i]);
}
```

使用增强 `for`：

```java
for (int score : scores) {
    System.out.println(score);
}
```

如果需要下标，用普通 `for`；如果只需要值，用增强 `for`。

## 最大值

```java
int[] scores = {90, 80, 70, 95};
int max = scores[0];

for (int i = 1; i < scores.length; i++) {
    if (scores[i] > max) {
        max = scores[i];
    }
}

System.out.println(max);
```

思路：

1. 先假设第一个是最大值。
2. 从第二个开始比较。
3. 遇到更大的就更新。

## 求和和平均值

```java
int[] scores = {90, 80, 70};
int sum = 0;

for (int score : scores) {
    sum += score;
}

double avg = sum * 1.0 / scores.length;
System.out.println(avg);
```

注意 `sum * 1.0`，避免整数除法。

## 二维数组

二维数组可以理解成表格。

```java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};

System.out.println(matrix[0][0]); // 1
System.out.println(matrix[1][2]); // 6
```

遍历：

```java
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

## 本节练习

完成：

- 输出数组所有元素。
- 求最大值。
- 求最小值。
- 求总和和平均值。
- 统计及格人数。
- 反转数组。
- 二维数组打印表格。

## 本节通过标准

- 能创建和访问数组。
- 知道下标从 0 开始。
- 能避免数组越界。
- 能遍历数组。
- 能写最大值、最小值、平均值。
- 能看懂二维数组的行列结构。

