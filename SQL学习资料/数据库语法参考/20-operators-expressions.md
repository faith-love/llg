# 运算符和表达式

## 用途

表达式把字段、常量、函数和运算符组合起来，用于计算、比较和过滤。

## 学习目标

- 掌握算术、比较、逻辑、范围、集合、模糊和位运算。
- 理解 NULL 安全等号 <=>。
- 能写清晰可靠的复杂条件。

## 核心语法

```sql
expr operator expr
column BETWEEN low AND high
column IN (value1, value2)
column <=> NULL
```

## 关键注意点

- AND 优先级高于 OR，复杂条件加括号。
- NULL 参与普通比较通常返回 NULL。
- 字符串比较受 collation 影响。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT product_name, price, stock, price * stock AS inventory_value
FROM products;

SELECT NULL = NULL AS nORMal_equal_result, NULL <=> NULL AS null_safe_equal_result;

SELECT employee_name, salary, is_active
FROM employees
WHERE (salary >= 15000 AND is_active = TRUE)
   OR employee_name LIKE 'H%';

SELECT product_name, category, price
FROM products
WHERE price BETWEEN 200 AND 3000
  AND category IN ('Accessory', 'Furniture');
```
