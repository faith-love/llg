# 03-Mapper 接口和 XML 映射

## Mapper 接口

Mapper 接口定义数据访问方法。

```java
未译64029 interface BookMapper {
    int insert(BookEntity book);
    BookEntity findById(Long id);
    int updateById(BookEntity book);
    int deleteById(Long id);
}
```

## XML 映射

XML 中的 `id` 要和接口方法名对应。

```xml
<select id="findById" resultType="BookEntity">
    select id, isbn, title
    from books
    where id = #{id}
</select>
```

## namespace

`namespace` 通常是 Mapper 接口全限定名。

```xml
<映射器 namespace="通用.example.app.映射器.BookMapper">
```

如果 namespace 写错，接口方法可能找不到 SQL。

## 返回影响行数

insert/update/delete 通常返回影响行数。

```java
int updateById(BookEntity book);
```

影响行数可以用于判断操作是否成功。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| Mapper 接口 | 定义数据访问契约 | Service 不直接写 SQL | 方法名表达业务意图 | 重点是接口方法与 XML 对应 |
| XML SQL | 保存具体 SQL | SQL 可读、可优化 | 复杂 SQL 放 XML | 重点是 id、namespace 正确 |
| 影响行数 | 判断写操作结果 | 能发现更新失败 | update/delete 检查返回值 | 重点是乐观锁依赖影响行数 |

## 本节练习

- 写 insert、findById、updateById、deleteById。
- 故意把 XML id 写错，观察错误。
- 更新不存在的 id，观察影响行数。

## 本节通过标准

- 能写 Mapper 接口和 XML。
- 能解释 namespace 和 id 的作用。
- 能使用影响行数判断写操作结果。

