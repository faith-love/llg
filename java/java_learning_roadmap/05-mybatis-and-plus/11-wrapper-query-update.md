# 11-Wrapper 条件构造器

## Wrapper 是什么

Wrapper 用 Java 代码构造 SQL 条件。

```java
LambdaQueryWrapper<BookEntity> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(BookEntity::getDeleted, false)
       .like(BookEntity::getTitle, "Java")
       .orderByDesc(BookEntity::getCreatedAt);
```

## LambdaQueryWrapper

推荐优先使用 Lambda 版本，避免字段名字符串写错。

```java
bookMapper.selectList(
    Wrappers.<BookEntity>lambdaQuery()
        .eq(BookEntity::getCategoryId, categoryId)
);
```

## 条件判断

很多方法支持 condition 参数：

```java
wrapper.like(keyword != null && !keyword.isBlank(), BookEntity::getTitle, keyword);
```

避免手写大量 if。

## UpdateWrapper

```java
LambdaUpdateWrapper<BookEntity> wrapper = new LambdaUpdateWrapper<>();
wrapper.eq(BookEntity::getId, id)
       .set(BookEntity::getTitle, title);
bookMapper.update(null, wrapper);
```

更新条件必须明确。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| Wrapper | 用代码构造条件 | 简单条件不用写 XML | 简短查询可用 | 重点是可读性 |
| LambdaWrapper | 避免字段字符串 | 重构更安全 | 优先 Lambda 版本 | 难点是方法引用和字段映射 |
| condition 参数 | 动态拼条件 | 少写 if | 可选条件统一处理 | 重点是空值判断 |
| UpdateWrapper | 构造更新条件 | 灵活更新 | 必须带明确 where | 重点是防止全表更新 |

## 本节练习

- 用 LambdaQueryWrapper 查询标题包含 Java 的图书。
- 添加可选分类条件。
- 按创建时间倒序。
- 用 LambdaUpdateWrapper 更新标题。
- 故意不加条件，说明风险。

## 本节通过标准

- 能使用 LambdaQueryWrapper。
- 能写可选查询条件。
- 能使用 UpdateWrapper 并避免全表更新。

