# 数据类型 Data Types

## 用途

数据类型决定列能存储的数据范围、精度、空间占用和比较方式。

## 学习目标

- 掌握数值、字符串、日期时间、JSON、空间类型。
- 知道金额应优先使用 DECIMAL。
- 理解 ENUM、SET、BOOLEAN 的 MySQL 特性。

## 核心语法

```sql
column_name data_type [NOT NULL] [DEFAULT value]
```

## 关键注意点

- BOOLEAN 是 TINYINT(1) 的别名。
- FLOAT/DOUBLE 不适合精确金额。
- 字符集建议使用 utf8mb4。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

CREATE TABLE data_types_reference_demo (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  age TINYINT UNSIGNED,
  quantity INT NOT NULL DEFAULT 0,
  amount DECIMAL(12, 2) NOT NULL,
  ratio DOUBLE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  birthday DATE,
  created_at DATETIME NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status ENUM('draft', 'active', 'disabled') NOT NULL DEFAULT 'draft',
  profile JSON
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```
