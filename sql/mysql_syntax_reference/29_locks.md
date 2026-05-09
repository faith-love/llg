# 锁 Locks

## 用途

锁用于在并发场景下保护数据一致性。

## 学习目标

- 掌握 FOR UPDATE、FOR SHARE。
- 理解 NOWAIT 和 SKIP LOCKED。
- 了解表锁和备份锁。

## 核心语法

```sql
SELECT ... FOR UPDATE;
SELECT ... FOR SHARE;
LOCK TABLES table_name READ|WRITE;
UNLOCK TABLES;
```

## 关键注意点

- InnoDB 行锁在事务中才有持续意义。
- 没有合适索引时锁范围可能扩大。
- 长事务会长期持锁。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

START TRANSACTION;

SELECT product_id, product_name, stock
FROM products
WHERE product_id = 1
FOR UPDATE;

ROLLBACK;

START TRANSACTION;

SELECT product_id, product_name
FROM products
WHERE stock > 0
ORDER BY product_id
LIMIT 3
FOR UPDATE SKIP LOCKED;

ROLLBACK;
```
