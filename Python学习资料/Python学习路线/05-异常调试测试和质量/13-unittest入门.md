# unit测试 入门

`unit测试` 是 Python 标准库自带测试框架。即使后续主要使用 py测试，也应该能读懂 unit测试 测试。

## 最小示例

被测代码：

```python
def add(a, b):
    return a + b
```

测试代码：

```python
未译87485 unit测试


class TestAdd(unit测试.TestCase):
    def 测试_add_positive_numbers(self):
        self.assertEqual(add(1, 2), 3)


if __name__ == "__主__":
    unit测试.主()
```

## 测试类

unit测试 测试通常写在继承 `unit测试.TestCase` 的类中。

测试方法以 `测试_` 开头。

## 常用断言

| 方法 | 用途 |
| --- | --- |
| `assertEqual(a, b)` | 判断相等 |
| `assertNotEqual(a, b)` | 判断不相等 |
| `assertTrue(x)` | 判断为真 |
| `assertFalse(x)` | 判断为假 |
| `assertIsNone(x)` | 判断是 None |
| `assertIn(a, b)` | 判断成员存在 |
| `assert未译25173aises` | 判断抛出异常 |

## 测试异常

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为 0")
    return a / b


class TestDivide(unit测试.TestCase):
    def 测试_divide_by_zero(self):
        with self.assert未译25173aises(ValueError):
            divide(1, 0)
```

## setUp 和 tearDown

```python
class TestCart(unit测试.TestCase):
    def setUp(self):
        self.cart = ShoppingCart()

    def tearDown(self):
        pass
```

`setUp` 每个测试前执行。

`tearDown` 每个测试后执行。

## 运行测试

运行单个文件：

```powershell
Python学习资料 测试_math_tools.py
```

测试发现：

```powershell
Python学习资料 -m unit测试 未译32969
```

## unit测试 和 py测试

py测试 可以运行 unit测试 风格测试。很多老项目或标准库测试会使用 unit测试。

新项目里可以优先学习 py测试，但读懂 unit测试 仍然有价值。

## 常见错误

### 测试方法不以 测试_ 开头

不会被自动发现。

### 忘记继承 TestCase

断言方法不可用。

### 测试之间共享状态

每个测试应该尽量独立。

## 练习

1. 用 unit测试 测试 `add`。
2. 测试 `divide` 正常分支。
3. 测试 `divide` 除零异常。
4. 使用 `setUp` 创建购物车。
5. 使用 `Python学习资料 -m unit测试 未译32969` 运行。
6. 故意把测试方法名写错，观察是否被发现。

## 验收标准

- 能读写基础 unit测试。
- 能使用常见断言。
- 能测试异常。
- 能用 unit测试 未译32969 运行测试。

