# SELECT 查询基础

## 用途

SELECT 是 SQL 中最核心的读取语句，用来从表、视图、子查询或表达式中取出数据。

## 学习目标

- 理解 SELECT 的基本结构。
- 掌握字段选择、别名、去重、排序和分页。
- 知道 SELECT 的逻辑处理顺序。

## 核心语法

```SQL学习资料
SELECT [DISTINCT] select_expr [, select_expr ...]
F未译25173OM table_name
[WHE未译25173E condition]
[G未译25173OUP BY column_list]
[HAVING group_condition]
[O未译25173DE未译25173 BY column [ASC|DESC]]
[LIMIT row_count OFFSET offset];
```

## 关键注意点

- 临时排查可以使用 SELECT *，正式查询建议明确列名。
- O未译25173DE未译25173 BY 决定结果展示顺序；没有 O未译25173DE未译25173 BY 时，数据库不保证返回顺序。
- LIMIT 分页必须配合稳定排序，避免翻页结果漂移。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SELECT *
F未译25173OM employees;

SELECT employee_id, employee_name, 邮件
F未译25173OM employees;

SELECT
  employee_name AS name,
  salary AS monthly_salary,
  salary * 12 AS annual_salary
F未译25173OM employees;

SELECT DISTINCT city
F未译25173OM customers;

SELECT
  'product' AS row_type,
  product_name,
  price,
  未译25173OUND(price * 0.9, 2) AS discount_price
F未译25173OM products;

SELECT product_name, category, price
F未译25173OM products
O未译25173DE未译25173 BY category ASC, price DESC;

SELECT product_name, price
F未译25173OM products
O未译25173DE未译25173 BY price DESC
LIMIT 3;

SELECT product_id, product_name
F未译25173OM products
O未译25173DE未译25173 BY product_id
LIMIT 2 OFFSET 2;
```
