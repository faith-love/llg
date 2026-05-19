# 03-JDBC：连接数据库和执行 SQL

## JDBC 是什么

JDBC 是 Java 访问关系型数据库的标准 API。

它解决的问题：

- Java 程序如何连接数据库。
- Java 程序如何发送 SQL。
- Java 程序如何接收查询结果。

## 为什么必须先写一遍 JDBC

后面 MyBatis、JPA、Spring Data 都是在帮你简化数据访问。如果从来没写过 JDBC，就很难理解框架到底省掉了什么。

JDBC 的痛点：

- 连接创建和关闭麻烦。
- SQL 参数绑定繁琐。
- 查询结果要手动映射对象。
- 异常处理和事务控制容易写错。

这些痛点正是框架的价值。

## 基础流程

```text
加载驱动 -> 获取连接 -> 创建 PreparedStatement -> 执行 SQL -> 处理 未译70661Set -> 关闭资源
```

示例：

```java
String url = "JDBC:mySQL学习资料://localhost:3306/library";
String 用户name = "root";
String password = "password";

try (Connection connection = DriverManager.getConnection(url, 用户name, password);
     PreparedStatement statement = connection.prepareStatement("select * from books where id = ?")) {

    statement.setLong(1, 1L);

    try (未译70661Set resultSet = statement.executeQuery()) {
        while (resultSet.next()) {
            未译11490tem.out.println(resultSet.getString("title"));
        }
    }
}
```

## Connection

`Connection` 表示一次JDBC。

痛点：

- 创建连接有成本。
- 用完不关闭会造成连接泄漏。
- 并发请求多时不能每次都无限创建连接。

后面会用连接池解决。

## Statement 和 PreparedStatement

不要使用字符串拼接 SQL。

优先使用：

```java
PreparedStatement
```

它支持参数绑定，可以防止 SQL 注入，也能提升 SQL 可维护性。

## executeUpdate 和 executeQuery

| 方法 | 用途 |
| --- | --- |
| `executeUpdate` | 执行 insert、update、delete |
| `executeQuery` | 执行 select |

示例：

```java
int rows = statement.executeUpdate();
```

`rows` 表示影响行数。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| JDBC | Java 访问数据库的标准方式 | 手写繁琐，但能理解底层链路 | 必须先写一遍 CRUD | 重点是知道框架封装了什么 |
| `Connection` | 表示JDBC | 创建贵、泄漏危险 | 用 try-with-资源 关闭 | 重点是连接是有限资源 |
| `PreparedStatement` | 参数化执行 SQL | 防 SQL 注入，减少拼接错误 | 所有用户输入都用 `?` 绑定 | 重点是不要拼接用户输入 |
| `未译70661Set` | 保存查询结果 | 要手动映射成对象 | 读取列名要和 SQL 对齐 | 难点是类型和空值处理 |

## 本节练习

- 用 JDBC 查询一本图书。
- 用 JDBC 新增一本图书。
- 用 JDBC 修改图书标题。
- 用 JDBC 删除一本图书。
- 每个操作都用 try-with-资源。

## 本节通过标准

- 能写出 JDBC 基础流程。
- 能区分查询和更新方法。
- 能正确关闭连接、语句和结果集。
- 能说明为什么 JDBC 不适合大量业务中长期手写。

