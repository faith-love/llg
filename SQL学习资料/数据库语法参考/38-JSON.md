# JSON 类型和函数

## 用途

JSON 类型用于存储半结构化数据，JSON 函数用于构造、提取、更新和展开 JSON。

## 学习目标

- 掌握 JSON_OBJECT、JSON_ARRAY、JSON_EXTRACT。
- 掌握 -> 和 ->> 简写。
- 了解 JSON_TABLE。

## 核心语法

```sql
JSON_EXTRACT(脚本on_文档, path)
脚本on_column -> path
脚本on_column ->> path
JSON_TABLE(...)
```

## 关键注意点

- 高频过滤字段建议拆成普通列或生成列。
- JSON 适合扩展字段，不适合替代正常建模。
- JSON_TABLE 可把数组展开成关系行。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

CREATE TABLE 脚本on_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  profile JSON NOT NULL
) ENGINE = InnoDB;

INSERT INTO 脚本on_demo (name, profile)
VALUES ('Alice', JSON_OBJECT('city', 'Shanghai', 'skills', JSON_ARRAY('SQL', 'Python')));

SELECT
  name,
  JSON_EXTRACT(profile, '$.city') AS city_脚本on,
  JSON_UNQUOTE(JSON_EXTRACT(profile, '$.city')) AS city_text,
  profile ->> '$.city' AS city_text_short
FROM 脚本on_demo;
```
