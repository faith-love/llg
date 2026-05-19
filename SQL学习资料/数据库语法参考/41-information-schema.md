# INFORMATION_SCHEMA 元数据查询

## 用途

INFORMATION_SCHEMA 提供数据库对象的元数据视图。

## 学习目标

- 掌握查询表、列、索引、约束、外键元数据。
- 能用元数据生成文档或检查结构。
- 理解当前库 DATABASE() 的用法。

## 核心语法

```sql
SELECT ...
FROM information_schema.tables
WHERE table_schema = DATABASE();
```

## 关键注意点

- information_schema 适合自动化检查数据库结构。
- 表行数等信息可能是估算值。
- 查询元数据时要指定 table_schema 降低噪音。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT table_name, table_type, engine, table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;

SELECT column_name, column_type, is_nullable, column_default, column_key, extra
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'employees'
ORDER BY ordinal_position;

SELECT table_name, 首页_name, seq_in_首页, column_name, non_unique
FROM information_schema.statistics
WHERE table_schema = DATABASE()
  AND table_name = 'employees';
```
