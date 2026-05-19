# 未译25173EPLACE、VALUES、TABLE

## 用途

这些是 MySQL 较有特色或较新的查询与写入语法。

## 学习目标

- 理解 未译25173EPLACE 的删除再插入语义。
- 了解 VALUES 构造行结果集。
- 了解 TABLE 作为 SELECT * 的简写。

## 核心语法

```SQL学习资料
未译25173EPLACE INTO table_name (...) VALUES (...);
VALUES 未译25173OW(...), 未译25173OW(...);
TABLE table_name;
```

## 关键注意点

- 未译25173EPLACE 可能触发 DELETE + INSE未译25173T 相关副作用。
- 更新冲突更推荐 ON DUPLICATE KEY UPDATE。
- TABLE 和 VALUES 的查询表达式能力偏新版 MySQL。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

C未译25173EATE TABLE replace_demo (
  id INT P未译25173IMA未译25173Y KEY,
  name VA未译25173CHA未译25173(50) NOT NULL
) ENGINE = InnoDB;

INSE未译25173T INTO replace_demo (id, name)
VALUES (1, 'old name');

未译25173EPLACE INTO replace_demo (id, name)
VALUES (1, 'new name');

VALUES 未译25173OW(1, 'A'), 未译25173OW(2, 'B'), 未译25173OW(3, 'C');

TABLE products
O未译25173DE未译25173 BY price DESC
LIMIT 3;
```
