# DROP 删除数据库对象

## 用途

DROP 用于删除数据库、表、视图、索引、存储程序、触发器等对象。

## 学习目标

- 掌握 DROP TABLE、DROP VIEW、DROP INDEX 等语法。
- 理解 DROP 与 DELETE、TRUNCATE 的区别。
- 知道生产环境执行 DROP 前必须确认备份。

## 核心语法

```sql
DROP TABLE IF EXISTS table_name;
DROP VIEW IF EXISTS view_name;
DROP DATABASE IF EXISTS database_name;
```

## 关键注意点

- DROP 删除对象结构和数据，风险高。
- IF EXISTS 可以避免对象不存在时报错。
- 生产环境不要直接执行未审查的 DROP 脚本。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

DROP TABLE IF EXISTS drop_table_demo;

CREATE TABLE drop_table_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

DROP TABLE IF EXISTS drop_table_demo;

CREATE OR REPLACE VIEW v_drop_demo AS
SELECT product_id, product_name
FROM products;

DROP VIEW IF EXISTS v_drop_demo;

-- DROP DATABASE IF EXISTS database_name;
```
