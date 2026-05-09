# UNION 合并结果集

## 用途

UNION 用于把多个 SELECT 的结果集合并为一个结果集。

## 学习目标

- 掌握 UNION 和 UNION ALL 的区别。
- 理解列数量和类型兼容要求。
- 知道最终列名来自第一段 SELECT。

## 核心语法

```sql
SELECT column_list FROM table_a
UNION [ALL]
SELECT column_list FROM table_b;
```

## 关键注意点

- UNION 会去重，UNION ALL 不去重。
- UNION ALL 通常更快。
- 最终排序 ORDER BY 放在最后。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT city AS location_name
FROM customers
UNION
SELECT location AS location_name
FROM departments
ORDER BY location_name;

SELECT employee_name AS name, email AS contact
FROM employees
UNION ALL
SELECT customer_name AS name, phone AS contact
FROM customers;
```
