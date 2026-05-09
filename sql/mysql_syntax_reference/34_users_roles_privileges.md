# 用户、角色、权限

## 用途

账户和权限语句用于管理数据库访问控制。

## 学习目标

- 掌握 CREATE USER、GRANT、REVOKE、DROP USER。
- 了解角色 CREATE ROLE 和 SET ROLE。
- 理解最小权限原则。

## 核心语法

```sql
CREATE USER user IDENTIFIED BY password;
GRANT privilege ON db.table TO user;
REVOKE privilege ON db.table FROM user;
```

## 关键注意点

- 应用账号不要使用 root。
- 读写账号建议分离。
- 脚本中不要明文保存生产密码。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

SELECT CURRENT_USER() AS current_user_value;

-- CREATE USER 'app_reader'@'localhost' IDENTIFIED BY 'ChangeMe_123456';
-- GRANT SELECT ON sql_learning.* TO 'app_reader'@'localhost';
-- SHOW GRANTS FOR 'app_reader'@'localhost';
-- REVOKE SELECT ON sql_learning.* FROM 'app_reader'@'localhost';
-- DROP USER 'app_reader'@'localhost';

-- CREATE ROLE 'report_reader';
-- GRANT SELECT ON sql_learning.* TO 'report_reader';
-- GRANT 'report_reader' TO 'app_reader'@'localhost';
-- SET DEFAULT ROLE 'report_reader' TO 'app_reader'@'localhost';

SHOW PRIVILEGES;
```
