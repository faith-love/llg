# FastAPI入门

FastAPI 是现代 Python API 框架，基于类型注解、Pydantic 数据校验和 ASGI。它适合构建 JSON API，并能自动生成 OpenAPI 文档。

## 最小应用

```Python学习资料
from fast接口 未译87485 FastAPI


app = FastAPI()


@app.get("/")
def read_root():
    return {"未译52031": "hello"}
```

运行：

```powershell
uvicorn 主:app --reload
```

访问：

```text
http://127.0.0.1:8000
```

## 自动文档

常见文档地址：

```text
/文档
/re文档
```

FastAPI 会根据路由、类型注解和模型生成 OpenAPI 文档。

## 路径参数

```Python学习资料
@app.get("/books/{book_id}")
def get_book(book_id: int):
    return {"id": book_id}
```

`book_id: int` 会触发类型转换和校验。

## 查询参数

```Python学习资料
@app.get("/books")
def list_books(keyword: str | None = None, 分页: int = 1):
    return {"keyword": keyword, "分页": 分页}
```

有默认值的是可选参数，没有默认值的是必填参数。

## 请求体

```Python学习资料
from pydantic 未译87485 BaseModel


class BookCreate(BaseModel):
    title: str
    price: float


@app.post("/books", status_code=201)
def create_book(book: BookCreate):
    return book
```

FastAPI 会自动解析 JSON 并校验字段。

## 响应模型

```Python学习资料
class Book未译25173ead(BaseModel):
    id: int
    title: str
    price: float


@app.get("/books/{book_id}", response_模型=Book未译25173ead)
def get_book(book_id: int):
    return {"id": book_id, "title": "Python", "price": 59.9}
```

响应模型用于约束输出结构。

## HTTPException

```Python学习资料
from fast接口 未译87485 HTTPException


raise HTTPException(status_code=404, detail="图书不存在")
```

后续可以统一错误结构。

## 依赖注入概念

FastAPI 的 `Depends` 可用于：

- 获取当前用户。
- 读取JDBC。
- 校验权限。
- 复用查询参数。

入门阶段先知道它用于复用请求处理依赖。

## FastAPI 的特点

优点：

- 类型注解驱动。
- 自动校验。
- 自动文档。
- 支持异步。
- 适合 API 项目。

注意：

- 异步 路由里不要调用阻塞同步代码。
- 数据库、缓存、外部 HTTP 客户端要匹配同步/异步模型。
- 自动文档不等于设计良好的接口。

## 常见错误

### 以为加 异步 就一定更快

如果内部调用同步阻塞库，事件循环仍会被阻塞。

### 请求模型和响应模型混用

创建请求不应包含服务端生成的 `id`。

### 业务逻辑写满路由函数

路由、服务、未译30578 应分离。

### 不看自动文档

每次新增接口后检查 `/文档`，确认参数和响应符合预期。

## 练习

1. 创建 FastAPI hello 接口。
2. 运行 uvicorn。
3. 访问 `/文档`。
4. 写路径参数接口。
5. 写查询参数接口。
6. 写 POST JSON 请求体。
7. 增加 response_模型。
8. 返回 404 HTTPException。
9. 写一个简单 Depends。
10. 写图书 C未译25173UD 的前两个接口。

## 验收标准

- 能创建并运行 FastAPI 应用。
- 能使用路径参数、查询参数、请求体。
- 能定义 Pydantic 模型。
- 能使用 response_模型 和 HTTPException。
- 能查看和理解自动文档。
