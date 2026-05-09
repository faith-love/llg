# 12-分页插件、逻辑删除、乐观锁和自动填充

## 分页插件

MyBatis-Plus 提供分页插件。

使用：

```java
Page<BookEntity> page = new Page<>(1, 20);
Page<BookEntity> result = bookMapper.selectPage(page, wrapper);
```

要限制 size 最大值，避免大分页拖垮系统。

## 逻辑删除

实体字段：

```java
@TableLogic
private Integer deleted;
```

删除时不是物理删除，而是更新 deleted 标记。

注意：唯一索引要考虑逻辑删除后的重复插入问题。

## 乐观锁

```java
@Version
private Integer version;
```

更新时 Plus 会带版本条件。更新失败时要判断并处理。

## 自动填充

常用于：

- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

需要实现填充处理器。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 分页插件 | 简化分页查询 | 少写 limit/offset | 限制 page size | 重点是分页不是无限查 |
| 逻辑删除 | 保留历史数据 | 防误删，但查询要过滤 | 统一字段和配置 | 难点是唯一索引冲突 |
| 乐观锁 | 防并发覆盖更新 | 冲突少时轻量 | 更新后检查结果 | 重点是失败要处理 |
| 自动填充 | 统一维护审计字段 | 避免每次手动 set | 只填通用字段 | 重点是插入和更新策略不同 |

## 本节练习

- 配置分页插件。
- 给图书加逻辑删除。
- 给图书加 version 乐观锁。
- 自动填充创建和更新时间。
- 测试逻辑删除后的查询结果。

## 本节通过标准

- 能使用 Plus 分页。
- 能配置逻辑删除。
- 能使用乐观锁。
- 能实现自动填充。

