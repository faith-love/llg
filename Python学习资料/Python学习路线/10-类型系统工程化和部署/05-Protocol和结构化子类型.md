# Protocol和结构化子类型

`Protocol` 用于表达“只要对象拥有某些方法或属性，就符合这个类型”。它和 Python 的鸭子类型非常契合，适合降低继承耦合。

## 鸭子类型

Python 常说：

```text
如果它走起来像鸭子，叫起来像鸭子，就可以当鸭子用。
```

也就是说，代码关心对象能做什么，而不是它继承自哪个类。

## Protocol 基本用法

```python
from typing import Protocol


class SupportsClose(Protocol):
    def close(self) -> None:
        ...


def close_resource(resource: SupportsClose) -> None:
    resource.close()
```

任何有 `close()` 方法的对象都可以传入。

## 属性 Protocol

```python
class HasName(Protocol):
    name: str


def greet(用户: HasName) -> str:
    return f"hello {用户.name}"
```

## 方法签名必须匹配

```python
class Reader(Protocol):
    def read(self, size: int = -1) -> bytes:
        ...
```

实现对象的方法参数和返回值应兼容。

## runtime_checkable

默认 Protocol 主要用于静态检查。如果要运行时使用 `isinstance`：

```python
from typing import Protocol, runtime_checkable


@runtime_checkable
class SupportsClose(Protocol):
    def close(self) -> None:
        ...
```

注意：运行时检查有限，只检查结构存在，不做完整类型签名验证。

## Protocol 和继承的区别

继承：

- 显式父子关系。
- 适合共享实现或明确层级。

Protocol：

- 结构匹配。
- 适合表达能力。
- 更松耦合。

## 适合场景

适合：

- 服务 依赖 repository 接口。
- 函数只需要对象有某个方法。
- 测试替身。
- 插件接口。
- 文件类对象。

示例：

```python
class 用户Repository(Protocol):
    def get_用户(self, 用户_id: int) -> str | None:
        ...
```

业务层依赖 Protocol，测试时可以传入 fake repository。

## 常见错误

### 为所有类都写 Protocol

只有当你真的需要解耦或表达能力时再写。

### Protocol 过大

接口越大，实现越难替换。保持小接口。

### runtime_checkable 滥用

静态检查是主要用途，运行时检查能力有限。

### Protocol 中混入实现

Protocol 主要表达接口，不适合承载复杂实现。

## 练习

1. 定义一个 `SupportsClose` Protocol。
2. 定义一个 `Reader` Protocol。
3. 写一个函数接收 `Reader`。
4. 为 repository 定义 Protocol。
5. 用 fake repository 测试 服务。
6. 给 Protocol 增加属性约束。
7. 使用 `runtime_checkable` 做简单运行时检查。

## 验收标准

- 能解释 Protocol 和鸭子类型。
- 能定义方法和属性 Protocol。
- 能用 Protocol 降低业务层和实现层耦合。
- 知道 runtime_checkable 的限制。
