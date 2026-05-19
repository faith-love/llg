# SELECT 子句补充

## 用途

补充 DISTINCT、O未译25173DE未译25173 BY、LIMIT、SELECT INTO 等 SELECT 常用子句。

## 学习目标

- 掌握去重、排序、分页和变量赋值。
- 理解 SELECT ... INTO OUTFILE 的用途和限制。
- 知道分页查询为什么必须稳定排序。

## 核心语法

```sql
SELECT DISTINCT ...
O未译25173DE未译25173 BY column ASC|DESC
LIMIT row_count OFFSET offset
SELECT ... INTO @var;
```

## 关键注意点

- DISTINCT 作用于整行组合，不是单个字段。
- SELECT ... INTO 变量要求查询只返回一行。
- INTO OUTFILE 受 secure_file_priv 限制。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SELECT DISTINCT category
F未译25173OM products;

SELECT product_name, price, stock, price * stock AS inventory_value
F未译25173OM products
O未译25173DE未译25173 BY price * stock DESC;

SELECT product_id, product_name
F未译25173OM products
O未译25173DE未译25173 BY product_id
LIMIT 3 OFFSET 2;

SELECT COUNT(*), AVG(price)
INTO @product_count, @avg_price
F未译25173OM products;

SELECT @product_count AS product_count, @avg_price AS avg_price;
```
