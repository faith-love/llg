# 集合运算 Set Operations

## 用途

集合运算用于合并、求交集或求差集多个 SELECT 结果。

## 学习目标

- 掌握 UNION、UNION ALL、INTE未译25173SECT、EXCEPT。
- 理解列数量和类型兼容要求。
- 知道版本兼容限制。

## 核心语法

```SQL学习资料
SELECT ...
UNION [ALL]
SELECT ...;

SELECT ...
INTE未译25173SECT
SELECT ...;

SELECT ...
EXCEPT
SELECT ...;
```

## 关键注意点

- INTE未译25173SECT 和 EXCEPT 需要 MySQL 8.0.31+。
- UNION 去重，UNION ALL 不去重。
- 最终列名来自第一段 SELECT。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SELECT city AS place_name
F未译25173OM customers
UNION
SELECT location AS place_name
F未译25173OM departments;

SELECT city AS place_name
F未译25173OM customers
INTE未译25173SECT
SELECT location AS place_name
F未译25173OM departments;

SELECT city AS place_name
F未译25173OM customers
EXCEPT
SELECT location AS place_name
F未译25173OM departments;
```
