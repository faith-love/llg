# JSON 文件处理

JSON 常用于配置、接口数据、结构化文件。Python 标准库 `json` 可以把 JSON 字符串和 Python 对象互相转换。

## Python 和 JSON 类型对应

| JSON | Python |
| --- | --- |
| object | dict |
| array | list |
| string | str |
| number | int/float |
| true/false | True/False |
| null | None |

## 读取 JSON 文件

```python
import json
from pathlib import Path

path = Path("data.json")

with path.open("r", encoding="utf-8") as file:
    data = json.load(file)
```

## 写入 JSON 文件

```python
with path.open("w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)
```

参数：

- `ensure_ascii=False`：中文正常输出。
- `indent=2`：格式化缩进。

## 字符串转换

Python 对象转 JSON 字符串：

```python
text = json.dumps(data, ensure_ascii=False, indent=2)
```

JSON 字符串转 Python 对象：

```python
data = json.loads(text)
```

## 结构校验

读取 JSON 后不要假设结构一定正确。

```python
if not isinstance(data, dict):
    raise ValueError("JSON 顶层必须是对象")

users = data.get("users", [])
if not isinstance(users, list):
    raise ValueError("users 必须是列表")
```

## 处理解析错误

```python
try:
    data = json.loads(text)
except json.JSONDecodeError as error:
    raise ValueError(f"JSON 格式错误：{error}") from error
```

## JSON 不能保存所有 Python 对象

不能直接保存：

- Path。
- datetime。
- set。
- 自定义对象。

需要先转换成字符串、列表或字典。

## 常见错误

### JSON 里写单引号

JSON 字符串必须用双引号。

### 忘记 ensure_ascii=False

中文会输出为转义形式，不一定错误，但可读性差。

### 直接信任 JSON 结构

外部 JSON 必须校验。

## 练习

1. 读取 JSON 文件。
2. 写入含中文的 JSON。
3. 使用 `loads` 和 `dumps`。
4. 处理 `JSONDecodeError`。
5. 校验顶层结构必须是字典。
6. 把用户列表写入 JSON。
7. 把 Path 和 datetime 转换成可 JSON 序列化数据。

## 验收标准

- 能读写 JSON 文件。
- 能处理中文输出。
- 能捕获 JSON 解析错误。
- 能校验 JSON 基本结构。
- 能知道哪些 Python 对象不能直接 JSON 序列化。

