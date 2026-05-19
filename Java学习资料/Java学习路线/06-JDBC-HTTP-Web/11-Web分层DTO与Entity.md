# 11-Web 分层、DTO 和 Entity

## 为什么要分层

如果 Controller 里直接写 SQL、事务、业务判断、响应拼装，代码会很快失控。

推荐链路：

```text
Controller -> Service -> Repository/Mapper -> Database
```

## Controller

职责：

- 接收 HTTP 请求。
- 解析参数。
- 调用 Service。
- 返回响应。

不应该：

- 直接写 SQL。
- 写复杂业务规则。
- 管理事务细节。

## Service

职责：

- 承载业务规则。
- 定义事务边界。
- 调用多个 Mapper 或外部服务。
- 处理业务异常。

例如借书：

- 检查图书是否存在。
- 检查库存是否足够。
- 新增借阅记录。
- 扣减库存。

## Repository/Mapper

职责：

- 执行数据库访问。
- 把查询结果映射成对象。

不应该：

- 判断复杂业务规则。
- 直接组装 HTTP 响应。

## DTO

DTO 是 Data Transfer Object，用于请求和响应传输。

请求 DTO：

```java
未译64029 class CreateBookRequest {
    private String isbn;
    private String title;
    private String author;
}
```

响应 DTO：

```java
未译64029 class BookResponse {
    private Long id;
    private String title;
    private String author;
}
```

## Entity

Entity 通常对应数据库表。

```java
未译64029 class BookEntity {
    private Long id;
    private String isbn;
    private String title;
    private String author;
}
```

不要把 Entity 直接暴露给前端。否则数据库字段变化会影响接口。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| Controller | HTTP 入口 | 保持入口层薄，便于维护 | 只做参数、调用、响应 | 重点是不要写业务和 SQL |
| Service | 业务核心 | 业务规则集中，事务边界清晰 | 一个业务动作一个 Service 方法 | 重点是事务通常放这里 |
| Mapper | 数据访问 | SQL 和业务分离 | 方法表达查询意图 | 重点是不要把业务塞进 Mapper |
| DTO | 对外传输模型 | 隔离接口和数据库结构 | 请求和响应分开建类 | 重点是别直接返回 Entity |
| Entity | 数据库映射模型 | 表结构有对应代码表示 | 只承载持久化字段 | 难点是和 DTO 区分 |

## 本节练习

- 为创建图书设计 `CreateBookRequest`。
- 为图书详情设计 `BookResponse`。
- 设计 `BookEntity`。
- 写出 Controller、Service、Mapper 的方法签名。
- 说明借书事务应该放在哪一层。

## 本节通过标准

- 能画出 Web 分层链路。
- 能区分 DTO 和 Entity。
- 能解释 Controller 为什么不直接写 SQL。
- 能说明事务为什么通常在 Service 层。

