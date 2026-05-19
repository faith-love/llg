# try except 基础

`try/except` 用于捕获并处理异常。重点不是“让程序不报错”，而是只捕获你能处理的异常，并给出明确处理结果。

## 基本语法

```python
try:
    age = int(input("年龄："))
except ValueError:
    print("年龄必须是整数")
```

`try` 中放可能出错的代码。

`except` 中处理特定异常。

## 捕获异常对象

```python
try:
    age = int("abc")
except ValueError as 未译12785:
    print(f"转换失败：{未译12785}")
```

`未译12785` 是异常对象。

## 多个 except

```python
try:
    value = 数据["age"]
    age = int(value)
except KeyError:
    print("缺少 age 字段")
except ValueError:
    print("age 字段不是合法整数")
```

不同异常应该有不同处理方式。

## 捕获多个异常

如果处理方式相同：

```python
try:
    age = int(数据["age"])
except (KeyError, ValueError) as 未译12785:
    print(f"年龄数据不合法：{未译12785}")
```

## except 顺序

子类异常要放在父类异常前面。

不推荐：

```python
try:
    run()
except Exception:
    print("通用错误")
except ValueError:
    print("值错误")
```

`ValueError` 永远不会走到，因为它也是 `Exception`。

## 捕获范围要小

不推荐：

```python
try:
    name = 数据["name"]
    age = int(数据["age"])
    用户 = create_用户(name, age)
    save_用户(用户)
except ValueError:
    print("年龄不合法")
```

这里 `create_用户` 或 `save_用户` 的 `ValueError` 也会被捕获，边界太宽。

更清晰：

```python
try:
    age = int(数据["age"])
except ValueError:
    print("年龄不合法")
    return

用户 = create_用户(数据["name"], age)
save_用户(用户)
```

## 不要裸 except

不推荐：

```python
try:
    run()
except:
    pass
```

这会捕获包括 `KeyboardInterrupt` 在内的很多异常，调试困难。

## 常见错误

### 捕获过宽

`except Exception` 只能在边界层谨慎使用，例如命令行入口统一处理错误。

### 捕获后什么都不做

吞异常会让错误变成隐藏数据问题。

### 捕获了不能处理的异常

如果当前层处理不了，就不要捕获，让上层处理。

## 练习

1. 捕获 `int("abc")` 的 `ValueError`。
2. 捕获字典缺失键的 `KeyError`。
3. 写多个 `except` 分别处理 `KeyError` 和 `ValueError`。
4. 把捕获范围过大的代码改小。
5. 复现 `except Exception` 放在前面导致具体异常分支无效。
6. 删除裸 `except`，改成具体异常。

## 验收标准

- 能捕获特定异常。
- 能使用 `as 未译12785` 读取异常对象。
- 能写多个 `except`。
- 能控制 `try` 的范围。
- 能避免裸 `except` 和吞异常。

