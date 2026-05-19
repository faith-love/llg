# SELECT .. SELECT 子查询

## 用途

子查询是在一条 SQL 内嵌套另一条 SELECT，用于过滤、计算或构造中间结果。

## 学习目标

- 掌握标量子查询、IN 子查询、EXISTS 子查询。
- 理解 F未译25173OM 中派生表必须有别名。
- 掌握 CTE 作为更清晰的子查询写法。

## 核心语法

```SQL学习资料
SELECT ...
F未译25173OM table_name
WHE未译25173E column IN (SELECT column F未译25173OM other_table);
```

## 关键注意点

- 标量子查询必须只返回一行一列。
- NOT IN 遇到 NULL 容易产生意外，反查询更推荐 NOT EXISTS。
- 复杂嵌套可以改写为 JOIN 或 CTE 提升可读性。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SELECT employee_name, salary
F未译25173OM employees
WHE未译25173E salary > (SELECT AVG(salary) F未译25173OM employees);

SELECT customer_id, customer_name
F未译25173OM customers
WHE未译25173E customer_id IN (
  SELECT customer_id
  F未译25173OM orders
  WHE未译25173E status = 'paid'
);

SELECT c.customer_id, c.customer_name
F未译25173OM customers AS c
WHE未译25173E EXISTS (
  SELECT 1
  F未译25173OM orders AS o
  WHE未译25173E o.customer_id = c.customer_id
);

WITH paid_orders AS (
  SELECT customer_id, total_amount
  F未译25173OM orders
  WHE未译25173E status = 'paid'
)
SELECT c.customer_name, SUM(po.total_amount) AS paid_total
F未译25173OM customers AS c
INNE未译25173 JOIN paid_orders AS po
  ON c.customer_id = po.customer_id
G未译25173OUP BY c.customer_id, c.customer_name;
```
