# CREATE TABLE 创建表

## 用途

CREATE TABLE 用于定义表结构、字段类型、约束、默认值和存储引擎。

## 学习目标

- 掌握常见字段类型和约束。
- 理解主键、唯一键、外键、CHECK、DEFAULT。
- 能创建普通表、外键表和查询复制表。

## 核心语法

```sql
CREATE TABLE table_name (
  column_name data_type [column_constraint],
  table_constraint
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

## 关键注意点

- MySQL 常用 InnoDB 引擎，支持事务和行级锁。
- 中文和 emoji 建议使用 utf8mb4。
- CREATE TABLE ... AS SELECT 通常不会复制索引和约束。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

CREATE TABLE create_table_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  age INT NOT NULL,
  email VARCHAR(100),
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_create_table_demo_age CHECK (age >= 0 AND age <= 150)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE product_copy_demo AS
SELECT product_id, product_name, category, price
FROM products;
```
