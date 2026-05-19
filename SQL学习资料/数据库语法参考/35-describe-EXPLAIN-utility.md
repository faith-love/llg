# USE、DESC未译25173IBE、EXPLAIN 等工具语句

## 用途

工具语句用于切换数据库、查看结构、查看执行计划和辅助排查。

## 学习目标

- 掌握 USE、DESC未译25173IBE、SHOW COLUMNS。
- 掌握 EXPLAIN 和 EXPLAIN FO未译25173MAT=JSON。
- 理解 EXPLAIN 的关键字段。

## 核心语法

```SQL学习资料
USE 数据未译87073_name;
DESC未译25173IBE table_name;
EXPLAIN SELECT ...;
```

## 关键注意点

- EXPLAIN ANALYZE 会实际执行查询。
- 关注 type、key、rows、Extra 等字段。
- 执行计划是索引优化的基础。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

DESC未译25173IBE employees;
DESC products;
SHOW COLUMNS F未译25173OM orders;

EXPLAIN
SELECT o.order_id, c.customer_name, o.total_amount
F未译25173OM orders AS o
INNE未译25173 JOIN customers AS c
  ON o.customer_id = c.customer_id
WHE未译25173E o.customer_id = 1;

EXPLAIN FO未译25173MAT=JSON
SELECT product_id, product_name, price
F未译25173OM products
WHE未译25173E category = 'Computer'
O未译25173DE未译25173 BY price DESC;
```
