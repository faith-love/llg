# 08-网络Web和API开发

这一阶段的目标是把 Python 从本地脚本带到网络服务：能理解 HTTP 请求响应，能调用外部 API，能设计自己的接口，能用 FastAPI 或 Flask 写 Web API，能处理参数、校验、错误、认证、上传下载、测试和部署前的基础安全边界。

如果 07 阶段关注“多个任务如何可靠运行”，那么 08 阶段关注“程序如何通过网络和外部世界交互，并对外提供稳定接口”。

## 本阶段完整知识点

| 序号 | 主题 | 必须掌握 |
| --- | --- | --- |
| 01 | 阶段目标 | Web/API 能力边界、产出、验收 |
| 02 | 网络基础和协议模型 | IP、端口、DNS、TCP、TLS、客户端服务端 |
| 03 | HTTP 请求响应模型 | request、response、headers、body、status |
| 04 | URL 查询参数和编码 | scheme、host、path、query、percent encoding |
| 05 | HTTP 方法状态码和幂等性 | GET、POST、PUT、PATCH、DELETE、2xx/4xx/5xx |
| 06 | 请求头 Cookie 和会话 | headers、cookie、session、token 概念 |
| 07 | JSON 接口设计基础 | 请求体、响应体、字段命名、错误结构 |
| 08 | requests 同步客户端 | GET/POST、timeout、headers、异常、session |
| 09 | httpx 客户端入门 | 同步/异步客户端、连接复用、超时 |
| 10 | API 调用安全和重试 | 限流、重试、退避、密钥、日志脱敏 |
| 11 | Flask 入门 | 路由、请求对象、响应、蓝图概念 |
| 12 | FastAPI 入门 | 路由、类型注解、自动文档、依赖注入入门 |
| 13 | 请求参数和数据校验 | path、query、body、表单、Pydantic 概念 |
| 14 | 响应模型和错误处理 | response model、HTTPException、错误码规范 |
| 15 | RESTful API 设计 | 资源、集合、分页、过滤、排序、版本 |
| 16 | 认证授权基础 | Basic、Bearer、JWT、API Key、RBAC 概念 |
| 17 | 文件上传下载 | multipart、streaming、文件大小限制 |
| 18 | 中间件 CORS 和跨域 | middleware、CORS、预检请求、安全边界 |
| 19 | Web 项目结构 | routers、services、schemas、settings、tests |
| 20 | 配置环境和密钥管理 | .env、环境变量、配置优先级、敏感信息 |
| 21 | 日志访问记录和追踪 | access log、request id、耗时、错误上下文 |
| 22 | API 测试 | TestClient、pytest、mock、契约测试 |
| 23 | OpenAPI 和接口文档 | schema、Swagger、示例、变更记录 |
| 24 | 部署运行基础 | ASGI/WSGI、uvicorn、gunicorn、反向代理 |
| 25 | 常见错误和安全边界 | 无 timeout、注入、越权、泄露、CORS 放开 |
| 26 | 验收标准和复盘 | 阶段通过标准和综合项目 |

## 推荐学习顺序

1. [阶段目标](01-阶段目标.md)
2. [网络基础和协议模型](02-网络基础和协议模型.md)
3. [HTTP请求响应模型](03-HTTP请求响应模型.md)
4. [URL查询参数和编码](04-URL查询参数和编码.md)
5. [HTTP方法状态码和幂等性](05-HTTP方法状态码和幂等性.md)
6. [请求头Cookie和会话](06-请求头Cookie和会话.md)
7. [JSON接口设计基础](07-JSON接口设计基础.md)
8. [requests同步客户端](08-requests同步客户端.md)
9. [httpx客户端入门](09-httpx客户端入门.md)
10. [API调用安全和重试](10-API调用安全和重试.md)
11. [Flask入门](11-Flask入门.md)
12. [FastAPI入门](12-FastAPI入门.md)
13. [请求参数和数据校验](13-请求参数和数据校验.md)
14. [响应模型和错误处理](14-响应模型和错误处理.md)
15. [RESTful API设计](15-RESTful API设计.md)
16. [认证授权基础](16-认证授权基础.md)
17. [文件上传下载](17-文件上传下载.md)
18. [中间件CORS和跨域](18-中间件CORS和跨域.md)
19. [Web项目结构](19-Web项目结构.md)
20. [配置环境和密钥管理](20-配置环境和密钥管理.md)
21. [日志访问记录和追踪](21-日志访问记录和追踪.md)
22. [API测试](22-API测试.md)
23. [OpenAPI和接口文档](23-OpenAPI和接口文档.md)
24. [部署运行基础](24-部署运行基础.md)
25. [常见错误和安全边界](25-常见错误和安全边界.md)
26. [验收标准和复盘](26-验收标准和复盘.md)

## 本阶段产出

- 至少 80 个网络、HTTP、API 和 Web 开发练习。
- 一个同步 API 调用脚本，带 timeout、重试、错误报告。
- 一个 FastAPI 或 Flask CRUD API 项目。
- 一套接口文档和请求示例。
- 一组 pytest API 测试。
- 一份认证、CORS、密钥、错误处理的安全检查清单。
- 一份阶段复盘。

## 本阶段不做什么

- 不直接跳到大型微服务架构。
- 不把业务逻辑全部写在路由函数里。
- 不忽略 timeout、错误响应和日志。
- 不把 token、密码、cookie 写进代码和日志。
- 不把 CORS 配成任意来源并带凭证。
- 不在没有测试的情况下频繁改接口字段。
