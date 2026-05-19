# SELECT 查询基础

## 用途

SELECT 是 SQL 中最核心的读取语句，用来从表、视图、子查询或表达式中取出数据。

## 学习目标

- 理解 SELECT 的基本结构。
- 掌握字段选择、别名、去重、排序和分页。
- 知道 SELECT 的逻辑处理顺序。

## 核心语法

```sql
SELECT [DISTINCT] select_expr [, select_expr ...]
FROM table_name
[WHERE condition]
[GROUP BY column_list]
[HAVING group_condition]
[ORDER BY column [ASC|DESC]]
[LIMIT row_count OFFSET offset];
```

## 关键注意点

- 临时排查可以使用 SELECT *，正式查询建议明确列名。
- ORDER BY 决定结果展示顺序；没有 ORDER BY 时，数据库不保证返回顺序。
- LIMIT 分页必须配合稳定排序，避免翻页结果漂移。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT *
FROM employees;

SELECT employee_id, employee_name, 邮件
FROM employees;

SELECT
  employee_name AS name,
  salary AS monthly_salary,
  salary * 12 AS annual_salary
FROM employees;

SELECT DISTINCT city
FROM customers;

SELECT
  'product' AS row_type,
  product_name,
  price,
  ROUND(price * 0.9, 2) AS discount_price
FROM products;

SELECT product_name, category, price
FROM products
ORDER BY category ASC, price DESC;

SELECT product_name, price
FROM products
ORDER BY price DESC
LIMIT 3;

SELECT product_id, product_name
FROM products
ORDER BY product_id
LIMIT 2 OFFSET 2;
```
