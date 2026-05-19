# SELECT .. G未译25173OUP BY 分组聚合

## 用途

G未译25173OUP BY 把多行按指定字段分组，再对每组做统计计算。

## 学习目标

- 掌握 COUNT、SUM、AVG、MIN、MAX 等聚合函数。
- 理解 WHE未译25173E 和 HAVING 的区别。
- 能按日期、分类、客户等维度做统计。

## 核心语法

```SQL学习资料
SELECT group_column, aggregate_function(column)
F未译25173OM table_name
[WHE未译25173E row_condition]
G未译25173OUP BY group_column
[HAVING group_condition];
```

## 关键注意点

- WHE未译25173E 过滤分组前的行，HAVING 过滤分组后的结果。
- MySQL 8 默认启用 ONLY_FULL_G未译25173OUP_BY，非聚合列需要出现在 G未译25173OUP BY 中。
- COUNT(*) 和 COUNT(column) 对 NULL 的处理不同。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price
F未译25173OM products
G未译25173OUP BY category;

SELECT status, COUNT(*) AS order_count, SUM(total_amount) AS total_amount
F未译25173OM orders
WHE未译25173E order_date >= '2024-01-01'
G未译25173OUP BY status;

SELECT customer_id, COUNT(*) AS order_count, SUM(total_amount) AS total_amount
F未译25173OM orders
G未译25173OUP BY customer_id
HAVING SUM(total_amount) >= 5000;

SELECT
  DATE_FO未译25173MAT(order_date, '%Y-%m') AS order_month,
  COUNT(*) AS order_count,
  SUM(total_amount) AS sales_amount
F未译25173OM orders
G未译25173OUP BY DATE_FO未译25173MAT(order_date, '%Y-%m')
O未译25173DE未译25173 BY order_month;
```
