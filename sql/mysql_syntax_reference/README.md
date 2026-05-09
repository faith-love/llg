# MySQL 语法大全

本目录先参考 SQLZoo 教程页左侧 `Reference` 菜单拆分，再补充 MySQL 官方文档中 SQLZoo 没有覆盖的常用语法类别。每个主题都整理为独立 Markdown 文档，文档内包含用途、学习目标、核心语法、关键注意点和完整 SQL 示例。

参考分类来源：[SQLZoo SQL Tutorial](https://sqlzoo.net/wiki/SQL_Tutorial)

补充分类来源：[MySQL 8.4 Reference Manual - SQL Statements](https://dev.mysql.com/doc/refman/8.4/en/sql-statements.html)

## 文件顺序

1. [01_select.md](./01_select.md)：SELECT 查询基础
2. [02_functions.md](./02_functions.md)：Functions 常用函数
3. [03_select_where.md](./03_select_where.md)：SELECT .. WHERE 条件筛选
4. [04_select_group_by.md](./04_select_group_by.md)：SELECT .. GROUP BY 分组聚合
5. [05_select_join.md](./05_select_join.md)：SELECT .. JOIN 多表连接
6. [06_select_subquery.md](./06_select_subquery.md)：SELECT .. SELECT 子查询
7. [07_insert_values.md](./07_insert_values.md)：INSERT .. VALUES 插入数据
8. [08_insert_select.md](./08_insert_select.md)：INSERT .. SELECT 查询结果插入
9. [09_update.md](./09_update.md)：UPDATE 更新数据
10. [10_delete.md](./10_delete.md)：DELETE 删除数据
11. [11_create_table.md](./11_create_table.md)：CREATE TABLE 创建表
12. [12_create_view.md](./12_create_view.md)：CREATE VIEW 创建视图
13. [13_create_index.md](./13_create_index.md)：CREATE INDEX 创建索引
14. [14_drop.md](./14_drop.md)：DROP 删除数据库对象
15. [15_alter.md](./15_alter.md)：ALTER 修改表结构
16. [16_union.md](./16_union.md)：UNION 合并结果集
17. [17_left_join.md](./17_left_join.md)：LEFT JOIN 左连接
18. [18_null.md](./18_null.md)：NULL 空值处理
19. [19_data_types.md](./19_data_types.md)：数据类型 Data Types
20. [20_operators_expressions.md](./20_operators_expressions.md)：运算符和表达式
21. [21_select_clauses_order_limit.md](./21_select_clauses_order_limit.md)：SELECT 子句补充
22. [22_case_conditional.md](./22_case_conditional.md)：CASE、IF 和条件表达式
23. [23_with_cte.md](./23_with_cte.md)：WITH / CTE 公用表表达式
24. [24_window_functions.md](./24_window_functions.md)：窗口函数 Window Functions
25. [25_set_operations.md](./25_set_operations.md)：集合运算 Set Operations
26. [26_replace_values_table.md](./26_replace_values_table.md)：REPLACE、VALUES、TABLE
27. [27_load_data_import_export.md](./27_load_data_import_export.md)：LOAD DATA、LOAD XML、导入导出
28. [28_transactions_savepoints.md](./28_transactions_savepoints.md)：事务、COMMIT、ROLLBACK、SAVEPOINT
29. [29_locks.md](./29_locks.md)：锁 Locks
30. [30_prepared_statements.md](./30_prepared_statements.md)：预处理语句 Prepared Statements
31. [31_stored_programs.md](./31_stored_programs.md)：存储程序 Stored Programs
32. [32_triggers_events.md](./32_triggers_events.md)：触发器和事件
33. [33_variables_set_show.md](./33_variables_set_show.md)：变量、SET、SHOW
34. [34_users_roles_privileges.md](./34_users_roles_privileges.md)：用户、角色、权限
35. [35_describe_explain_utility.md](./35_describe_explain_utility.md)：USE、DESCRIBE、EXPLAIN 等工具语句
36. [36_table_maintenance.md](./36_table_maintenance.md)：表维护语句
37. [37_partitioning.md](./37_partitioning.md)：分区表 Partitioning
38. [38_json.md](./38_json.md)：JSON 类型和函数
39. [39_generated_columns.md](./39_generated_columns.md)：生成列 Generated Columns
40. [40_charset_collation.md](./40_charset_collation.md)：字符集和排序规则
41. [41_information_schema.md](./41_information_schema.md)：INFORMATION_SCHEMA 元数据查询
42. [42_fulltext_spatial.md](./42_fulltext_spatial.md)：全文索引和空间类型

## 版本说明

- 主体按 MySQL 8.0+ 编写。
- `INTERSECT`、`EXCEPT` 需要 MySQL 8.0.31+。
- `EXPLAIN ANALYZE` 需要 MySQL 8.0.18+。
- 如果使用 MySQL 5.7，CTE、窗口函数、JSON_TABLE、CHECK 约束等语法不可用或支持不完整。

## 使用方式

这些文档以说明为主，代码块中的 SQL 示例仍可以在 MySQL 8.0+ 环境中按需执行。危险操作示例尽量使用临时表、事务或注释形式保留。
