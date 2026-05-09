# Functions 常用函数

## 用途

函数用于在 SQL 中完成字符串处理、数值计算、日期处理、条件判断、聚合和 JSON 操作。

## 学习目标

- 掌握 MySQL 常用内置函数分类。
- 理解标量函数和聚合函数的差异。
- 能在 SELECT、WHERE、GROUP BY、ORDER BY 中使用函数。

## 核心语法

```sql
function_name(argument1, argument2, ...)
```

## 关键注意点

- 聚合函数通常和 GROUP BY 搭配使用。
- COUNT(*) 统计行数，COUNT(column) 只统计非 NULL 值。
- 对列使用函数可能导致索引无法高效使用，尤其在 WHERE 条件中要注意。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT CONCAT(employee_name, ' <', email, '>') AS contact_text
FROM employees;

SELECT
  'MySQL学习' AS text_value,
  LENGTH('MySQL学习') AS byte_length,
  CHAR_LENGTH('MySQL学习') AS char_length;

SELECT
  product_name,
  SUBSTRING(product_name, 1, 6) AS name_prefix,
  REPLACE(product_name, ' ', '_') AS slug_text,
  UPPER(category) AS upper_category
FROM products;

SELECT
  NOW() AS current_datetime,
  DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY) AS seven_days_later,
  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') AS formatted_time;

SELECT
  employee_name,
  CASE
    WHEN salary >= 25000 THEN 'high'
    WHEN salary >= 15000 THEN 'middle'
    ELSE 'entry'
  END AS salary_level
FROM employees;

SELECT
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price,
  GROUP_CONCAT(product_name ORDER BY price DESC SEPARATOR ', ') AS product_names
FROM products
GROUP BY category;
```
