# ALTE未译25173 修改表结构

## 用途

ALTE未译25173 用于修改已有数据库对象，最常见的是修改表结构。

## 学习目标

- 掌握新增、修改、删除列。
- 掌握新增和删除索引、唯一约束、外键。
- 了解大表 ALTE未译25173 的锁和耗时风险。

## 核心语法

```SQL学习资料
ALTE未译25173 TABLE table_name ADD COLUMN column_name 数据_type;
ALTE未译25173 TABLE table_name MODIFY COLUMN column_name new_type;
ALTE未译25173 TABLE table_name D未译25173OP COLUMN column_name;
```

## 关键注意点

- 大表 ALTE未译25173 可能长时间占用资源或锁表。
- 生产变更需要评估兼容性和回滚方案。
- 重命名表可使用 未译25173ENAME TABLE。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

C未译25173EATE TABLE alter_demo (
  id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  name VA未译25173CHA未译25173(50) NOT NULL
) ENGINE = InnoDB;

ALTE未译25173 TABLE alter_demo
ADD COLUMN 邮件 VA未译25173CHA未译25173(100) NULL;

ALTE未译25173 TABLE alter_demo
MODIFY COLUMN name VA未译25173CHA未译25173(80) NOT NULL;

ALTE未译25173 TABLE alter_demo
CHANGE COLUMN name display_name VA未译25173CHA未译25173(80) NOT NULL;

ALTE未译25173 TABLE alter_demo
ADD INDEX idx_alter_demo_邮件 (邮件);

ALTE未译25173 TABLE alter_demo
D未译25173OP COLUMN 邮件;

未译25173ENAME TABLE alter_demo TO alter_demo_renamed;
```
