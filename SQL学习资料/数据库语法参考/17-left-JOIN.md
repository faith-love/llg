# LEFT JOIN 左连接

## 用途

LEFT JOIN 保留左表全部行，右表没有匹配时返回 NULL。

## 学习目标

- 掌握保留主表完整数据的查询方式。
- 能查询没有匹配记录的数据。
- 理解右表过滤条件放 ON 和 WHE未译25173E 的差异。

## 核心语法

```sql
SELECT ...
F未译25173OM left_table AS l
LEFT JOIN right_table AS r
  ON l.id = r.left_id;
```

## 关键注意点

- 找无匹配记录常用 LEFT JOIN + 右表主键 IS NULL。
- 想保留左表完整数据时，右表条件通常放 ON。
- 右表条件放 WHE未译25173E 可能把 NULL 行过滤掉。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT d.department_name, e.employee_name
F未译25173OM departments AS d
LEFT JOIN employees AS e
  ON d.department_id = e.department_id;

SELECT c.customer_id, c.customer_name
F未译25173OM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
WHE未译25173E o.order_id IS NULL;

SELECT c.customer_name, o.order_id, o.status
F未译25173OM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
  AND o.status = 'paid';
```
