# None 和真值判断

`None` 表示“没有值”。真值判断决定一个对象在条件语句中被当作真还是假。两者是基础阶段最容易混淆的知识点。

## `None` 是什么

```python
result = None
```

`None` 常用于表示：

- 函数没有返回结果。
- 变量暂时没有值。
- 查找失败。
- 可选配置没有设置。

`None` 不是：

- 空字符串 `""`。
- 数字 `0`。
- 布尔值 `False`。
- 空列表 `[]`。

## 判断是否为 `None`

推荐：

```python
if result is None:
    print("没有结果")
```

不推荐：

```python
if result == None:
    print("没有结果")
```

原因是 `None` 是一个特殊单例对象，判断是否为它应该使用 `is None`。

判断不是 `None`：

```python
if result is not None:
    print("有结果")
```

## 函数默认返回 `None`

如果函数没有写 `return`，默认返回 `None`。

```python
def say_hello():
    print("hello")

value = say_hello()
print(value)
```

输出里会看到 `None`。

## 真值判断

在 `if`、`while` 等条件里，Python 会把对象转换成真假。

常见假值：

- `False`
- `None`
- `0`
- `0.0`
- `""`
- `[]`
- `{}`
- `set()`

示例：

```python
name = ""

if name:
    print("有姓名")
else:
    print("没有姓名")
```

## `if x` 和 `if x is not None`

这两个判断不一样。

```python
score = 0

if score:
    print("有分数")
else:
    print("没有分数")
```

这里会输出“没有分数”，因为 `0` 是假值。

如果业务上 `0` 是有效值，应该写：

```python
if score is not None:
    print("有分数")
```

## 常见场景

### 用户没有输入

```python
name = input("请输入姓名：").strip()

if not name:
    print("姓名不能为空")
```

空字符串适合用真值判断。

### 查找结果可能为空

```python
found_user = None

if found_user is None:
    print("用户不存在")
```

对象不存在适合用 `is None`。

## 常见错误

### 把 `None` 当字符串使用

```python
name = None
print(name.strip())
```

会报错，因为 `None` 没有 `strip()` 方法。

### 把 `0` 当成没有值

```python
count = 0

if not count:
    print("没有数量")
```

如果 `0` 是合法数量，这个判断就不准确。

## 练习

1. 定义 `result = None`，用 `is None` 判断。
2. 写一个没有 `return` 的函数，观察返回值。
3. 分别测试 `0`、`""`、`None`、`False` 在 `if` 中的结果。
4. 输入姓名，如果为空则提示错误。
5. 输入分数，允许分数为 0，但不允许没有输入。

## 验收标准

- 能解释 `None` 的含义。
- 能区分 `if x` 和 `if x is not None`。
- 能列出常见假值。
- 能避免把 `0`、空字符串和 `None` 混为一谈。

