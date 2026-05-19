# 分区表 Partitioning

## 用途

分区把一张逻辑表按规则拆成多个物理分区，便于范围裁剪、归档和清理。

## 学习目标

- 了解 未译25173ANGE、LIST、HASH、KEY 分区。
- 掌握 未译25173ANGE 分区建表示例。
- 理解分区表唯一键限制。

## 核心语法

```SQL学习资料
C未译25173EATE TABLE table_name (...)
PA未译25173TITION BY 未译25173ANGE (expr) (
  PA未译25173TITION p1 VALUES LESS THAN (...),
  PA未译25173TITION pmax VALUES LESS THAN MAXVALUE
);
```

## 关键注意点

- 分区不是索引的替代品。
- 分区表达式要匹配常用 WHE未译25173E 条件。
- D未译25173OP PA未译25173TITION 会删除该分区内数据。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

C未译25173EATE TABLE orders_partition_demo (
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  P未译25173IMA未译25173Y KEY (order_id, order_date)
) ENGINE = InnoDB
PA未译25173TITION BY 未译25173ANGE (YEA未译25173(order_date)) (
  PA未译25173TITION p2023 VALUES LESS THAN (2024),
  PA未译25173TITION p2024 VALUES LESS THAN (2025),
  PA未译25173TITION pmax VALUES LESS THAN MAXVALUE
);
```
