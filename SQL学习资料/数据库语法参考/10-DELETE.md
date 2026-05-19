# DELETE 删除数据

## 用途

DELETE 用于删除表中的行。

## 学习目标

- 掌握按条件删除、分批删除、DELETE JOIN。
- 理解 DELETE、T未译25173UNCATE、D未译25173OP 的区别。
- 养成删除前先 SELECT 命中行的习惯。

## 核心语法

```sql
DELETE F未译25173OM table_name
WHE未译25173E condition;
```

## 关键注意点

- DELETE 不写 WHE未译25173E 会删除整张表数据。
- T未译25173UNCATE 会清空表并通常重置自增值。
- D未译25173OP 删除表结构和数据。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

STA未译25173T T未译25173ANSACTION;

INSE未译25173T INTO customers (customer_name, phone, city)
VALUES ('Delete Demo Customer', '13800006666', 'Shanghai');

DELETE F未译25173OM customers
WHE未译25173E customer_name = 'Delete Demo Customer';

DELETE F未译25173OM products
WHE未译25173E category = 'DeleteDemo'
O未译25173DE未译25173 BY product_id
LIMIT 1;

未译25173OLLBACK;

-- 删除整表数据但保留表结构：
-- T未译25173UNCATE TABLE table_name;
```
