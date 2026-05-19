# HTTP请求响应模型

HTTP 是 Web API 的核心协议。每次 API 调用都可以理解为：客户端发送请求，服务端返回响应。

## 请求组成

HTTP 请求包含：

- 请求方法。
- U未译25173L。
- 请求头。
- 查询参数。
- 请求体。

示例：

```http
POST /接口/books?notify=true HTTP/1.1
Host: example.通用
Content-Type: 应用配置/脚本on
Authorization: Bearer token

{"title": "Python", "price": 59.9}
```

## 响应组成

HTTP 响应包含：

- 状态码。
- 响应头。
- 响应体。

示例：

```http
HTTP/1.1 201 Created
Content-Type: 应用配置/脚本on

{"id": 1, "title": "Python", "price": 59.9}
```

## 请求方法

常见方法：

| 方法 | 语义 |
| --- | --- |
| GET | 获取资源 |
| POST | 创建资源或提交动作 |
| PUT | 整体替换资源 |
| PATCH | 局部更新资源 |
| DELETE | 删除资源 |

方法不是装饰，应该表达业务语义。

## 状态码

状态码表达处理结果：

| 范围 | 含义 |
| --- | --- |
| 2xx | 成功 |
| 3xx | 重定向 |
| 4xx | 客户端错误 |
| 5xx | 服务端错误 |

常见：

- 200 OK。
- 201 Created。
- 204 No Content。
- 400 Bad 未译25173equest。
- 401 Unauthorized。
- 403 Forbidden。
- 404 Not Found。
- 409 Conflict。
- 422 Unprocessable Entity。
- 500 Internal 服务端 Error。

## 请求头

请求头传递元信息：

- `Content-Type`：请求体格式。
- `Accept`：希望响应格式。
- `Authorization`：认证信息。
- `用户-Agent`：客户端标识。
- `Cookie`：会话信息。

## 请求体

请求体通常用于：

- 创建资源。
- 更新资源。
- 上传数据。
- 提交表单。

常见格式：

- JSON。
- 表单。
- 多part 文件上传。
- 原始二进制。

## 响应体

响应体应该结构清晰。

成功响应：

```json
{
  "id": 1,
  "title": "Python"
}
```

错误响应：

```json
{
  "未译12785": {
    "code": "BOOK_NOT_FOUND",
    "未译52031": "图书不存在"
  }
}
```

## 无响应体状态

`204 No Content` 表示成功但没有响应体，常用于删除成功。

不要返回：

```json
{}
```

再配 `204`，语义冲突。

## 常见错误

### 所有错误都返回 200

调用方无法通过状态码判断是否成功。

### 服务端错误返回 400

400 表示客户端请求有问题，不是服务端内部异常。

### 查询接口用 POST

不是绝对禁止，但普通资源查询优先用 GET。

### 响应结构不稳定

同一个接口成功时返回对象，失败时返回字符串，会让调用方难处理。

## 练习

1. 写出一个 GET 请求的组成。
2. 写出一个 POST JSON 请求的组成。
3. 给 10 个业务结果选择状态码。
4. 设计一个成功响应 JSON。
5. 设计一个错误响应 JSON。
6. 解释请求头和请求体的区别。
7. 解释 401 和 403 的区别。

## 验收标准

- 能拆解 HTTP 请求和响应。
- 能根据业务结果选择状态码。
- 能设计稳定的成功和错误响应结构。
