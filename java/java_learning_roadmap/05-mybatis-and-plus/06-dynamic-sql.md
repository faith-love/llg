# 06-动态 SQL

## 动态 SQL 解决什么问题

查询条件经常是可选的。

例如图书列表：

- 标题可选。
- 作者可选。
- 分类可选。
- 状态可选。

如果手动拼字符串，容易错。MyBatis 提供动态 SQL 标签。

## if

```xml
<if test="title != null and title != ''">
    and title like concat('%', #{title}, '%')
</if>
```

## where

`<where>` 会自动处理开头多余的 `and`。

```xml
<where>
    <if test="title != null and title != ''">
        and title like concat('%', #{title}, '%')
    </if>
</where>
```

## set

动态更新：

```xml
<set>
    <if test="title != null">title = #{title},</if>
    <if test="author != null">author = #{author},</if>
</set>
```

## foreach

批量查询：

```xml
where id in
<foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
</foreach>
```

## choose

类似 switch：

```xml
<choose>
    <when test="isbn != null">isbn = #{isbn}</when>
    <otherwise>deleted = 0</otherwise>
</choose>
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| `<if>` | 根据条件拼 SQL | 可选查询条件更清晰 | 判断空字符串和 null | 重点是条件表达式 |
| `<where>` | 自动处理 where/and | 避免 SQL 多余 and | 条件查询优先用 | 重点是别手写 `where 1=1` 依赖过重 |
| `<set>` | 动态 update | 只更新传入字段 | 配合非空字段更新 | 难点是字段设为 null 的语义 |
| `<foreach>` | 处理集合参数 | 支持 in 和批量操作 | 空集合要提前处理 | 重点是 collection 名称 |
| `<choose>` | 多分支 SQL | 避免多个条件互相冲突 | 只允许一个分支命中 | 重点是业务优先级 |

## 本节练习

- 写图书多条件查询。
- 写动态更新图书。
- 写批量按 ID 查询。
- 处理空 ID 集合。

## 本节通过标准

- 能写常见动态 SQL。
- 能避免多余 and 和逗号。
- 能处理集合参数。

