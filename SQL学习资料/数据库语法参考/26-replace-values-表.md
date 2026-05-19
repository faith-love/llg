# REPLACE、VALUES、TABLE

## 用途

这些是 MySQL 较有特色或较新的查询与写入语法。

## 学习目标

- 理解 REPLACE 的删除再插入语义。
- 了解 VALUES 构造行结果集。
- 了解 TABLE 作为 SELECT * 的简写。

## 核心语法

```sql
REPLACE INTO table_name (...) VALUES (...);
VALUES ROW(...), ROW(...);
TABLE table_name;
```

## 关键注意点

- REPLACE 可能触发 DELETE + INSERT 相关副作用。
- 更新冲突更推荐 ON DUPLICATE KEY UPDATE。
- TABLE 和 VALUES 的查询表达式能力偏新版 MySQL。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

CREATE TABLE replace_demo (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

INSERT INTO replace_demo (id, name)
VALUES (1, 'old name');

REPLACE INTO replace_demo (id, name)
VALUES (1, 'new name');

VALUES ROW(1, 'A'), ROW(2, 'B'), ROW(3, 'C');

TABLE products
ORDER BY price DESC
LIMIT 3;
```
