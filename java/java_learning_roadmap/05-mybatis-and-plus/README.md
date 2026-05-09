# 00-章节导读：MyBatis 与 MyBatis-Plus

## 为什么单独成章

MyBatis 是 Java 后端非常常见的数据访问框架。MyBatis-Plus 又在 MyBatis 之上提供了大量 CRUD 增强。

它们需要单独学习，因为它们连接了两件事：

- 数据库 SQL 能力。
- Spring Boot 项目数据访问层。

如果只会复制 Mapper，很容易遇到：

- 参数绑定错误。
- SQL 注入风险。
- resultMap 映射混乱。
- 动态 SQL 拼错。
- N+1 查询。
- Plus Wrapper 写得不可读。
- 逻辑删除和唯一索引冲突。

## 推荐学习顺序

1. [MyBatis 与 MyBatis-Plus 的定位](01-positioning.md)
2. [MyBatis 快速开始和项目结构](02-mybatis-quickstart-structure.md)
3. [Mapper 接口和 XML 映射](03-mapper-interface-xml.md)
4. [参数绑定：#{}、${} 和 SQL 注入](04-parameter-binding.md)
5. [resultMap、对象映射和关联查询](05-resultmap-object-mapping.md)
6. [动态 SQL](06-dynamic-sql.md)
7. [分页、批量操作和 N+1 问题](07-pagination-batch-n-plus-one.md)
8. [缓存、插件和执行原理了解](08-cache-plugin-execution.md)
9. [MyBatis-Plus 快速开始](09-mybatis-plus-quickstart.md)
10. [BaseMapper、Service、IService 和 CRUD](10-basemapper-service-crud.md)
11. [Wrapper 条件构造器](11-wrapper-query-update.md)
12. [分页插件、逻辑删除、乐观锁和自动填充](12-plus-plugins-features.md)
13. [代码生成器和项目规范](13-code-generator-conventions.md)
14. [MyBatis 与 Plus 怎么选择](14-choose-mybatis-or-plus.md)
15. [阶段项目：图书数据访问层](15-library-dal-project.md)
16. [难点错误示例和避坑指南](16-pitfall-guide.md)
17. [通过标准和复盘清单](17-checkpoints.md)

## 小白先记住的主线

- MyBatis 让你掌控 SQL，同时减少 JDBC 样板代码。
- MyBatis-Plus 简化单表 CRUD，但不能替代 SQL 能力。
- `#{}` 是参数绑定，`${}` 是字符串替换。
- 复杂查询、报表、性能敏感 SQL，仍然要回到手写 SQL。
- Plus 的快捷方法要配合规范，否则会让查询条件散落且难维护。

