# 断言 assert

`assert` 用于表达开发期假设：某个条件按理说必须为真。如果不为真，说明代码或测试存在问题。

## 基本语法

```python
assert condition
```

带信息：

```python
assert age >= 0, "年龄不能小于 0"
```

如果条件为假，会抛出 `AssertionError`。

## 在测试中使用 assert

pytest 中常用：

```python
def test_add():
    assert add(1, 2) == 3
```

pytest 会增强 assert 输出，让失败原因更清楚。

## 在代码中使用 assert

可以用于内部不变量检查：

```python
def average(numbers):
    assert numbers, "numbers 不应该为空"
    return sum(numbers) / len(numbers)
```

但要谨慎。

## assert 不是用户输入校验

不推荐：

```python
def set_age(age):
    assert age >= 0
```

用户输入或业务规则应该使用显式异常：

```python
if age < 0:
    raise ValueError("年龄不能小于 0")
```

原因：Python 可以用优化模式关闭 assert。

## assert 可能被禁用

运行：

```powershell
python -O script.py
```

`assert` 会被移除。

所以不要依赖 assert 做安全检查、权限检查、业务校验。

## 常见使用场景

适合：

- 测试断言。
- 内部开发期假设。
- 不变量辅助检查。

不适合：

- 用户输入校验。
- 认证授权。
- 业务规则。
- 外部数据校验。

## 常见错误

### 用 assert 验证外部输入

外部输入应该 raise 明确异常。

### assert 信息不清楚

```python
assert x
```

失败时难定位。可以加说明：

```python
assert x, "x 应该为真"
```

### 在测试里写太复杂的 assert

复杂断言拆成中间变量，更容易读。

## 练习

1. 写一个简单 assert。
2. 制造 `AssertionError`。
3. 在 pytest 测试中使用 assert。
4. 把用户输入校验里的 assert 改成 `raise ValueError`。
5. 给 assert 添加清晰信息。
6. 了解 `python -O` 对 assert 的影响。

## 验收标准

- 能解释 assert 的用途。
- 能在测试中使用 assert。
- 能避免用 assert 做业务校验。
- 能写清晰断言信息。

