# dataclass和类型建模

`dataclass` 用于快速定义以数据为主的类。它适合领域值对象、配置对象、任务结果、执行计划等结构化数据，比散乱的字典更清晰。

## 基本用法

```python
from dataclasses import dataclass


@dataclass
class Book:
    id: int
    title: str
    price: float
```

自动生成：

- `__init__`。
- `__repr__`。
- `__eq__`。

## 默认值

```python
@dataclass
class Page:
    page: int = 1
    page_size: int = 20
```

## default_factory

可变默认值必须用 `default_factory`：

```python
from dataclasses import dataclass, field


@dataclass
class Cart:
    items: list[str] = field(default_factory=list)
```

不要写：

```python
items: list[str] = []
```

## frozen

不可变 dataclass：

```python
@dataclass(frozen=True)
class Money:
    amount: int
    currency: str
```

适合值对象。

## slots

```python
@dataclass(slots=True)
class Point:
    x: int
    y: int
```

`slots=True` 可以减少实例内存并限制动态添加属性。不是所有场景都必须用。

## post_init

```python
@dataclass
class Page:
    page: int
    page_size: int

    def __post_init__(self) -> None:
        if self.page < 1:
            raise ValueError("page must be >= 1")
```

可用于简单运行时校验。

## dataclass 和 TypedDict

| 工具 | 适合 |
| --- | --- |
| TypedDict | 描述字典形状、JSON 边界 |
| dataclass | Python 内部结构化对象 |
| Pydantic | API/配置等运行时校验和解析 |

## 常见建模对象

适合 dataclass：

- `TaskResult`。
- `FileAction`。
- `ReportSummary`。
- `UserProfile`。
- `Money`。
- `DateRange`。
- `Config`。

## 常见错误

### 可变默认值

必须使用 `field(default_factory=...)`。

### dataclass 承担过多业务

dataclass 适合数据和简单行为，复杂业务仍放 service。

### 以为类型注解会自动校验

dataclass 不会因为字段标注 `int` 就拒绝字符串。

### 所有对象都用字典

字典会让字段散落，缺少类型和补全。

## 练习

1. 定义 `TaskResult` dataclass。
2. 定义 `FileAction` dataclass。
3. 使用 `default_factory`。
4. 使用 `frozen=True` 定义值对象。
5. 使用 `__post_init__` 校验分页参数。
6. 把一个嵌套字典改成 dataclass。
7. 比较 dataclass、TypedDict、Pydantic 的适用场景。

## 验收标准

- 能定义 dataclass。
- 能正确处理默认值和可变默认值。
- 能使用 frozen 和 post_init。
- 能判断 dataclass 与 TypedDict 的边界。
