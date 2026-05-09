# CREATE VIEW 创建视图

## 用途

视图把一段查询保存为可复用的虚拟表，用于简化查询和控制字段暴露。

## 学习目标

- 掌握创建、查询、查看和删除视图。
- 理解视图与真实表的区别。
- 知道复杂视图不一定可更新。

## 核心语法

```sql
CREATE [OR REPLACE] VIEW view_name AS
SELECT ...;
```

## 关键注意点

- 视图通常不存储数据，只保存查询定义。
- 视图适合封装稳定的复杂 JOIN。
- 视图不是性能优化的万能方案。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

CREATE OR REPLACE VIEW v_syntax_employee_department AS
SELECT
  e.employee_id,
  e.employee_name,
  e.email,
  e.salary,
  d.department_name,
  d.location
FROM employees AS e
INNER JOIN departments AS d
  ON e.department_id = d.department_id;

SELECT *
FROM v_syntax_employee_department
WHERE location = 'Shanghai'
ORDER BY salary DESC;

SHOW CREATE VIEW v_syntax_employee_department;
```
