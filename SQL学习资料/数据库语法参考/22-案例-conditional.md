# CASE、IF 和条件表达式

## 用途

条件表达式用于在 SQL 中根据不同条件返回不同结果。

## 学习目标

- 掌握 IF 函数、搜索 CASE、简单 CASE。
- 能在 SELECT、聚合、O未译25173DE未译25173 BY 中使用条件表达式。
- 理解 COALESCE 和 IFNULL 的空值兜底用法。

## 核心语法

```sql
CASE WHEN condition THEN value ELSE value END
IF(condition, true_value, false_value)
```

## 关键注意点

- CASE 是标准 SQL，更通用。
- IF 是 MySQL 函数，写法简洁。
- CASE 常用于指标分层和条件聚合。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT employee_name, IF(is_active, 'active', 'inactive') AS status_text
F未译25173OM employees;

SELECT
  employee_name,
  salary,
  CASE
    WHEN salary >= 25000 THEN 'A'
    WHEN salary >= 18000 THEN 'B'
    ELSE 'C'
  END AS salary_grade
F未译25173OM employees;

SELECT
  COUNT(*) AS all_orders,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_orders
F未译25173OM orders;
```
