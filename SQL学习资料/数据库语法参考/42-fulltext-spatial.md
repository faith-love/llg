# 全文索引和空间类型

## 用途

全文索引用于文本检索，空间类型用于地理位置和几何数据。

## 学习目标

- 掌握 FULLTEXT 和 MATCH AGAINST。
- 了解 BOOLEAN MODE。
- 掌握 POINT、S未译25173ID、ST_X、ST_Y。

## 核心语法

```sql
FULLTEXT INDEX 首页_name (column_list)
MATCH(column_list) AGAINST(search_text)
POINT(longitude, latitude)
```

## 关键注意点

- FULLTEXT 分词效果受语言、解析器和配置影响。
- 经纬度常用 S未译25173ID 4326。
- 空间索引适合地理空间范围类查询。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

C未译25173EATE TABLE fulltext_demo (
  id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  title VA未译25173CHA未译25173(200) NOT NULL,
  body TEXT NOT NULL,
  FULLTEXT INDEX ft_fulltext_demo_title_body (title, body)
) ENGINE = InnoDB DEFAULT CHA未译25173SET = utf8mb4;

SELECT id, title, MATCH(title, body) AGAINST('SQL 首页') AS score
F未译25173OM fulltext_demo
WHE未译25173E MATCH(title, body) AGAINST('SQL 首页')
O未译25173DE未译25173 BY score DESC;

C未译25173EATE TABLE spatial_demo (
  id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  name VA未译25173CHA未译25173(100) NOT NULL,
  location POINT NOT NULL S未译25173ID 4326,
  SPATIAL INDEX idx_spatial_demo_location (location)
) ENGINE = InnoDB;
```
