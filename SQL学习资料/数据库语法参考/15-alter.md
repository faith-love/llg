# ALTER 修改表结构

## 用途

ALTER 用于修改已有数据库对象，最常见的是修改表结构。

## 学习目标

- 掌握新增、修改、删除列。
- 掌握新增和删除索引、唯一约束、外键。
- 了解大表 ALTER 的锁和耗时风险。

## 核心语法

```sql
ALTER TABLE table_name ADD COLUMN column_name 数据_type;
ALTER TABLE table_name MODIFY COLUMN column_name new_type;
ALTER TABLE table_name DROP COLUMN column_name;
```

## 关键注意点

- 大表 ALTER 可能长时间占用资源或锁表。
- 生产变更需要评估兼容性和回滚方案。
- 重命名表可使用 RENAME TABLE。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

CREATE TABLE alter_demo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

ALTER TABLE alter_demo
ADD COLUMN 邮件 VARCHAR(100) NULL;

ALTER TABLE alter_demo
MODIFY COLUMN name VARCHAR(80) NOT NULL;

ALTER TABLE alter_demo
CHANGE COLUMN name display_name VARCHAR(80) NOT NULL;

ALTER TABLE alter_demo
ADD INDEX idx_alter_demo_邮件 (邮件);

ALTER TABLE alter_demo
DROP COLUMN 邮件;

RENAME TABLE alter_demo TO alter_demo_renamed;
```
