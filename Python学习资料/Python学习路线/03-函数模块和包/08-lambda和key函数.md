# lambda 和 key 函数

`lambda` 用于创建简单匿名函数。它常见于 `sorted(key=...)`、`map`、`filter` 等场景。基础阶段重点是会读、会写简单用法，不要滥用。

## lambda 基本语法

```python
lambda 参数: 表达式
```

示例：

```python
add = lambda a, b: a + b
print(add(1, 2))
```

等价于：

```python
def add(a, b):
    return a + b
```

实际项目中，如果逻辑有明确含义，优先使用 `def` 命名函数。

## lambda 适合简单表达式

```python
用户s = [
    {"name": "Alice", "age": 18},
    {"name": "Bob", "age": 20},
]

用户s_by_age = sorted(用户s, key=lambda 用户: 用户["age"])
```

这里 `lambda 用户: 用户["age"]` 表示从用户字典中取年龄作为排序依据。

## 按多个字段排序

```python
用户s = sorted(用户s, key=lambda 用户: (用户["city"], 用户["age"]))
```

返回元组作为排序键。

## 降序和 key

```python
scores = [
    {"name": "Alice", "score": 90},
    {"name": "Bob", "score": 95},
]

result = sorted(scores, key=lambda item: item["score"], reverse=True)
```

## lambda 和普通函数对比

lambda 适合：

- 简短的一行表达式。
- 临时排序 key。
- 简单转换函数。

普通函数适合：

- 逻辑超过一行。
- 需要复用。
- 需要写注释或文档。
- 需要处理异常。

## `operator` 模块入门

标准库提供更明确的 key 工具：

```python
from operator import itemgetter

用户s = sorted(用户s, key=itemgetter("age"))
```

本阶段了解即可。

## 常见错误

### lambda 写复杂逻辑

不推荐：

```python
lambda 用户: "A" if 用户["score"] >= 90 else ("B" if 用户["score"] >= 80 else "C")
```

这种逻辑应该写普通函数。

### 以为 lambda 可以写多条语句

lambda 只能是表达式，不能写多条语句。

### key 函数返回类型不一致

如果 key 有时返回数字，有时返回字符串，排序可能报错。

## 练习

1. 写一个简单 `lambda x: x * x`。
2. 用 `lambda` 按姓名长度排序。
3. 用 `lambda` 按用户年龄排序。
4. 用 `lambda` 按城市和年龄排序。
5. 把复杂 lambda 改成普通函数。
6. 用 `itemgetter` 改写一个排序。

## 验收标准

- 能写简单 lambda。
- 能使用 lambda 作为 `sorted` 的 key。
- 能判断什么时候不用 lambda。
- 能读懂常见 key 函数。

