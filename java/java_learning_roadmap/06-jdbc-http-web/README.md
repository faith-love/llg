# 00-阶段导读：JDBC、HTTP 和 Web 衔接

## 这一阶段解决什么问题

前面你已经能写 Java 程序，也理解了一些 JVM、并发、数据库和 MyBatis 基础。现在要进入后端开发的核心链路：

```text
HTTP 请求 -> Controller -> Service -> Repository/Mapper -> Database -> JSON 响应
```

这一阶段的目标是让你知道：

- Java 怎么通过 JDBC 理解底层数据访问。
- 为什么 SQL 要参数化。
- 事务怎么保证业务一致性。
- HTTP 请求和响应由哪些部分组成。
- REST API 怎么设计得稳定清晰。
- Web 项目为什么要分层。

## 推荐学习顺序

1. [阶段目标](01-stage-goal.md)
2. [数据库基础和 Java 后端关系](02-database-foundation.md)
3. [JDBC：连接数据库和执行 SQL](03-jdbc-basics.md)
4. [PreparedStatement 和 ResultSet 映射](04-preparedstatement-resultset.md)
5. [事务、隔离级别和锁](05-transactions-isolation-locks.md)
6. [连接池、HikariCP 和 DAO 分层](06-connection-pool-dao.md)
7. [MyBatis 主线](07-mybatis-mainline.md)
8. [HTTP 基础](08-http-foundation.md)
9. [REST API 设计](09-rest-api-design.md)
10. [JSON、Cookie、Session、Token 和 CORS](10-json-cookie-session-token-cors.md)
11. [Web 分层、DTO 和 Entity](11-web-layering-dto-entity.md)
12. [参数校验、统一异常和状态码](12-validation-exception-status.md)
13. [分页、索引和慢查询](13-pagination-index-slow-query.md)
14. [阶段项目：图书 REST API](14-book-rest-api-project.md)
15. [难点错误示例和避坑指南](15-pitfall-guide.md)
16. [通过标准和复盘清单](16-checkpoints.md)

## 和 SQL 资料的关系

数据库基础已经单独拆到 [04-数据库基础](../04-database-foundation.md)，MyBatis 和 MyBatis-Plus 已经单独拆到 [05-MyBatis 与 MyBatis-Plus](../05-mybatis-and-plus.md)。

如果已经学习过 [D:\learn\sql](../../../sql/README.md) 中的 SQL 资料，可以直接复用 SQL 基础；但仍建议阅读 04，因为它更偏 Java 后端项目落地。

## 小白先记住的主线

- Controller 不直接操作数据库。
- Service 放业务规则和事务边界。
- Repository/Mapper 只负责数据访问。
- SQL 必须参数化，不能拼接用户输入。
- 事务要围绕一个完整业务动作设计。
- REST API 要让 URL、Method、状态码和响应结构保持一致。

## 本阶段产出

完成后应该有：

- 一个 JDBC 链路理解小项目。
- 一个图书 REST API 设计文档。
- 一份数据库表结构和初始化数据。
- 一组接口请求和响应示例。
- 一份错误响应规范。
- 一份分页和慢查询排查笔记。
