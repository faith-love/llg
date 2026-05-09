# 15-阶段项目：图书数据访问层

## 项目目标

为图书系统完成数据访问层，分别使用 MyBatis 和 MyBatis-Plus 实现核心功能。

目标不是重复写两套所有功能，而是理解两者边界。

## 必做功能

MyBatis：

- `findById`
- `findByIsbn`
- 多条件分页查询。
- 图书和分类 join 查询。
- 批量插入。
- 动态更新。

MyBatis-Plus：

- `insert`
- `selectById`
- `updateById`
- `deleteById` 逻辑删除。
- LambdaQueryWrapper 条件查询。
- 分页插件。
- 乐观锁更新。
- 自动填充创建/更新时间。

## 推荐结构

```text
mapper/
  BookMapper.java
  BookPlusMapper.java
resources/mapper/
  BookMapper.xml
domain/entity/
  BookEntity.java
```

## 项目知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| MyBatis XML | 处理复杂查询 | SQL 可控 | join、统计、动态 SQL 放 XML | 重点是可读和可优化 |
| Plus CRUD | 处理简单单表 | 快速减少样板代码 | 单表常规操作用 | 重点是不要绕过业务 Service |
| 数据访问测试 | 验证 SQL 正确 | SQL 错误运行时才暴露 | 每个关键 Mapper 写测试 | 重点是覆盖失败和边界 |

## 验收标准

- MyBatis XML 至少 5 个方法。
- Plus 至少使用 5 个通用方法或功能。
- 有分页查询。
- 有动态 SQL。
- 有逻辑删除。
- 有乐观锁。
- 有 SQL 日志观察记录。
- 有 N+1 风险说明。

