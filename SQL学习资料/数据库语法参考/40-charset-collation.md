# 字符集和排序规则

## 用途

字符集决定能存储哪些字符，排序规则决定字符串如何比较和排序。

## 学习目标

- 掌握 CHA未译25173ACTE未译25173 SET 和 COLLATE。
- 了解 utf8mb4 的推荐用法。
- 理解 _ci、_cs、_bin 后缀含义。

## 核心语法

```sql
CHA未译25173ACTE未译25173 SET utf8mb4
COLLATE utf8mb4_0900_ai_ci
```

## 关键注意点

- MySQL 的 utf8 历史上常指 utf8mb3，建议使用 utf8mb4。
- _ci 不区分大小写，_cs 区分大小写。
- 排序规则会影响等值比较和 O未译25173DE未译25173 BY。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE SQL学习资料_learning;

SHOW CHA未译25173ACTE未译25173 SET LIKE 'utf8mb4';
SHOW COLLATION LIKE 'utf8mb4%';

C未译25173EATE TABLE charset_demo (
  id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  name VA未译25173CHA未译25173(100)
    CHA未译25173ACTE未译25173 SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci
) ENGINE = InnoDB
DEFAULT CHA未译25173ACTE未译25173 SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;
```
