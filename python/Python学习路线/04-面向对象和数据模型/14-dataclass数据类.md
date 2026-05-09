# dataclass 数据类

`dataclass` 用于快速定义主要保存数据的类。它可以自动生成 `__init__`、`__repr__`、`__eq__` 等方法，减少样板代码。

## 基本用法

```python
from dataclasses import dataclass


@dataclass
class User:
    name: str
    age: int
```

使用：

```python
user = User("Alice", 18)
print(user)
```

自动生成：

- `__init__`
- `__repr__`
- `__eq__`

## 默认值

```python
@dataclass
class User:
    name: str
    age: int = 0
    active: bool = True
```

有默认值的字段要放在无默认值字段后面。

## 可变默认值

不能直接写：

```python
@dataclass
class Team:
    members: list = []
```

应该使用 `field(default_factory=...)`：

```python
from dataclasses import dataclass, field


@dataclass
class Team:
    members: list[str] = field(default_factory=list)
```

这样每个实例都有自己的列表。

## 不可变数据类

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int
```

创建后不能修改属性：

```python
point = Point(1, 2)
point.x = 3
```

会报错。

## 排序

```python
@dataclass(order=True)
class Score:
    value: int
    name: str
```

可以比较和排序。

排序按字段定义顺序进行。实际项目中要谨慎，确保排序语义清晰。

## 字段配置

```python
from dataclasses import field


@dataclass
class User:
    name: str
    password: str = field(repr=False)
```

`repr=False` 表示打印对象时不显示该字段。

适合隐藏敏感字段。

## `__post_init__`

初始化后校验：

```python
@dataclass
class Product:
    name: str
    price: float

    def __post_init__(self):
        if self.price < 0:
            raise ValueError("价格不能小于 0")
```

## dataclass 适合什么

适合：

- 数据对象。
- 配置对象。
- 值对象。
- 简单领域实体。
- 减少样板代码。

不适合：

- 行为复杂的对象。
- 初始化过程很复杂。
- 属性大量动态变化。
- 需要精细控制对象生命周期。

## 常见错误

### 可变默认值直接写列表

使用 `default_factory`。

### 把所有类都写成 dataclass

数据类适合数据为主的类，不是所有类都适合。

### 类型标注不准确

dataclass 依赖类型标注定义字段。字段必须写标注。

## 练习

1. 定义 `User` 数据类。
2. 定义带默认值的 `Product`。
3. 使用 `field(default_factory=list)`。
4. 定义不可变 `Point`。
5. 使用 `__post_init__` 校验价格。
6. 使用 `repr=False` 隐藏密码字段。
7. 判断 5 个类是否适合 dataclass。

## 验收标准

- 能定义 dataclass。
- 能使用默认值和 `default_factory`。
- 能使用 `frozen=True`。
- 能使用 `__post_init__` 做校验。
- 能判断 dataclass 的适用边界。

