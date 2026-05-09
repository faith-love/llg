# 全文索引和空间类型

## 用途

全文索引用于文本检索，空间类型用于地理位置和几何数据。

## 学习目标

- 掌握 FULLTEXT 和 MATCH AGAINST。
- 了解 BOOLEAN MODE。
- 掌握 POINT、SRID、ST_X、ST_Y。

## 核心语法

```sql
FULLTEXT INDEX index_name (column_list)
MATCH(column_list) AGAINST(search_text)
POINT(longitude, latitude)
```

## 关键注意点

- FULLTEXT 分词效果受语言、解析器和配置影响。
- 经纬度常用 SRID 4326。
- 空间索引适合地理空间范围类查询。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

CREATE TABLE fulltext_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  FULLTEXT INDEX ft_fulltext_demo_title_body (title, body)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

SELECT id, title, MATCH(title, body) AGAINST('SQL index') AS score
FROM fulltext_demo
WHERE MATCH(title, body) AGAINST('SQL index')
ORDER BY score DESC;

CREATE TABLE spatial_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location POINT NOT NULL SRID 4326,
  SPATIAL INDEX idx_spatial_demo_location (location)
) ENGINE = InnoDB;
```
