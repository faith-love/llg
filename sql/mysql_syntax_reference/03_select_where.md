# SELECT .. WHERE 条件筛选

## 用途

WHERE 用来在分组和聚合前过滤明细行，只保留满足条件的数据。

## 学习目标

- 掌握比较、逻辑、范围、集合、模糊匹配条件。
- 理解 NULL 判断方式。
- 能使用 EXISTS 做存在性判断。

## 核心语法

```sql
SELECT column_list
FROM table_name
WHERE condition;
```

## 关键注意点

- 复杂 AND/OR 条件建议显式加括号。
- NULL 不能用 = 判断，必须使用 IS NULL 或 IS NOT NULL。
- LIKE 的前置通配符如 %abc 通常难以使用普通 B-Tree 索引。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT employee_name, salary
FROM employees
WHERE salary >= 18000;

SELECT product_name, category
FROM products
WHERE category IN ('Computer', 'Accessory');

SELECT product_name, price
FROM products
WHERE price BETWEEN 200 AND 2000;

SELECT customer_name
FROM customers
WHERE customer_name LIKE '%Tech%';

SELECT customer_id, customer_name, phone
FROM customers
WHERE phone IS NULL;

SELECT c.customer_id, c.customer_name
FROM customers AS c
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.customer_id = c.customer_id
);
```
