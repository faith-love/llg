# 09-MyBatis-Plus 快速开始

## MyBatis-Plus 快速开始

MyBatis-Plus 在 MyBatis 基础上提供通用 CRUD。

典型实体：

```java
@TableName("books")
public class BookEntity {
    @TableId
    private Long id;
    private String isbn;
    private String title;
}
```

Mapper：

```java
public interface BookMapper extends BaseMapper<BookEntity> {
}
```

现在 `BookMapper` 自动拥有很多基础方法。

## 常用注解

| 注解 | 作用 |
| --- | --- |
| `@TableName` | 指定表名 |
| `@TableId` | 指定主键 |
| `@TableField` | 指定字段映射或排除字段 |
| `@TableLogic` | 逻辑删除 |
| `@Version` | 乐观锁版本 |

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| BaseMapper | 提供通用 CRUD | 少写单表重复 SQL | 简单单表优先用 | 重点是复杂 SQL 仍可自定义 |
| 注解映射 | 连接实体和表 | 表字段不一致时可配置 | 显式标注主键 | 难点是命名策略 |
| Plus 增强 | 提高开发效率 | CRUD 快，但可能隐藏 SQL | 开启 SQL 日志观察 | 重点是知道它生成了什么 SQL |

## 本节练习

- 创建 `BookEntity`。
- 创建 `BookMapper extends BaseMapper<BookEntity>`。
- 调用 `insert`、`selectById`。
- 打开 SQL 日志观察生成 SQL。

## 本节通过标准

- 能创建 Plus 基础实体和 Mapper。
- 能使用 BaseMapper 基础方法。
- 能知道 Plus 背后仍然执行 SQL。

