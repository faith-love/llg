# pytest fixture

fixture 用于准备测试所需的数据、对象或环境。它可以减少重复代码，让测试更清晰。

## 为什么需要 fixture

重复写法：

```python
def test_cart_total_empty():
    cart = ShoppingCart()
    assert cart.total_price() == 0


def test_cart_add_item():
    cart = ShoppingCart()
    cart.add_item("apple", 3, 2)
    assert cart.total_price() == 6
```

使用 fixture：

```python
import pytest


@pytest.fixture
def cart():
    return ShoppingCart()
```

测试：

```python
def test_cart_total_empty(cart):
    assert cart.total_price() == 0
```

pytest 会根据参数名自动注入 fixture。

## fixture 返回数据

```python
@pytest.fixture
def sample_users():
    return [
        {"name": "Alice", "age": 18},
        {"name": "Bob", "age": 20},
    ]
```

使用：

```python
def test_user_count(sample_users):
    assert len(sample_users) == 2
```

## fixture 做准备和清理

使用 `yield`：

```python
@pytest.fixture
def resource():
    print("准备资源")
    yield "resource"
    print("清理资源")
```

`yield` 前是准备，`yield` 后是清理。

## fixture 作用域

```python
@pytest.fixture(scope="function")
def data():
    return []
```

常见作用域：

- `function`：每个测试函数一次，默认。
- `module`：每个测试模块一次。
- `session`：整个测试会话一次。

基础阶段默认 `function` 即可。共享状态越大，越要谨慎。

## conftest.py

多个测试文件共享 fixture，可以放到 `conftest.py`。

```text
tests/
  conftest.py
  test_cart.py
  test_order.py
```

pytest 会自动发现 `conftest.py`。

## fixture 命名

fixture 名应该表达它提供什么：

```python
sample_users
empty_cart
paid_order
temp_config_file
```

不要写：

```python
data
obj
thing
```

除非上下文很明确。

## 常见错误

### fixture 之间共享可变状态

如果作用域过大，测试可能互相污染。

### fixture 做太多事

一个 fixture 既建数据库、又登录、又创建订单，会让测试难读。

### 不知道 fixture 是按名字注入

测试函数参数名必须和 fixture 名一致。

## 练习

1. 给购物车测试写 `cart` fixture。
2. 写 `sample_users` fixture。
3. 写带 `yield` 的资源清理 fixture。
4. 把共享 fixture 移到 `conftest.py`。
5. 观察 `function` 和 `module` 作用域差异。
6. 拆分一个过大的 fixture。

## 验收标准

- 能定义和使用 pytest fixture。
- 能用 fixture 减少重复准备代码。
- 能使用 `yield` 做清理。
- 能理解 fixture 作用域。
- 能用 `conftest.py` 共享 fixture。

