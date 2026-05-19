# 分区表 Partitioning

## 用途

分区把一张逻辑表按规则拆成多个物理分区，便于范围裁剪、归档和清理。

## 学习目标

- 了解 RANGE、LIST、HASH、KEY 分区。
- 掌握 RANGE 分区建表示例。
- 理解分区表唯一键限制。

## 核心语法

```sql
CREATE TABLE table_name (...)
PARTITION BY RANGE (expr) (
  PARTITION p1 VALUES LESS THAN (...),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

## 关键注意点

- 分区不是索引的替代品。
- 分区表达式要匹配常用 WHERE 条件。
- DROP PARTITION 会删除该分区内数据。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

CREATE TABLE orders_partition_demo (
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (order_id, order_date)
) ENGINE = InnoDB
PARTITION BY RANGE (YEAR(order_date)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```
