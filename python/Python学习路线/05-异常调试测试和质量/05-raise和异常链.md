# raise 和异常链

`raise` 用于主动抛出异常。主动抛出异常可以让函数在发现非法状态时立即停止，并把错误交给调用方处理。

## 主动抛出异常

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为 0")
    return a / b
```

调用方：

```python
try:
    divide(1, 0)
except ValueError as error:
    print(error)
```

## 重新抛出当前异常

```python
try:
    age = int("abc")
except ValueError:
    print("记录错误")
    raise
```

单独的 `raise` 会重新抛出当前异常，并保留原始 traceback。

## 包装异常

有时底层异常太技术化，可以包装成业务异常。

```python
class UserInputError(Exception):
    pass


def parse_age(text):
    try:
        return int(text)
    except ValueError as error:
        raise UserInputError("年龄必须是整数") from error
```

`from error` 会保留异常链。

## `raise from None`

如果不想展示底层异常链：

```python
raise UserInputError("年龄必须是整数") from None
```

谨慎使用。隐藏底层异常可能让调试变难。

## 异常信息要具体

不推荐：

```python
raise ValueError("bad")
```

推荐：

```python
raise ValueError(f"年龄必须在 0-120 之间，当前值：{age}")
```

注意不要把敏感信息写进异常。

## 什么时候 raise

适合：

- 参数非法。
- 状态不允许当前操作。
- 外部资源不可用。
- 业务规则被违反。
- 当前函数无法继续完成职责。

不适合：

- 普通可预期分支。
- 简单布尔判断可以表达的流程。
- 用异常替代循环控制。

## 常见错误

### 抛出字符串

Python 3 中不能：

```python
raise "error"
```

必须抛出异常对象或异常类。

### 捕获后丢失原始异常

```python
except ValueError:
    raise UserInputError("输入错误")
```

更推荐：

```python
except ValueError as error:
    raise UserInputError("输入错误") from error
```

### 异常信息太模糊

错误信息应该能指导排查。

## 练习

1. 写 `divide`，除数为 0 时 raise。
2. 写 `validate_age`，年龄不合法时 raise。
3. 捕获后使用单独 `raise` 重新抛出。
4. 使用 `raise from` 包装异常。
5. 比较 `raise from error` 和 `raise from None`。
6. 改写 5 条模糊异常信息。

## 验收标准

- 能主动抛出异常。
- 能重新抛出当前异常。
- 能用 `raise from` 保留异常链。
- 能写具体、可排查的异常信息。

