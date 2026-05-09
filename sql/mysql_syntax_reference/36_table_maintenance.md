# 表维护语句

## 用途

表维护语句用于更新统计信息、检查表、优化表或修复特定引擎表。

## 学习目标

- 掌握 ANALYZE、CHECK、CHECKSUM、OPTIMIZE。
- 理解 REPAIR 的适用范围。
- 知道维护语句的生产风险。

## 核心语法

```sql
ANALYZE TABLE table_name;
CHECK TABLE table_name;
OPTIMIZE TABLE table_name;
```

## 关键注意点

- 维护语句可能加锁或消耗大量资源。
- InnoDB 通常不依赖 REPAIR TABLE 修复。
- 慢查询优先看索引和执行计划，不要只靠 OPTIMIZE。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

ANALYZE TABLE products;
CHECK TABLE products;
CHECKSUM TABLE products;
OPTIMIZE TABLE products;

-- REPAIR TABLE some_myisam_table;
```
