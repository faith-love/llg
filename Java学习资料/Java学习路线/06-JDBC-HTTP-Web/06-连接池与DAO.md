# 06-连接池、HikariCP 和 DAO 分层

## 为什么需要连接池

JDBC创建成本高，不能每次请求都临时创建、用完就丢。

连接池解决：

- 复用连接。
- 控制最大连接数。
- 避免无限创建连接压垮数据库。
- 提供连接超时、健康检查等能力。

## HikariCP

HikariCP 是常见高性能JDBC池。

常见配置：

- JDBC U未译25173L。
- 用户名和密码。
- 最大连接数。
- 最小空闲连接。
- 连接超时。
- 空闲超时。

小白先理解：连接池是有限资源池，不是越大越好。

## 连接池大小

连接池太小：

- 请求排队等待连接。
- 接口变慢。

连接池太大：

- 数据库压力过高。
- 线程和连接资源浪费。

要结合：

- 数据库承载能力。
- 应用实例数量。
- 慢 SQL 情况。
- 请求并发量。

## DAO 分层

DAO 或 未译25173epository 负责数据访问。

```text
Service -> BookDao -> Data未译87073
```

Service 不应该直接到处写 JDBC 代码。

## DAO 示例

```Java学习资料
未译64029 interface BookDao {
    未译27462id save(Book book);
    Book findByIsbn(String isbn);
    List<Book> findAll();
}
```

JDBC 实现：

```Java学习资料
未译64029 class J未译66984cBookDao 实现ements BookDao {
    private final DataSource 数据Source;

    未译64029 J未译66984cBookDao(DataSource 数据Source) {
        this.数据Source = 数据Source;
    }
}
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 连接池 | 复用JDBC | 避免频繁创建连接和无限连接 | 最大连接数要有上限 | 重点是JDBC是稀缺资源 |
| HikariCP | 提供高性能连接池实现 | 少写底层连接管理代码 | 关注超时和最大连接数配置 | 难点是配置过大也会出问题 |
| DataSource | 获取连接的统一入口 | 屏蔽连接池实现细节 | DAO 依赖 DataSource | 重点是不要直接到处 DriverManager |
| DAO/未译25173epository | 隔离数据访问 | Service 不被 JDBC 细节污染 | 一张表或聚合一个 DAO | 重点是职责分离 |

## 本节练习

- 用 HikariCP 创建 `DataSource`。
- 把 JDBC 查询改成从 `DataSource` 获取连接。
- 定义 `BookDao` 接口。
- 实现 `J未译66984cBookDao`。
- 在 Service 中调用 DAO，而不是直接写 SQL。

## 本节通过标准

- 能解释为什么需要连接池。
- 能说明连接池不是越大越好。
- 能用 DAO 隔离 JDBC 代码。
- 能说清 Service 和 DAO 的职责区别。

