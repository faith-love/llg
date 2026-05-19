# INSERT .. SELECT 查询结果插入

## 用途

INSERT .. SELECT 用于把查询结果批量写入目标表。

## 学习目标

- 掌握从一张表或多表查询后插入另一张表。
- 理解字段数量和类型兼容要求。
- 能构建汇总表或导出表。

## 核心语法

```sql
INSERT INTO target_table (column1, column2, ...)
SELECT expr1, expr2, ...
FROM source_table;
```

## 关键注意点

- 执行前先单独运行 SELECT 检查结果。
- 大批量插入可能产生较大事务和锁。
- 目标列数量必须与 SELECT 列数量一致。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

DROP TABLE IF EXISTS customer_sales_summary_demo;

CREATE TABLE customer_sales_summary_demo (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(80) NOT NULL,
  order_count INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL
) ENGINE = InnoDB;

INSERT INTO customer_sales_summary_demo
  (customer_id, customer_name, order_count, total_amount)
SELECT
  c.customer_id,
  c.customer_name,
  COUNT(o.order_id),
  COALESCE(SUM(o.total_amount), 0)
FROM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
```
