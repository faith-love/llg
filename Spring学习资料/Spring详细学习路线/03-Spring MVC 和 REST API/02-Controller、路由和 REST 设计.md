# 02-Controller、路由和 REST 设计

## Controller 做什么

Controller 负责协议层工作：

- 接收 HTTP 请求。
- 调用业务服务。
- 返回 HTTP 响应。

它不应该承载复杂业务流程，也不应该直接操作数据库。

## 常见注解

最常用的两个：

- `@Controller`
- `@RestController`

`@RestController` 可以理解为：

```text
@Controller + @ResponseBody
```

如果你写的是 JSON API，通常直接用 `@RestController`。

## REST 资源命名

推荐按资源建模：

- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `PUT /books/{id}`
- `PATCH /books/{id}/status`
- `DELETE /books/{id}`

不推荐：

- `POST /getBookList`
- `POST /saveOrUpdateBook`
- `POST /deleteBook`

这种接口能跑，但语义弱，前后端协作和文档维护都会变差。

## HTTP 方法语义

- `GET`：查询。
- `POST`：创建或触发非幂等动作。
- `PUT`：整体更新。
- `PATCH`：局部更新。
- `DELETE`：删除。

不要把所有事情都塞进 `POST`，除非你的场景确实不适合标准资源语义。

## 路由版本化

常见做法：

- `/api/v1/books`
- `/api/v2/books`

如果项目需要长期兼容旧客户端，版本化要尽早约定。小型练习项目可以先不加版本，但要知道这个问题真实存在。

## 本节练习

1. 设计图书资源的 6 个基本接口。
2. 设计一个“上架/下架”接口，比较 `PUT` 和 `PATCH` 哪个更合适。
3. 把一个 `POST /doSomething` 风格接口改成资源风格。
4. 记录每个接口对应的状态码语义。

## 本节通过标准

- 能区分 `@Controller` 和 `@RestController`。
- 能按资源设计 CRUD 接口。
- 能说明为什么 REST 风格比“动作式接口名”更稳定。


