# 窗口函数 Window Functions

## 用途

窗口函数在保留明细行的同时计算排名、累计值和前后行对比。

## 学习目标

- 掌握 ROW_NUMBER、RANK、DENSE_RANK。
- 掌握 LAG、LEAD 和累计 SUM。
- 理解 PARTITION BY、ORDER BY、窗口框架。

## 核心语法

```sql
function_name(...) OVER (
  [PARTITION BY ...]
  [ORDER BY ...]
  [ROWS/RANGE frame]
)
```

## 关键注意点

- 窗口函数不会像 GROUP BY 那样压缩行数。
- 排名类函数通常需要 ORDER BY。
- ROWS BETWEEN 可控制累计范围。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT
  department_id,
  employee_name,
  salary,
  ROW_NUMBER() OVER (
    PARTITION BY department_id
    ORDER BY salary DESC
  ) AS row_no
FROM employees;

SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM orders;
```
