# SELECT .. SELECT 子查询

## 用途

子查询是在一条 SQL 内嵌套另一条 SELECT，用于过滤、计算或构造中间结果。

## 学习目标

- 掌握标量子查询、IN 子查询、EXISTS 子查询。
- 理解 FROM 中派生表必须有别名。
- 掌握 CTE 作为更清晰的子查询写法。

## 核心语法

```sql
SELECT ...
FROM table_name
WHERE column IN (SELECT column FROM other_table);
```

## 关键注意点

- 标量子查询必须只返回一行一列。
- NOT IN 遇到 NULL 容易产生意外，反查询更推荐 NOT EXISTS。
- 复杂嵌套可以改写为 JOIN 或 CTE 提升可读性。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT employee_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

SELECT customer_id, customer_name
FROM customers
WHERE customer_id IN (
  SELECT customer_id
  FROM orders
  WHERE status = 'paid'
);

SELECT c.customer_id, c.customer_name
FROM customers AS c
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.customer_id = c.customer_id
);

WITH paid_orders AS (
  SELECT customer_id, total_amount
  FROM orders
  WHERE status = 'paid'
)
SELECT c.customer_name, SUM(po.total_amount) AS paid_total
FROM customers AS c
INNER JOIN paid_orders AS po
  ON c.customer_id = po.customer_id
GROUP BY c.customer_id, c.customer_name;
```
