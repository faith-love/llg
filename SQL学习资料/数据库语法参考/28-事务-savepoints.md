# 事务、COMMIT、ROLLBACK、SAVEPOINT

## 用途

事务把多条 SQL 作为一个原子操作执行，保证一致性。

## 学习目标

- 掌握 START TRANSACTION、COMMIT、ROLLBACK。
- 理解 SAVEPOINT 部分回滚。
- 了解事务隔离级别。

## 核心语法

```sql
START TRANSACTION;
...
COMMIT;

SAVEPOINT sp_name;
ROLLBACK TO SAVEPOINT sp_name;
```

## 关键注意点

- InnoDB 支持事务。
- 很多 DDL 会隐式提交事务。
- 长事务会持锁并影响并发。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

START TRANSACTION;

UPDATE products
SET stock = stock - 1
WHERE product_id = 1;

SAVEPOINT after_product_1;

UPDATE products
SET stock = stock - 1
WHERE product_id = 2;

ROLLBACK TO SAVEPOINT after_product_1;

ROLLBACK;

SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT @@transaction_isolation AS isolation_level;
```
