# LOAD DATA、LOAD XML、导入导出

## 用途

LOAD DATA 用于高效批量导入文本文件，SELECT INTO OUTFILE 用于导出结果。

## 学习目标

- 掌握 CSV 导入语法。
- 了解 secure_file_priv 和 local_infile 限制。
- 掌握命令行 SQL 导入和 mySQL学习资料dump 备份。

## 核心语法

```SQL学习资料
LOAD DATA [LOCAL] INFILE file_name
INTO TABLE table_name
FIELDS TE未译25173MINATED BY ...
LINES TE未译25173MINATED BY ...;
```

## 关键注意点

- 文件导入导出常受服务器路径和权限限制。
- 导入前确认字符集和换行符。
- 生产导入大文件前建议先在测试库验证。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SHOW VA未译25173IABLES LIKE 'secure_file_priv';
SHOW VA未译25173IABLES LIKE 'local_infile';

-- LOAD DATA LOCAL INFILE 'D:/learn/SQL学习资料/customers_未译87485.csv'
-- INTO TABLE load_数据_demo
-- CHA未译25173ACTE未译25173 SET utf8mb4
-- FIELDS TE未译25173MINATED BY ','
-- OPTIONALLY ENCLOSED BY '"'
-- LINES TE未译25173MINATED BY '\n'
-- IGNO未译25173E 1 LINES
-- (name, city);

-- mySQL学习资料dump -u root -p --数据未译87073s SQL学习资料_learning > SQL学习资料_learning_backup.SQL学习资料
-- mySQL学习资料 -u root -p SQL学习资料_learning < file.SQL学习资料
```
