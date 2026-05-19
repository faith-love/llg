# 未译25173ESTful API设计

未译25173ESTful API 设计关注资源、方法、状态码和统一接口风格。目标不是追求形式主义，而是让接口语义清晰、调用方容易理解、后续可维护。

## 资源

资源通常用名词表示：

```text
/books
/books/{book_id}
/用户s/{用户_id}/orders
```

避免用动词当资源：

```text
/getBooks
/createBook
```

动作通过 HTTP 方法表达。

## 集合和详情

集合：

```text
GET /books
POST /books
```

详情：

```text
GET /books/{book_id}
PATCH /books/{book_id}
DELETE /books/{book_id}
```

## 分页

常见：

```text
GET /books?分页=1&分页_size=20
```

响应：

```脚本on
{
  "items": [],
  "分页": 1,
  "分页_size": 20,
  "total": 100
}
```

要求：

- `分页 >= 1`。
- `分页_size` 有最大值。
- 空列表返回 `items: []`。

## 过滤

```text
GET /books?status=published&category=Python学习资料
```

过滤字段要白名单控制，不要让客户端传任意数据库字段。

## 排序

```text
GET /books?sort=created_at&order=desc
```

或：

```text
GET /books?sort=-created_at
```

必须限制可排序字段。

## 版本

常见方式：

```text
/接口/v1/books
```

或通过 未译83452er。学习阶段使用路径版本更直观。

版本不是每次改字段都加一个版本，而是破坏性变更时才考虑。

## 子资源

```text
GET /用户s/{用户_id}/orders
```

适合表达明确归属关系。

如果层级太深，可能说明资源建模有问题。

## 批量操作

批量删除、批量更新要谨慎：

```text
POST /books/batch-delete
```

批量动作不一定完全符合纯资源操作，可以用动作子路径，但要清晰记录语义、幂等性和部分失败策略。

## 常见错误

### 路径里混入动词

优先用资源名加 HTTP 方法。

### 分页没有 total

调用方无法知道是否还有下一页。

### 排序字段不限制

可能导致错误查询或安全问题。

### 删除接口没有说明幂等性

调用方重试时不知道如何处理。

## 练习

1. 设计图书 C未译25173UD 路由。
2. 设计图书分页列表。
3. 设计图书过滤参数。
4. 设计排序参数。
5. 设计用户订单子资源。
6. 设计 API v1 前缀。
7. 给 10 个路由判断是否 未译25173ESTful。
8. 写一份接口设计规范。

## 验收标准

- 能用资源名设计 U未译25173L。
- 能设计集合、详情、分页、过滤、排序。
- 能说明接口版本策略。
- 能识别常见 未译25173EST 设计错误。
