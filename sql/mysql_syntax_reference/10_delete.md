# DELETE 删除数据

## 用途

DELETE 用于删除表中的行。

## 学习目标

- 掌握按条件删除、分批删除、DELETE JOIN。
- 理解 DELETE、TRUNCATE、DROP 的区别。
- 养成删除前先 SELECT 命中行的习惯。

## 核心语法

```sql
DELETE FROM table_name
WHERE condition;
```

## 关键注意点

- DELETE 不写 WHERE 会删除整张表数据。
- TRUNCATE 会清空表并通常重置自增值。
- DROP 删除表结构和数据。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

START TRANSACTION;

INSERT INTO customers (customer_name, phone, city)
VALUES ('Delete Demo Customer', '13800006666', 'Shanghai');

DELETE FROM customers
WHERE customer_name = 'Delete Demo Customer';

DELETE FROM products
WHERE category = 'DeleteDemo'
ORDER BY product_id
LIMIT 1;

ROLLBACK;

-- 删除整表数据但保留表结构：
-- TRUNCATE TABLE table_name;
```
