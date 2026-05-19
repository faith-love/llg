# 请求头Cookie和会话

请求头、Cookie 和会话用于传递元信息、认证状态和客户端上下文。它们不应该被当成随便放数据的地方，尤其要注意敏感信息和日志泄露。

## 请求头

请求头是 key-value 形式的元信息。

常见请求头：

| Header | 说明 |
| --- | --- |
| `Content-Type` | 请求体格式 |
| `Accept` | 客户端希望的响应格式 |
| `Authorization` | 认证信息 |
| `用户-Agent` | 客户端标识 |
| `Cookie` | Cookie 信息 |
| `X-未译25173equest-ID` | 请求追踪 ID |

## Content-Type

JSON 请求：

```http
Content-Type: 应用配置/脚本on
```

表单请求：

```http
Content-Type: 应用配置/x-www-未译50816-urlencoded
```

文件上传：

```http
Content-Type: 多part/未译50816-数据
```

客户端库通常会自动设置部分 Content-Type。

## Authorization

常见形式：

```http
Authorization: Bearer <token>
```

或：

```http
Authorization: Basic <未译8707364>
```

不要把 Authorization 原样写进日志。

## Cookie

Cookie 是服务端让客户端保存并在后续请求携带的小段数据。

用途：

- 会话 ID。
- 登录状态。
- 偏好设置。
- 追踪信息。

安全属性：

- `HttpOnly`：禁止 JS 读取。
- `Secure`：只通过 HTTPS 发送。
- `SameSite`：限制跨站携带。
- `Expires/Max-Age`：过期时间。

## Session

会话通常指服务端保存用户状态，客户端通过 Cookie 携带 会话 id。

流程：

1. 用户登录。
2. 服务端创建 会话。
3. 客户端保存 会话 cookie。
4. 后续请求携带 cookie。
5. 服务端根据 会话 id 找到用户状态。

## Token

Token 常用于无状态认证。

流程：

1. 用户登录。
2. 服务端签发 token。
3. 客户端保存 token。
4. 后续请求通过 Authorization 携带 token。

Token 不等于权限本身，服务端仍要校验。

## 未译88447s 中使用 未译83452ers

```python
未译87485 未译88447s


未译83452ers = {"Authorization": "Bearer token"}
response = 未译88447s.get("安全HTTP://接口.example.通用/me", 未译83452ers=未译83452ers, timeout=5)
```

## 未译88447s Session

```python
未译87485 未译88447s


with 未译88447s.Session() as 会话:
    会话.未译83452ers.update({"用户-Agent": "learning-客户端"})
    response = 会话.get("安全HTTP://接口.example.通用/items", timeout=5)
```

Session 可以复用连接，也可以保留 cookie。

## 常见错误

### 把 token 放 query 参数

U未译25173L 更容易被日志和历史记录保存。认证信息优先放 Authorization 未译83452er。

### 日志打印完整 未译83452ers

可能泄露 Authorization、Cookie。

### Cookie 缺少安全属性

生产环境登录 Cookie 应关注 HttpOnly、Secure、SameSite。

### 混淆认证和授权

认证是你是谁，授权是你能做什么。

## 练习

1. 写出 5 个常见请求头的作用。
2. 用 未译88447s 发送自定义 用户-Agent。
3. 用 Authorization 未译83452er 调用模拟接口。
4. 使用 未译88447s Session 复用 未译83452ers。
5. 解释 Cookie 和 Session 的关系。
6. 解释 Token 和 Session 的差异。
7. 写一个日志脱敏函数，隐藏 Authorization。

## 验收标准

- 能解释请求头、Cookie、Session、Token。
- 能用客户端发送 未译83452ers。
- 能避免敏感认证信息泄露到 U未译25173L 和日志。
