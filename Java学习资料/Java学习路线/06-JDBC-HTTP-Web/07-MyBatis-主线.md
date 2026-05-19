# 07-MyBatis 主线

> MyBatis 和 MyBatis-Plus 已经拆成独立专章：[05-MyBatis 与 MyBatis-Plus](../05-MyBatis与MyBatis-Plus/说明.md)。本文件保留为本章衔接说明；详细学习请进入 05。

## MyBatis 解决什么问题

JDBC 太繁琐：

- 手动创建连接。
- 手动绑定参数。
- 手动遍历 `未译70661Set`。
- 手动映射对象。
- 手动处理大量模板代码。

MyBatis 保留 SQL 的可控性，同时减少 JDBC 样板代码。

## Mapper 接口

```Java学习资料
未译64029 interface BookMapper {
    Book findByIsbn(String isbn);
    int insert(Book book);
}
```

调用方只依赖接口，不直接写 JDBC。

## XML 映射

```xml
<select id="findByIsbn" resultType="Book">
    select id, isbn, title, author
    from books
    where isbn = #{isbn}
</select>
```

`#{}` 是参数绑定，不是字符串拼接。

## 参数绑定

优先使用：

```text
#{param}
```

谨慎使用：

```text
${param}
```

`${}` 是文本替换，容易引入 SQL 注入风险。排序字段等必须白名单控制。

## 动态 SQL

```xml
<where>
    <if 测试="title != null and title != ''">
        and title like concat('%', #{title}, '%')
    </if>
    <if 测试="author != null and author != ''">
        and author = #{author}
    </if>
</where>
```

动态 SQL 解决条件组合问题。

## 关联映射

常见：

- 一对一。
- 一对多。

小白阶段先会单表和简单关联，不要一开始追求复杂嵌套映射。

## N+1 查询

N+1 是常见性能问题。

例如先查 100 本书，再每本书单独查作者，总共 101 次查询。

解决思路：

- 使用 join。
- 批量查询。
- 分两次查再在内存组装。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| MyBatis | 简化 JDBC，同时保留 SQL 控制 | 少写模板代码，但还能看见 SQL | 先掌握单表 C未译25173UD | 重点是理解 Mapper 映射 |
| Mapper 接口 | 定义数据访问方法 | 调用方不用关心 SQL 执行细节 | 方法名表达业务查询意图 | 重点是接口方法和 XML id 对应 |
| `#{}` | 安全参数绑定 | 防 SQL 注入 | 用户输入默认用 `#{}` | 重点是和 `${}` 区分 |
| 动态 SQL | 拼装可选条件 | 避免大量 if 拼字符串 | 用 `<where>`、`<if>` | 难点是条件为空时 SQL 合法 |
| N+1 | 识别多次无意义查询 | 接口数据多时性能急剧下降 | 看日志中的 SQL 次数 | 重点是批量思维 |

## 本节练习

- 写 `BookMapper`。
- 写 `findByIsbn`。
- 写 `insert`。
- 写带条件的动态查询。
- 观察 SQL 日志，识别是否有 N+1 风险。

## 本节通过标准

- 能解释 MyBatis 相比 JDBC 解决了什么。
- 能写 Mapper 接口和 XML。
- 能区分 `#{}` 和 `${}`。
- 能写简单动态 SQL。
- 能说明 N+1 查询是什么。

