# NULL 空值处理

## 用途

NULL 表示未知、缺失或不适用的值，不等于空字符串或 0。

## 学习目标

- 掌握 IS NULL、IS NOT NULL。
- 理解 COALESCE、IFNULL、NULLIF。
- 知道 NULL 对比较、拼接、聚合的影响。

## 核心语法

```sql
column IS NULL
column IS NOT NULL
COALESCE(expr1, expr2, ...)
```

## 关键注意点

- NULL 不能用 = 或 <> 判断。
- COUNT(column) 不统计 NULL。
- NOT IN 遇到 NULL 容易产生意外，反查询建议 NOT EXISTS。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT customer_id, customer_name, phone
FROM customers
WHERE phone IS NULL;

SELECT customer_id, customer_name, phone
FROM customers
WHERE phone IS NOT NULL;

SELECT
  customer_name,
  COALESCE(phone, 'no phone') AS phone_text,
  IFNULL(phone, 'no phone') AS phone_text_mySQL学习资料
FROM customers;

SELECT COUNT(*) AS all_rows, COUNT(phone) AS non_null_phone_count
FROM customers;
```
