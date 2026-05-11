# API测试

API 测试用于验证接口行为、参数校验、错误响应、认证授权和兼容性。没有测试的 API 很容易在字段和状态码上悄悄破坏调用方。

## 测试范围

至少覆盖：

- 成功请求。
- 参数缺失。
- 参数类型错误。
- 资源不存在。
- 权限不足。
- 冲突错误。
- 分页边界。
- 错误响应结构。

## FastAPI TestClient

```python
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "hello"
```

## Flask 测试客户端

```python
def test_index(client):
    response = client.get("/")
    assert response.status_code == 200
```

通常通过 pytest fixture 创建 client。

## 测试状态码

```python
def test_book_not_found():
    response = client.get("/books/999")
    assert response.status_code == 404
```

状态码是 API 契约的一部分。

## 测试响应结构

```python
data = response.json()
assert "error" in data
assert data["error"]["code"] == "BOOK_NOT_FOUND"
```

不要只测试状态码。

## 测试认证

覆盖：

- 无 token。
- 错误 token。
- 正确 token。
- 无权限角色。
- 有权限角色。

## mock 外部 API

API 测试不应依赖真实外部服务。

策略：

- mock HTTP 客户端。
- 使用测试替身。
- 把外部调用封装到 service，测试时替换。

## 测试数据隔离

每个测试应该独立：

- 不依赖执行顺序。
- 不共享脏数据。
- 使用测试数据库或内存存储。
- 测试后清理。

## 常见错误

### 只测 happy path

真实问题更多出现在错误输入和权限边界。

### 测试依赖外网

外网波动会导致测试不稳定。

### 不检查响应字段

字段名改了也不会发现。

### 测试之间共享状态

一个测试污染另一个测试。

## 练习

1. 写 hello 接口测试。
2. 写创建图书成功测试。
3. 写缺少 title 测试。
4. 写 page_size 超限测试。
5. 写资源不存在测试。
6. 写认证失败测试。
7. 写权限不足测试。
8. mock 一个外部 API 调用。
9. 测试错误响应 code。
10. 生成测试覆盖清单。

## 验收标准

- 能使用测试客户端测试 API。
- 能覆盖成功、失败、校验、认证、权限。
- 能断言状态码和响应结构。
- 能避免测试依赖真实外部服务。
