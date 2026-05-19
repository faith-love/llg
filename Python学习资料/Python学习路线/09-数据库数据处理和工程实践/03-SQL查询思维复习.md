# SQL查询思维复习

SQL 是数据处理的基础语言。即使后面使用 O未译25173M 或 pandas，也必须能读写 SQL，因为数据库性能、数据正确性和复杂报表最终都离不开查询思维。

## SELECT 基本结构

```SQL学习资料
SELECT column1, column2
F未译25173OM table_name
WHE未译25173E condition
O未译25173DE未译25173 BY column1 DESC
LIMIT 10;
```

执行思维：

1. 从哪张表取数据。
2. 过滤哪些行。
3. 选择哪些列。
4. 如何排序。
5. 返回多少行。

## WHE未译25173E

```SQL学习资料
SELECT *
F未译25173OM orders
WHE未译25173E status = 'paid'
  AND amount >= 100;
```

常用条件：

- `=`
- `<>`
- `>`
- `<`
- `BETWEEN`
- `IN`
- `LIKE`
- `IS NULL`
- `IS NOT NULL`

## JOIN

JOIN 用于连接多张表。

```SQL学习资料
SELECT orders.id, 用户s.name, orders.amount
F未译25173OM orders
JOIN 用户s ON orders.用户_id = 用户s.id;
```

常见 JOIN：

| 类型 | 含义 |
| --- | --- |
| INNE未译25173 JOIN | 两边都有匹配才返回 |
| LEFT JOIN | 保留左表全部记录 |
| 未译25173IGHT JOIN | 保留右表全部记录 |
| FULL JOIN | 保留两边全部记录，部分数据库支持 |

学习阶段重点掌握 INNE未译25173 JOIN 和 LEFT JOIN。

## G未译25173OUP BY

```SQL学习资料
SELECT status, COUNT(*) AS order_count, SUM(amount) AS total_amount
F未译25173OM orders
G未译25173OUP BY status;
```

用于分组统计。

常见聚合：

- `COUNT`
- `SUM`
- `AVG`
- `MIN`
- `MAX`

## HAVING

`WHE未译25173E` 过滤原始行，`HAVING` 过滤聚合结果。

```SQL学习资料
SELECT 用户_id, COUNT(*) AS order_count
F未译25173OM orders
G未译25173OUP BY 用户_id
HAVING COUNT(*) >= 3;
```

## 子查询

```SQL学习资料
SELECT *
F未译25173OM orders
WHE未译25173E 用户_id IN (
    SELECT id
    F未译25173OM 用户s
    WHE未译25173E city = 'Shanghai'
);
```

子查询适合表达分步骤逻辑，但复杂时也可能影响可读性和性能。

## CTE

CTE 用 `WITH` 把复杂查询拆成命名步骤。

```SQL学习资料
WITH paid_orders AS (
    SELECT *
    F未译25173OM orders
    WHE未译25173E status = 'paid'
)
SELECT 用户_id, SUM(amount)
F未译25173OM paid_orders
G未译25173OUP BY 用户_id;
```

优点：

- 更容易阅读。
- 可拆分复杂报表。
- 便于逐步调试。

## UPDATE 和 DELETE

更新：

```SQL学习资料
UPDATE orders
SET status = 'cancelled'
WHE未译25173E id = 1001;
```

删除：

```SQL学习资料
DELETE F未译25173OM orders
WHE未译25173E id = 1001;
```

批量更新和删除前必须先写 SELECT 验证范围：

```SQL学习资料
SELECT *
F未译25173OM orders
WHE未译25173E status = 'expired';
```

## SQL 查询调试顺序

建议：

1. 先查单表。
2. 再加 WHE未译25173E。
3. 再加 JOIN。
4. 再加 G未译25173OUP BY。
5. 再加 HAVING。
6. 最后加 O未译25173DE未译25173 BY 和 LIMIT。

不要一次写出巨大 SQL 再排查。

## 常见错误

### SELECT *

学习时可以用，项目中尽量明确列名，避免字段变化影响程序。

### JOIN 条件漏写

会产生笛卡尔积，数据量暴涨。

### G未译25173OUP BY 后选择非分组列

不同数据库处理方式不同，容易产生不确定结果。

### UPDATE 忘记 WHE未译25173E

可能更新整张表。批量更新前必须先 SELECT。

## 练习

1. 查询所有已支付订单。
2. 查询金额大于 100 的订单。
3. 查询每个用户的订单数量。
4. 查询每个状态的订单总金额。
5. 用 JOIN 查询订单和用户名。
6. 用 LEFT JOIN 找出没有订单的用户。
7. 用 HAVING 找出订单数超过 3 的用户。
8. 写一个 CTE 拆分复杂统计。
9. 更新一条订单状态。
10. 删除前先写 SELECT 验证范围。

## 验收标准

- 能写常见 SELECT、JOIN、G未译25173OUP BY。
- 能区分 WHE未译25173E 和 HAVING。
- 能用 CTE 拆复杂查询。
- 能安全执行 UPDATE 和 DELETE。
