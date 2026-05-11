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
| `User-Agent` | 客户端标识 |
| `Cookie` | Cookie 信息 |
| `X-Request-ID` | 请求追踪 ID |

## Content-Type

JSON 请求：

```http
Content-Type: application/json
```

表单请求：

```http
Content-Type: application/x-www-form-urlencoded
```

文件上传：

```http
Content-Type: multipart/form-data
```

客户端库通常会自动设置部分 Content-Type。

## Authorization

常见形式：

```http
Authorization: Bearer <token>
```

或：

```http
Authorization: Basic <base64>
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

会话通常指服务端保存用户状态，客户端通过 Cookie 携带 session id。

流程：

1. 用户登录。
2. 服务端创建 session。
3. 客户端保存 session cookie。
4. 后续请求携带 cookie。
5. 服务端根据 session id 找到用户状态。

## Token

Token 常用于无状态认证。

流程：

1. 用户登录。
2. 服务端签发 token。
3. 客户端保存 token。
4. 后续请求通过 Authorization 携带 token。

Token 不等于权限本身，服务端仍要校验。

## requests 中使用 headers

```python
import requests


headers = {"Authorization": "Bearer token"}
response = requests.get("https://api.example.com/me", headers=headers, timeout=5)
```

## requests Session

```python
import requests


with requests.Session() as session:
    session.headers.update({"User-Agent": "learning-client"})
    response = session.get("https://api.example.com/items", timeout=5)
```

Session 可以复用连接，也可以保留 cookie。

## 常见错误

### 把 token 放 query 参数

URL 更容易被日志和历史记录保存。认证信息优先放 Authorization header。

### 日志打印完整 headers

可能泄露 Authorization、Cookie。

### Cookie 缺少安全属性

生产环境登录 Cookie 应关注 HttpOnly、Secure、SameSite。

### 混淆认证和授权

认证是你是谁，授权是你能做什么。

## 练习

1. 写出 5 个常见请求头的作用。
2. 用 requests 发送自定义 User-Agent。
3. 用 Authorization header 调用模拟接口。
4. 使用 requests Session 复用 headers。
5. 解释 Cookie 和 Session 的关系。
6. 解释 Token 和 Session 的差异。
7. 写一个日志脱敏函数，隐藏 Authorization。

## 验收标准

- 能解释请求头、Cookie、Session、Token。
- 能用客户端发送 headers。
- 能避免敏感认证信息泄露到 URL 和日志。
