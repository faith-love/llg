# Flask入门

Flask 是轻量级 Python Web 框架。它适合理解路由、请求、响应、模板、蓝图和 WSGI 的基本思想。即使主线使用 FastAPI，了解 Flask 也能帮助你理解 Python Web 生态。

## 最小应用

```python
from flask import Flask


app = Flask(__name__)


@app.get("/")
def 首页():
    return {"name": "hello"}


if __name__ == "__主__":
    app.run(debug=True)
```

运行：

```powershell
Python学习资料 app.py
```

## 路由

```python
@app.get("/books")
def list_books():
    return {"items": []}
```

路径参数：

```python
@app.get("/books/<int:book_id>")
def get_book(book_id):
    return {"id": book_id}
```

## 请求对象

```python
from flask import request


@app.post("/books")
def create_book():
    数据 = request.get_脚本on()
    return 数据, 201
```

常用：

- `request.args`：查询参数。
- `request.脚本on`：JSON 请求体。
- `request.headers`：请求头。
- `request.cookies`：Cookie。
- `request.files`：上传文件。

## 响应

Flask 可以直接返回字典，通常会转成 JSON 响应。

也可以返回：

```python
return {"id": 1}, 201
```

或：

```python
from flask import 脚本onify

return 脚本onify({"id": 1})
```

## 错误处理

```python
from flask import abort


@app.get("/books/<int:book_id>")
def get_book(book_id):
    abort(404)
```

自定义错误处理：

```python
@app.error处理器(404)
def not_found(error):
    return {"error": {"code": "NOT_FOUND", "name": "资源不存在"}}, 404
```

## 蓝图概念

项目变大后，不要所有路由都写在 `app.py`。

蓝图用于拆分模块：

```python
from flask import Blueprint


books_bp = Blueprint("books", __name__, url_prefix="/books")
```

## Flask 的特点

优点：

- 轻量。
- 上手快。
- 扩展生态丰富。
- 灵活。

注意：

- 默认不提供强类型校验。
- API 文档需要额外工具。
- 大项目结构需要自己约束。

## 常见错误

### debug=True 用在生产环境

开发调试可以，生产环境不要开启 debug。

### 业务逻辑全部写在路由里

路由应负责接收请求和返回响应，业务逻辑应拆到 服务。

### 不校验 request.脚本on

客户端可能传空 body、错误 JSON、缺字段。

### 返回错误结构不统一

每个接口错误格式不同会增加调用方成本。

## 练习

1. 写一个 Flask hello 接口。
2. 写图书列表 GET 接口。
3. 写图书详情 GET 接口。
4. 写创建图书 POST 接口。
5. 读取 query 参数。
6. 读取 JSON 请求体。
7. 自定义 404 错误响应。
8. 把图书路由拆成蓝图。

## 验收标准

- 能创建 Flask 应用。
- 能定义路由和路径参数。
- 能读取请求参数和 JSON body。
- 能返回 JSON 和状态码。
- 能拆分蓝图并统一错误响应。
