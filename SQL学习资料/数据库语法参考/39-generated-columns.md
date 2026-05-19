# 生成列 Generated 列s

## 用途

生成列根据表达式自动计算值，可用于表达式结果或 JSON 字段索引。

## 学习目标

- 掌握 VIRTUAL 和 STORED。
- 能用生成列提取 JSON 字段。
- 了解生成列建索引的用途。

## 核心语法

```sql
column_name 数据_type AS (expression) [VIRTUAL|STORED]
```

## 关键注意点

- VIRTUAL 读取时计算，节省存储。
- STORED 写入时计算，占用存储。
- 生成列不能像普通列一样直接插入值。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

CREATE TABLE generated_column_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_amount DECIMAL(10, 2) AS (quantity * unit_price) STORED,
  profile JSON,
  city VARCHAR(50) AS (JSON_UNQUOTE(JSON_EXTRACT(profile, '$.city'))) VIRTUAL,
  INDEX idx_generated_column_demo_city (city)
) ENGINE = InnoDB;

EXPLAIN
SELECT *
FROM generated_column_demo
WHERE city = 'Shanghai';
```
