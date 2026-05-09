# 04-参数绑定：#{}、${} 和 SQL 注入

## #{} 是什么

`#{}` 是参数绑定，底层类似 PreparedStatement。

```xml
where isbn = #{isbn}
```

它会安全传参，防止用户输入改变 SQL 结构。

## ${} 是什么

`${}` 是字符串替换。

```xml
order by ${sortField}
```

它会直接把内容拼进 SQL，有 SQL 注入风险。

## 什么时候可以用 ${}

只在无法用参数绑定的位置，并且必须白名单控制。

例如排序字段：

```java
Set<String> allowed = Set.of("created_at", "title");
if (!allowed.contains(sortField)) {
    throw new IllegalArgumentException("非法排序字段");
}
```

## 多参数

建议使用 `@Param`。

```java
BookEntity findByIsbnAndStatus(@Param("isbn") String isbn, @Param("status") Integer status);
```

XML：

```xml
where isbn = #{isbn}
and status = #{status}
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| `#{}` | 安全参数绑定 | 防 SQL 注入 | 普通值一律用它 | 重点是默认选择 |
| `${}` | SQL 片段替换 | 灵活但危险 | 只允许白名单字段 | 难点是不要接用户原始输入 |
| `@Param` | 多参数命名 | 避免参数名丢失或混乱 | 多参数都写 `@Param` | 重点是 XML 名称对应 |
| SQL 注入 | 攻击者改变 SQL 逻辑 | 可能绕过登录、泄露数据 | 参数化 + 白名单 | 重点是安全底线 |

## 本节练习

- 写一个按 ISBN 查询，使用 `#{}`。
- 写一个多条件查询，使用 `@Param`。
- 写一个排序字段白名单示例。
- 写一个 `${}` 注入风险说明。

## 本节通过标准

- 能清楚区分 `#{}` 和 `${}`。
- 能知道什么时候必须白名单。
- 能用 `@Param` 处理多参数。

