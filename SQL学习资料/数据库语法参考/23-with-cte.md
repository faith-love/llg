# WITH / CTE 公用表表达式

## 用途

CTE 用 WITH 定义当前语句内可复用的中间结果。

## 学习目标

- 掌握普通 CTE 和多个 CTE。
- 掌握递归 CTE。
- 能用 CTE 改写复杂子查询。

## 核心语法

```sql
WITH cte_name AS (
  SELECT ...
)
SELECT ... FROM cte_name;
```

## 关键注意点

- MySQL 8.0+ 支持 CTE。
- 递归 CTE 必须有终止条件。
- CTE 只在当前语句中有效。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

WITH paid_orders AS (
  SELECT customer_id, total_amount
  FROM orders
  WHERE status = 'paid'
)
SELECT c.customer_name, SUM(po.total_amount) AS paid_amount
FROM paid_orders AS po
INNER JOIN customers AS c
  ON po.customer_id = c.customer_id
GROUP BY c.customer_id, c.customer_name;

WITH RECURSIVE numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1
  FROM numbers
  WHERE n < 10
)
SELECT n
FROM numbers;
```
