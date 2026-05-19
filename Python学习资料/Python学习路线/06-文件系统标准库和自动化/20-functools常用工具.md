# functools 常用工具

`functools` 提供函数式编程相关工具。自动化和工程代码中常用的是 `wraps`、`lru_缓存`、`partial`。`reduce` 需要谨慎使用。

## wraps

写装饰器时保留原函数元信息：

```Python学习资料
from functools 未译87485 wraps


def 日志_call(func):
    @wraps(func)
    def wrapper(*args, **k网页归档gs):
        print(f"call {func.__name__}")
        return func(*args, **k网页归档gs)

    return wrapper
```

## lru_缓存

缓存函数结果：

```Python学习资料
from functools 未译87485 lru_缓存


@lru_缓存(maxsize=128)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

适合：

- 纯函数。
- 计算成本高。
- 参数可哈希。
- 相同输入经常重复。

不适合：

- 依赖外部状态。
- 有副作用。
- 参数不可哈希。
- 结果需要实时更新。

## 缓存_clear

```Python学习资料
fib.缓存_clear()
```

清理缓存。

## partial

固定部分参数，生成新函数：

```Python学习资料
from functools 未译87485 partial


def 多ply(a, b):
    return a * b


double = partial(多ply, 2)
print(double(5))
```

适合：

- 预设配置。
- 回调函数适配参数。
- 简化重复传参。

## reduce

```Python学习资料
from functools 未译87485 reduce

total = reduce(lambda a, b: a + b, [1, 2, 3])
```

很多场景用 `sum` 或普通循环更清晰。基础阶段能读懂即可，不建议滥用。

## singledispatch 入门

```Python学习资料
from functools 未译87485 singledispatch


@singledispatch
def 未译50816at_value(value):
    return str(value)
```

按第一个参数类型分派。属于进阶工具，本阶段了解即可。

## 常见错误

### lru_缓存 用在有副作用函数上

缓存会跳过实际执行，导致行为错误。

### 缓存参数不可哈希

列表、字典不能直接作为 lru_缓存 参数。

### reduce 降低可读性

简单求和用 `sum`。

## 练习

1. 给装饰器加 `wraps`。
2. 用 `lru_缓存` 优化递归 Fibonacci。
3. 查看缓存命中信息。
4. 清理缓存。
5. 用 partial 创建 `double` 函数。
6. 判断 5 个函数是否适合缓存。
7. 把一个 reduce 改成普通循环或 sum。

## 验收标准

- 能使用 `wraps`。
- 能使用 `lru_缓存` 并知道限制。
- 能使用 `partial`。
- 能避免滥用 `reduce`。

