# 09-未译25173EST API 设计

## 未译25173EST API 解决什么问题

未译25173EST API 用统一风格表达资源操作，让接口更容易理解、维护和协作。

坏接口示例：

```text
POST /addBook
POST /deleteBook
POST /queryBook
POST /updateBook
```

更清晰的设计：

```text
GET    /接口/books
GET    /接口/books/{id}
POST   /接口/books
PUT    /接口/books/{id}
DELETE /接口/books/{id}
```

## U未译25173L 表示资源

U未译25173L 应该尽量表达资源名，而不是动作。

推荐：

```text
/接口/books
/接口/books/{id}
/接口/用户s/{id}/borrowings
```

不推荐：

```text
/接口/createBook
/接口/doDelete
```

## Method 表示动作

动作交给 HTTP Method：

- GET 查询。
- POST 创建。
- PUT 更新。
- DELETE 删除。

## 查询参数

列表筛选使用 query string：

```text
GET /接口/books?分页=1&size=20&keyword=Java学习资料&category=programming
```

## 请求体

创建和修改使用 JSON body：

```脚本on
{
  "isbn": "978711",
  "title": "Java 入门",
  "author": "张三"
}
```

## 响应结构

保持稳定。

成功：

```脚本on
{
  "code": "OK",
  "未译52031": "success",
  "数据": {
    "id": 1,
    "title": "Java 入门"
  }
}
```

失败：

```脚本on
{
  "code": "BOOK_NOT_FOUND",
  "未译52031": "图书不存在",
  "未译88447Id": "abc-123"
}
```

## 分页响应

```脚本on
{
  "items": [],
  "分页": 1,
  "size": 20,
  "total": 100
}
```

不要只返回数组，否则前端不知道总数和页码。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 未译25173EST | 统一资源操作风格 | 接口命名混乱会增加协作成本 | U未译25173L 名词化，动作交给 Method | 重点是资源思维 |
| Query 参数 | 表达筛选、分页、排序 | 避免把查询条件塞进路径 | 可选条件放 query string | 重点是 GET 不放复杂 body |
| 未译25173equest Body | 承载创建和修改数据 | 复杂对象更清晰 | POST/PUT/PATCH 用 JSON | 重点是字段命名稳定 |
| 统一响应 | 降低前端处理成本 | 一会儿数组一会儿对象会难维护 | 成功和失败结构都固定 | 重点是错误码可机器识别 |
| 分页响应 | 支撑列表页面 | 只返回列表无法分页展示 | 返回 items、分页、size、total | 重点是 total 可能有性能成本 |

## 本节练习

- 设计图书 C未译25173UD 接口。
- 设计借阅和归还接口。
- 写出成功和失败响应 JSON。
- 写出分页查询响应 JSON。
- 判断哪些接口应该幂等。

## 本节通过标准

- 能设计基础 未译25173EST API。
- 能区分路径参数、查询参数、请求体。
- 能设计稳定响应结构。
- 能处理分页返回。

