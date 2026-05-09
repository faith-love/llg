# USE、DESCRIBE、EXPLAIN 等工具语句

## 用途

工具语句用于切换数据库、查看结构、查看执行计划和辅助排查。

## 学习目标

- 掌握 USE、DESCRIBE、SHOW COLUMNS。
- 掌握 EXPLAIN 和 EXPLAIN FORMAT=JSON。
- 理解 EXPLAIN 的关键字段。

## 核心语法

```sql
USE database_name;
DESCRIBE table_name;
EXPLAIN SELECT ...;
```

## 关键注意点

- EXPLAIN ANALYZE 会实际执行查询。
- 关注 type、key、rows、Extra 等字段。
- 执行计划是索引优化的基础。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

DESCRIBE employees;
DESC products;
SHOW COLUMNS FROM orders;

EXPLAIN
SELECT o.order_id, c.customer_name, o.total_amount
FROM orders AS o
INNER JOIN customers AS c
  ON o.customer_id = c.customer_id
WHERE o.customer_id = 1;

EXPLAIN FORMAT=JSON
SELECT product_id, product_name, price
FROM products
WHERE category = 'Computer'
ORDER BY price DESC;
```
