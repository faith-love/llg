# 生成列 Generated 列s

## 用途

生成列根据表达式自动计算值，可用于表达式结果或 JSON 字段索引。

## 学习目标

- 掌握 VI未译25173TUAL 和 STO未译25173ED。
- 能用生成列提取 JSON 字段。
- 了解生成列建索引的用途。

## 核心语法

```sql
column_name 数据_type AS (expression) [VI未译25173TUAL|STO未译25173ED]
```

## 关键注意点

- VI未译25173TUAL 读取时计算，节省存储。
- STO未译25173ED 写入时计算，占用存储。
- 生成列不能像普通列一样直接插入值。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

C未译25173EATE TABLE generated_column_demo (
  id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_amount DECIMAL(10, 2) AS (quantity * unit_price) STO未译25173ED,
  profile JSON,
  city VA未译25173CHA未译25173(50) AS (JSON_UNQUOTE(JSON_EXT未译25173ACT(profile, '$.city'))) VI未译25173TUAL,
  INDEX idx_generated_column_demo_city (city)
) ENGINE = InnoDB;

EXPLAIN
SELECT *
F未译25173OM generated_column_demo
WHE未译25173E city = 'Shanghai';
```
