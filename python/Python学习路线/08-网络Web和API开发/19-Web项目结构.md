# Web项目结构

Web 项目不能把所有代码写在一个 `main.py`。项目结构的目标是让路由、数据模型、业务逻辑、配置、测试和启动入口各司其职。

## 最小结构

```text
book_api/
  README.md
  pyproject.toml
  src/
    book_api/
      __init__.py
      main.py
      routers/
        __init__.py
        books.py
      schemas/
        __init__.py
        book.py
      services/
        __init__.py
        book_service.py
      settings.py
  tests/
    test_books.py
```

## main.py

职责：

- 创建 app。
- 注册路由。
- 注册中间件。
- 注册异常处理。

不应该写大量业务逻辑。

## routers

路由层职责：

- 接收请求。
- 调用 service。
- 返回响应。
- 处理 HTTP 层语义。

不要把复杂业务规则直接写在路由函数里。

## schemas

schema 层职责：

- 请求模型。
- 响应模型。
- 参数结构。
- 字段校验。

常见命名：

- `BookCreate`。
- `BookUpdate`。
- `BookRead`。
- `BookList`。

## services

service 层职责：

- 业务逻辑。
- 资源创建、更新、删除。
- 调用仓储层或外部服务。
- 处理业务错误。

这样路由可以保持薄。

## settings

配置层职责：

- 环境变量。
- 数据库连接配置。
- API Key。
- 日志级别。
- CORS 来源。

敏感配置不写死。

## tests

测试目录包含：

- API 测试。
- service 测试。
- 参数校验测试。
- 错误响应测试。

## 依赖方向

推荐：

```text
routers -> services -> repositories
routers -> schemas
services -> schemas 或 domain models
settings 被各层读取
```

避免：

- service 反向依赖路由。
- 配置散落在各文件。
- 多个模块互相循环导入。

## 常见错误

### main.py 过大

路由、模型、业务、配置全在一个文件里，很快难维护。

### schema 复用过度

创建、更新、响应模型职责不同，不要一个模型到处用。

### service 返回 HTTPException

service 层最好抛业务异常，由路由层或异常处理器转换成 HTTP 响应。

### 测试依赖真实外部服务

测试应 mock 外部 API 或使用测试替身。

## 练习

1. 创建最小 FastAPI 项目结构。
2. 把 books 路由拆到 routers。
3. 把 Pydantic 模型拆到 schemas。
4. 把业务逻辑拆到 services。
5. 增加 settings.py。
6. 增加 tests 目录。
7. 画出模块依赖方向。
8. 把一个单文件 API 重构成分层结构。

## 验收标准

- 能设计清晰 Web 项目结构。
- 能区分 routers、schemas、services、settings、tests。
- 能避免业务逻辑全部写在路由里。
- 能控制模块依赖方向。
