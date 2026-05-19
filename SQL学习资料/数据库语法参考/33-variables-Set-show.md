# 变量、SET、SHOW

## 用途

变量用于保存会话内值或配置，SHOW 用于查看数据库元信息和运行状态。

## 学习目标

- 掌握用户变量和系统变量。
- 了解 SESSION 和 GLOBAL 变量作用范围。
- 掌握常见 SHOW 命令。

## 核心语法

```sql
SET @var_name = value;
SELECT ... INTO @var_name;
SHOW VARIABLES LIKE pattern;
SHOW TABLES;
```

## 关键注意点

- 用户变量当前连接内有效。
- GLOBAL 变量通常需要管理员权限。
- SHOW CREATE TABLE 是学习表结构的好工具。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SET @min_price = 1000;

SELECT product_name, price
FROM products
WHERE price >= @min_price;

SELECT COUNT(*)
INTO @order_count
FROM orders;

SHOW VARIABLES LIKE 'version%';
SHOW TABLES;
SHOW COLUMNS FROM employees;
SHOW INDEX FROM employees;
SHOW CREATE TABLE employees;
```
