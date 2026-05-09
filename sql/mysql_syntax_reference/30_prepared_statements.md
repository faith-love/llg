# 预处理语句 Prepared Statements

## 用途

预处理语句用于动态 SQL 或重复执行结构相同、参数不同的 SQL。

## 学习目标

- 掌握 PREPARE、EXECUTE、DEALLOCATE。
- 理解 ? 占位符只能占位值。
- 知道动态表名只能拼接且要防注入。

## 核心语法

```sql
PREPARE stmt_name FROM @sql;
EXECUTE stmt_name USING @var1, @var2;
DEALLOCATE PREPARE stmt_name;
```

## 关键注意点

- ? 不能占位表名、列名或关键字。
- 动态拼接 SQL 要确保对象名来源可信。
- 应用层通常使用驱动提供的预处理能力。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SET @sql_text = 'SELECT product_id, product_name, price FROM products WHERE category = ? AND price >= ?';
SET @category = 'Computer';
SET @min_price = 1000;

PREPARE stmt_product_filter FROM @sql_text;
EXECUTE stmt_product_filter USING @category, @min_price;
DEALLOCATE PREPARE stmt_product_filter;

SET @table_name = 'products';
SET @sql_text = CONCAT('SELECT COUNT(*) AS row_count FROM ', @table_name);
PREPARE stmt_count FROM @sql_text;
EXECUTE stmt_count;
DEALLOCATE PREPARE stmt_count;
```
