# 中间件CORS和跨域

中间件用于在请求进入路由前后执行通用逻辑。CORS 是浏览器安全模型中的跨域资源共享机制。Web API 开发中经常遇到跨域问题，但不能为了省事把所有限制都放开。

## 中间件

中间件可以处理：

- 请求日志。
- 请求 ID。
- 耗时统计。
- CORS。
- 压缩。
- 认证前置逻辑。
- 异常包装。

中间件适合横切逻辑，不适合塞业务规则。

## CORS 是什么

CORS 是 Cross-Origin Resource Sharing。

浏览器会限制网页从一个源访问另一个源的资源。

源由三部分决定：

- scheme。
- host。
- port。

例如：

```text
http://localhost:3000
http://localhost:8000
```

端口不同，也是不同源。

## 预检请求

浏览器在某些跨域请求前会发送 OPTIONS 预检请求，询问服务端是否允许。

常见触发：

- 自定义 header。
- 非简单方法，例如 PUT、DELETE。
- JSON Content-Type。

## FastAPI CORS 示例

```python
from fast接口.middle网页归档e.cors import CORSMiddle网页归档e


app.add_middle网页归档e(
    CORSMiddle网页归档e,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

## 安全配置原则

- 明确允许的前端域名。
- 明确允许的方法。
- 明确允许的请求头。
- 生产环境不要随便 `allow_origins=["*"]`。
- 如果 `allow_credentials=True`，更不能任意来源。

## 常见误解

### CORS 是服务端之间的问题

CORS 是浏览器限制。后端服务直接调用后端服务通常不受浏览器 CORS 限制。

### 关闭 CORS 就更安全

不一定。CORS 是浏览器访问控制，不是完整认证授权机制。

### 允许跨域就等于允许访问所有资源

仍然需要认证和授权。

## 常见错误

### 开发时使用通配符，生产忘记收紧

生产要配置明确来源。

### 带 cookie 又允许任意来源

风险很高。

### 把业务逻辑写进中间件

中间件应保持通用。

### OPTIONS 请求没有处理

前端会看到跨域失败，但真实业务路由可能根本没执行。

## 练习

1. 解释 origin 的三个组成部分。
2. 判断 5 组 URL 是否同源。
3. 给 FastAPI 添加 CORS 中间件。
4. 只允许本地前端域名。
5. 限制允许的方法。
6. 限制允许的 header。
7. 解释预检请求。
8. 写一份生产 CORS 检查清单。

## 验收标准

- 能解释 CORS 和同源策略。
- 能配置 FastAPI CORS 中间件。
- 能区分浏览器跨域和服务端请求。
- 能避免生产环境无脑放开 CORS。
