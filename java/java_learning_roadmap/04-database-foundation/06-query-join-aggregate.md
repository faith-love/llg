# 06-查询进阶：JOIN、聚合、排序和分组

## JOIN

JOIN 用于关联多张表。

图书和分类：

```sql
select b.id, b.title, c.name as category_name
from books b
left join categories c on b.category_id = c.id;
```

常见：

- inner join：只返回两边匹配的数据。
- left join：保留左表数据。

## 聚合函数

常见：

```sql
count(*)
sum(stock)
avg(price)
max(price)
min(price)
```

示例：

```sql
select category_id, count(*) as book_count
from books
group by category_id;
```

## group by

`group by` 用于分组统计。

```sql
select author, count(*) as total
from books
group by author;
```

## order by

排序：

```sql
select id, title
from books
order by created_at desc;
```

排序字段要注意索引，否则数据量大时可能慢。

## having

`where` 过滤分组前数据，`having` 过滤分组后的结果。

```sql
select author, count(*) as total
from books
group by author
having count(*) > 3;
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| JOIN | 关联多表数据 | 避免多次查询再手动拼 | 明确主表和关联条件 | 重点是 join 条件不能漏 |
| 聚合 | 统计数据 | 报表和数量统计必备 | count/sum/avg 常用 | 难点是 null 对聚合的影响 |
| group by | 分组统计 | 按分类、作者、状态统计 | select 字段要和分组逻辑一致 | 重点是分组粒度 |
| order by | 排序结果 | 列表展示常用 | 排序字段考虑索引 | 重点是大数据排序成本 |
| having | 过滤聚合结果 | where 无法过滤聚合值 | 分组后过滤用 having | 重点是和 where 区分 |

## 本节练习

- 查询图书及分类名。
- 按分类统计图书数量。
- 按作者统计图书数量。
- 查询图书数量超过 3 本的作者。
- 按创建时间倒序查询。

## 本节通过标准

- 能写基础 join。
- 能写 group by 统计。
- 能区分 where 和 having。
- 能知道排序可能带来性能成本。

