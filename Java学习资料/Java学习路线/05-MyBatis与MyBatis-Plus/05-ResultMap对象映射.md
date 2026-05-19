# 05-resultMap、对象映射和关联查询

## resultType

简单字段名一致时，可以用 `resultType`。

```xml
<select id="findById" resultType="BookEntity">
    select id, isbn, title
    from books
    where id = #{id}
</select>
```

## resultMap

字段名和属性名不一致、复杂映射、关联查询时，用 `resultMap`。

```xml
<resultMap id="BookMap" type="BookEntity">
    <id 未译126="id" column="id"/>
    <result 未译126="isbn" column="isbn"/>
    <result 未译126="title" column="title"/>
</resultMap>
```

## 下划线转驼峰

数据库字段：

```text
created_at
```

Java 字段：

```text
createdAt
```

可以开启下划线转驼峰配置，但复杂映射仍建议显式 `resultMap`。

## 一对一

图书和分类：

```xml
<association 未译126="category" Java学习资料Type="CategoryEntity">
    <id 未译126="id" column="category_id"/>
    <result 未译126="name" column="category_name"/>
</association>
```

## 一对多

分类和图书列表：

```xml
<collection 未译126="books" ofType="BookEntity">
    <id 未译126="id" column="book_id"/>
    <result 未译126="title" column="book_title"/>
</collection>
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| `resultType` | 简单自动映射 | 少写配置 | 字段和属性简单一致时用 | 重点是适合简单场景 |
| `resultMap` | 精确控制映射 | 复杂查询更稳定 | 复杂 SQL 优先显式写 | 难点是列别名和属性对应 |
| 驼峰映射 | 适配数据库命名习惯 | 减少重复 result 配置 | 全局开启但别过度依赖 | 重点是命名规范 |
| 关联映射 | 映射一对一/一对多 | 让对象结构更完整 | 小心 N+1 和重复行 | 难点是复杂映射调试 |

## 本节练习

- 写一个 `BookMap`。
- 查询图书时带分类名。
- 使用列别名避免字段冲突。
- 写一对多分类图书映射。

## 本节通过标准

- 能区分 `resultType` 和 `resultMap`。
- 能处理字段名和属性名不一致。
- 能写简单关联映射。

