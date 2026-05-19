# SELECT .. JOIN 多表连接

## 用途

JOIN 根据关联条件把多张表的数据组合成一个结果集。

## 学习目标

- 掌握 INNER JOIN、LEFT JOIN、RIGHT JOIN、CROSS JOIN、SELF JOIN。
- 理解 ON 和 WHERE 的职责。
- 能写多表订单明细类查询。

## 核心语法

```sql
SELECT ...
FROM table_a AS a
JOIN table_b AS b
  ON a.id = b.a_id;
```

## 关键注意点

- JOIN 条件通常写在 ON 中，结果过滤通常写在 WHERE 中。
- 忘记 ON 条件可能造成笛卡尔积，结果行数暴增。
- 连接列通常需要索引。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT e.employee_id, e.employee_name, d.department_name
FROM employees AS e
INNER JOIN departments AS d
  ON e.department_id = d.department_id;

SELECT
  o.order_id,
  c.customer_name,
  p.product_name,
  oi.quantity,
  oi.unit_price
FROM orders AS o
INNER JOIN customers AS c ON o.customer_id = c.customer_id
INNER JOIN order_items AS oi ON o.order_id = oi.order_id
INNER JOIN products AS p ON oi.product_id = p.product_id;

SELECT
  e.employee_name AS employee,
  m.employee_name AS manager
FROM employees AS e
LEFT JOIN employees AS m
  ON e.manager_id = m.employee_id;
```
