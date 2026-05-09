# SELECT .. GROUP BY 分组聚合

## 用途

GROUP BY 把多行按指定字段分组，再对每组做统计计算。

## 学习目标

- 掌握 COUNT、SUM、AVG、MIN、MAX 等聚合函数。
- 理解 WHERE 和 HAVING 的区别。
- 能按日期、分类、客户等维度做统计。

## 核心语法

```sql
SELECT group_column, aggregate_function(column)
FROM table_name
[WHERE row_condition]
GROUP BY group_column
[HAVING group_condition];
```

## 关键注意点

- WHERE 过滤分组前的行，HAVING 过滤分组后的结果。
- MySQL 8 默认启用 ONLY_FULL_GROUP_BY，非聚合列需要出现在 GROUP BY 中。
- COUNT(*) 和 COUNT(column) 对 NULL 的处理不同。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price
FROM products
GROUP BY category;

SELECT status, COUNT(*) AS order_count, SUM(total_amount) AS total_amount
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY status;

SELECT customer_id, COUNT(*) AS order_count, SUM(total_amount) AS total_amount
FROM orders
GROUP BY customer_id
HAVING SUM(total_amount) >= 5000;

SELECT
  DATE_FORMAT(order_date, '%Y-%m') AS order_month,
  COUNT(*) AS order_count,
  SUM(total_amount) AS sales_amount
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY order_month;
```
