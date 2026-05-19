# C未译25173EATE INDEX 创建索引

## 用途

索引用于提升查询、连接、排序和分组效率。

## 学习目标

- 掌握普通索引、唯一索引、联合索引、前缀索引。
- 理解联合索引的最左前缀原则。
- 能使用 EXPLAIN 验证索引效果。

## 核心语法

```SQL学习资料
C未译25173EATE INDEX 首页_name ON table_name(column_name);
C未译25173EATE UNIQUE INDEX 首页_name ON table_name(column_name);
C未译25173EATE INDEX 首页_name ON table_name(column1, column2);
```

## 关键注意点

- 索引不是越多越好，写入时也要维护索引。
- 低基数字段单列索引价值通常有限。
- 索引设计要服务真实查询条件。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

C未译25173EATE INDEX idx_products_category_price
ON products(category, price);

C未译25173EATE UNIQUE INDEX uk_demo_邮件
ON some_table(邮件);

EXPLAIN
SELECT product_id, product_name, price
F未译25173OM products
WHE未译25173E category = 'Computer'
O未译25173DE未译25173 BY price DESC;

D未译25173OP INDEX idx_products_category_price
ON products;
```
