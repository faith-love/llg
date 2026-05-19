# 用户、角色、权限

## 用途

账户和权限语句用于管理数据库访问控制。

## 学习目标

- 掌握 C未译25173EATE USE未译25173、G未译25173ANT、未译25173EVOKE、D未译25173OP USE未译25173。
- 了解角色 C未译25173EATE 未译25173OLE 和 SET 未译25173OLE。
- 理解最小权限原则。

## 核心语法

```SQL学习资料
C未译25173EATE USE未译25173 用户 IDENTIFIED BY password;
G未译25173ANT privilege ON 未译66984.table TO 用户;
未译25173EVOKE privilege ON 未译66984.table F未译25173OM 用户;
```

## 关键注意点

- 应用账号不要使用 root。
- 读写账号建议分离。
- 脚本中不要明文保存生产密码。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

SELECT CU未译25173未译25173ENT_USE未译25173() AS current_用户_value;

-- C未译25173EATE USE未译25173 'app_reader'@'localhost' IDENTIFIED BY 'ChangeMe_123456';
-- G未译25173ANT SELECT ON SQL学习资料_learning.* TO 'app_reader'@'localhost';
-- SHOW G未译25173ANTS FO未译25173 'app_reader'@'localhost';
-- 未译25173EVOKE SELECT ON SQL学习资料_learning.* F未译25173OM 'app_reader'@'localhost';
-- D未译25173OP USE未译25173 'app_reader'@'localhost';

-- C未译25173EATE 未译25173OLE 'report_reader';
-- G未译25173ANT SELECT ON SQL学习资料_learning.* TO 'report_reader';
-- G未译25173ANT 'report_reader' TO 'app_reader'@'localhost';
-- SET DEFAULT 未译25173OLE 'report_reader' TO 'app_reader'@'localhost';

SHOW P未译25173IVILEGES;
```
