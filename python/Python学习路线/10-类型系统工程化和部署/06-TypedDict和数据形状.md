# TypedDict和数据形状

`TypedDict` 用于给字典结构添加类型信息。它适合描述 JSON 对象、配置项、外部 API 响应等“字典形状”固定的数据。

## 基本用法

```python
from typing import TypedDict


class UserDict(TypedDict):
    id: int
    name: str
    email: str
```

使用：

```python
user: UserDict = {"id": 1, "name": "Alice", "email": "a@example.com"}
```

## 必填和非必填

可以使用 `NotRequired`：

```python
from typing import NotRequired, TypedDict


class UserDict(TypedDict):
    id: int
    name: str
    email: NotRequired[str]
```

表示 `email` 可缺失。

## total=False

```python
class UserUpdate(TypedDict, total=False):
    name: str
    email: str
```

所有字段都可缺失，适合 PATCH 更新数据。

## TypedDict 和 dict 的区别

普通 dict：

```python
dict[str, object]
```

只能表达 key 是 str，value 是 object。

TypedDict：

```python
{"id": int, "name": str}
```

能表达具体字段和类型。

## 适合场景

适合：

- 外部 JSON 响应。
- 配置字典。
- 简单数据传输。
- 逐步类型化老代码。

不适合：

- 需要方法的领域对象。
- 需要运行时校验的数据。
- 复杂业务模型。

这时可以考虑 dataclass 或 Pydantic 模型。

## 运行时限制

TypedDict 主要用于静态检查，不会自动运行时校验。

```python
user: UserDict = {"id": "bad", "name": 123}
```

如果不跑类型检查，运行时不会自动拒绝。

## JSON 响应示例

```python
class BookResponse(TypedDict):
    id: int
    title: str
    price: str
```

用于标注外部 API 返回值：

```python
def parse_book(data: BookResponse) -> str:
    return data["title"]
```

## 常见错误

### 用 dict[str, Any] 描述所有 JSON

会丢失字段检查价值。

### 把可缺失和可为 None 混淆

可缺失：字段不存在。

可为 None：字段存在但值为 null。

### 以为 TypedDict 会运行时校验

不会。需要运行时校验时用 Pydantic 或手动校验。

### TypedDict 过深

嵌套太复杂时，模型类可能更清晰。

## 练习

1. 定义用户响应 TypedDict。
2. 定义图书响应 TypedDict。
3. 用 NotRequired 定义可缺失字段。
4. 用 total=False 定义更新字典。
5. 区分字段缺失和字段为 None。
6. 把 `dict[str, Any]` 改成 TypedDict。
7. 解释 TypedDict 和 dataclass 的差异。

## 验收标准

- 能用 TypedDict 描述字典形状。
- 能处理必填和非必填字段。
- 能区分 TypedDict 和运行时校验。
- 能判断何时改用 dataclass 或 Pydantic。
