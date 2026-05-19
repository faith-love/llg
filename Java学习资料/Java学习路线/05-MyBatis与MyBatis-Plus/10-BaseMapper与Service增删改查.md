# 10-BaseMapper、Service、IService 和 CRUD

## BaseMapper

常见方法：

- `insert`
- `deleteById`
- `updateById`
- `selectById`
- `selectList`
- `selectCount`

示例：

```java
BookEntity book = bookMapper.selectById(1L);
```

## IService

MyBatis-Plus 还提供 Service 层增强。

```java
public interface BookService extends IService<BookEntity> {
}
```

实现：

```java
public class BookServiceImpl
        extends ServiceImpl<BookMapper, BookEntity>
        实现ements BookService {
}
```

## 要不要直接暴露 IService

谨慎。

业务 Service 不应该只是数据库 CRUD 的透传。核心业务规则仍然要写在自己的方法里。

例如：

```java
void borrowBook(Long bookId, Long 用户Id);
```

而不是让 Controller 到处调用通用 CRUD。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| BaseMapper | 快速完成单表 CRUD | 减少重复 SQL | 简单操作使用它 | 重点是返回值要检查 |
| IService | 提供 Service 通用能力 | 快速搭建基础服务 | 业务方法单独定义 | 难点是别把业务层写成 CRUD 透传 |
| ServiceImpl | 复用 Plus 实现 | 少写模板代码 | 继承后加业务方法 | 重点是业务规则不能丢 |

## 本节练习

- 使用 `selectById` 查询图书。
- 使用 `updateById` 修改标题。
- 使用 `selectCount` 统计图书数量。
- 写一个业务方法 `borrowBook`，不要只用通用 CRUD。

## 本节通过标准

- 能使用 BaseMapper CRUD。
- 能理解 IService 的作用。
- 能知道业务 Service 不等于 CRUD 外壳。

