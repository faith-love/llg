# INSERT .. VALUES 插入数据

## 用途

INSERT .. VALUES 用于向表中插入一行或多行数据。

## 学习目标

- 掌握单行插入和多行插入。
- 理解默认值、自增主键和约束检查。
- 了解 INSERT IGNORE 和 ON DUPLICATE KEY UPDATE。

## 核心语法

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

## 关键注意点

- 建议明确写列名，不依赖表字段顺序。
- 字符串和日期字面量使用单引号。
- ON DUPLICATE KEY UPDATE 适合唯一键冲突时做更新。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

START TRANSACTION;

INSERT INTO customers (customer_name, phone, city)
VALUES ('Syntax Demo Customer', '13800009999', 'Shanghai');

INSERT INTO products (product_name, category, price, stock)
VALUES
('Demo Product A', 'Demo', 10.00, 100),
('Demo Product B', 'Demo', 20.00, 200);

INSERT INTO products (product_name, category, price)
VALUES ('Demo Product Default Stock', 'Demo', 30.00);

INSERT INTO customers (customer_id, customer_name, phone, city)
VALUES (1, 'Acme Technology Updated', '13800001234', 'Shanghai')
ON DUPLICATE KEY UPDATE
  phone = VALUES(phone),
  city = VALUES(city);

ROLLBACK;
```
