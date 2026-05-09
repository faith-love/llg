# 00-章节导读：数据库基础

## 为什么数据库要单独成章

Java 后端的很多问题最后都会落到数据库：

- 数据怎么长期保存。
- 表结构能不能支撑业务。
- 并发修改会不会错。
- 查询为什么慢。
- 分页为什么越来越慢。
- 删除和更新会不会误伤数据。

所以数据库不能只作为 JDBC 或 MyBatis 的附属知识，而应该单独系统学习。

## 推荐学习顺序

1. [数据库在后端中的作用](01-database-role.md)
2. [关系模型、表、行、列和主键](02-relational-model.md)
3. [数据类型和字段设计](03-data-types-column-design.md)
4. [约束：主键、唯一、非空、外键和检查](04-constraints.md)
5. [SQL 基础：增删改查](05-sql-crud.md)
6. [查询进阶：JOIN、聚合、排序和分组](06-query-join-aggregate.md)
7. [表设计和范式/反范式](07-table-design-normalization.md)
8. [事务 ACID 和隔离级别](08-transaction-acid-isolation.md)
9. [锁、MVCC、乐观锁和悲观锁](09-lock-mvcc-optimistic-pessimistic.md)
10. [索引设计](10-index-design.md)
11. [分页、排序和深分页](11-pagination-sorting.md)
12. [慢查询和 EXPLAIN](12-slow-query-explain.md)
13. [备份、迁移和初始化脚本](13-backup-migration-init-script.md)
14. [阶段项目：图书数据库设计](14-library-database-project.md)
15. [难点错误示例和避坑指南](15-pitfall-guide.md)
16. [通过标准和复盘清单](16-checkpoints.md)

## 和已有 SQL 资料的关系

如果你已经学习 [D:\learn\sql](../../../sql/README.md)，这里会更偏 Java 后端项目落地：表设计、事务边界、索引决策、慢查询排查和初始化脚本。

## 小白先记住的主线

- 表设计先服务业务，不是字段越多越好。
- 主键负责唯一标识一行数据。
- 约束是数据库层面的底线。
- SQL 必须可读、可解释、可排查。
- 事务解决一组操作的一致性。
- 索引加速查询，但会增加写入成本。
- 慢查询先看执行计划，不要凭感觉加索引。

