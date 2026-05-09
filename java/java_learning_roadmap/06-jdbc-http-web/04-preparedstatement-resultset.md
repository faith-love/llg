# 04-PreparedStatement 和 ResultSet 映射

## 为什么不能拼接 SQL

错误写法：

```java
String sql = "select * from users where username = '" + username + "'";
```

如果用户输入：

```text
' or '1'='1
```

SQL 逻辑可能被篡改，这就是 SQL 注入风险。

## PreparedStatement

正确写法：

```java
String sql = "select * from users where username = ?";
PreparedStatement statement = connection.prepareStatement(sql);
statement.setString(1, username);
```

参数通过 `?` 占位，再用 `setXxx` 绑定。

## 参数下标

JDBC 参数下标从 1 开始，不是从 0 开始。

```java
statement.setString(1, title);
statement.setString(2, author);
```

这是小白常见坑。

## ResultSet 映射对象

查询结果需要转成 Java 对象。

```java
private Book mapBook(ResultSet rs) throws SQLException {
    Book book = new Book();
    book.setId(rs.getLong("id"));
    book.setIsbn(rs.getString("isbn"));
    book.setTitle(rs.getString("title"));
    book.setAuthor(rs.getString("author"));
    return book;
}
```

## 空值处理

数据库列可能为 `null`。读取包装类型时更安全：

```java
Long id = rs.getObject("id", Long.class);
```

对于基础类型如 `int`、`long`，要注意无法直接表示 `null`。

## 批量操作

```java
for (Book book : books) {
    statement.setString(1, book.getIsbn());
    statement.setString(2, book.getTitle());
    statement.addBatch();
}
statement.executeBatch();
```

批量操作能减少多次往返数据库的开销。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 参数化 SQL | 防止 SQL 注入 | 用户输入不会改变 SQL 结构 | 用户输入一律用 `?` | 重点是不要字符串拼接 |
| 参数绑定 | 把 Java 值安全传入 SQL | 避免引号、转义、类型混乱 | 注意下标从 1 开始 | 难点是参数顺序和 SQL 占位要一致 |
| ResultSet 映射 | 把查询结果变成对象 | 不映射就无法进入业务层 | 单独抽 `mapBook` 方法 | 重点是列名、类型、空值 |
| 批量操作 | 提升多行写入效率 | 避免一条条执行往返数据库 | 数据量大时分批提交 | 重点是批量也要考虑事务 |

## 本节练习

- 写一个 `findByIsbn(String isbn)`。
- 写一个 `mapBook(ResultSet rs)`。
- 写一个批量插入图书方法。
- 故意写一次拼接 SQL，说明风险，然后改成参数化。

## 本节通过标准

- 能说明 SQL 注入是什么。
- 能用 `PreparedStatement` 绑定参数。
- 能把 `ResultSet` 映射成对象。
- 能处理参数下标和空值问题。

