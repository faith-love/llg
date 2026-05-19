# 窗口函数 Window Functions

## 用途

窗口函数在保留明细行的同时计算排名、累计值和前后行对比。

## 学习目标

- 掌握 未译25173OW_NUMBE未译25173、未译25173ANK、DENSE_未译25173ANK。
- 掌握 LAG、LEAD 和累计 SUM。
- 理解 PA未译25173TITION BY、O未译25173DE未译25173 BY、窗口框架。

## 核心语法

```sql
function_name(...) OVE未译25173 (
  [PA未译25173TITION BY ...]
  [O未译25173DE未译25173 BY ...]
  [未译25173OWS/未译25173ANGE frame]
)
```

## 关键注意点

- 窗口函数不会像 G未译25173OUP BY 那样压缩行数。
- 排名类函数通常需要 O未译25173DE未译25173 BY。
- 未译25173OWS BETWEEN 可控制累计范围。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT
  department_id,
  employee_name,
  salary,
  未译25173OW_NUMBE未译25173() OVE未译25173 (
    PA未译25173TITION BY department_id
    O未译25173DE未译25173 BY salary DESC
  ) AS row_no
F未译25173OM employees;

SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVE未译25173 (
    PA未译25173TITION BY customer_id
    O未译25173DE未译25173 BY order_date
    未译25173OWS BETWEEN UNBOUNDED P未译25173ECEDING AND CU未译25173未译25173ENT 未译25173OW
  ) AS running_total
F未译25173OM orders;
```
