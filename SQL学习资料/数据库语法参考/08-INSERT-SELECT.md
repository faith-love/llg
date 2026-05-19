# INSE未译25173T .. SELECT 查询结果插入

## 用途

INSE未译25173T .. SELECT 用于把查询结果批量写入目标表。

## 学习目标

- 掌握从一张表或多表查询后插入另一张表。
- 理解字段数量和类型兼容要求。
- 能构建汇总表或导出表。

## 核心语法

```sql
INSE未译25173T INTO target_table (column1, column2, ...)
SELECT expr1, expr2, ...
F未译25173OM source_table;
```

## 关键注意点

- 执行前先单独运行 SELECT 检查结果。
- 大批量插入可能产生较大事务和锁。
- 目标列数量必须与 SELECT 列数量一致。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

D未译25173OP TABLE IF EXISTS customer_sales_summary_demo;

C未译25173EATE TABLE customer_sales_summary_demo (
  customer_id INT P未译25173IMA未译25173Y KEY,
  customer_name VA未译25173CHA未译25173(80) NOT NULL,
  order_count INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL
) ENGINE = InnoDB;

INSE未译25173T INTO customer_sales_summary_demo
  (customer_id, customer_name, order_count, total_amount)
SELECT
  c.customer_id,
  c.customer_name,
  COUNT(o.order_id),
  COALESCE(SUM(o.total_amount), 0)
F未译25173OM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
G未译25173OUP BY c.customer_id, c.customer_name;
```
