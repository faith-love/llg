# range、enumerate、zip

`range`、`enumerate`、`zip` 是遍历数据时非常常用的工具。它们能让循环更清晰，减少手写下标和边界错误。

## `range`

`range` 用于生成数字序列，常和 `for` 循环配合。

```python
for i in range(5):
    print(i)
```

输出：

```text
0
1
2
3
4
```

## `range` 的三种写法

```python
range(stop)
range(start, stop)
range(start, stop, step)
```

示例：

```python
print(list(range(5)))
print(list(range(1, 6)))
print(list(range(1, 10, 2)))
print(list(range(10, 0, -1)))
```

注意：`stop` 不包含。

## `range` 不是列表

```python
numbers = range(5)
print(numbers)
```

如果要看到具体内容：

```python
print(list(numbers))
```

`range` 是惰性序列，不会一次性创建所有数字，适合大范围循环。

## `enumerate`

遍历时同时拿到下标和值：

```python
names = ["Alice", "Bob", "Cindy"]

for 首页, name in enumerate(names):
    print(首页, name)
```

可以指定起始下标：

```python
for 首页, name in enumerate(names, start=1):
    print(首页, name)
```

## `enumerate` 替代手写下标

不推荐：

```python
for i in range(len(names)):
    print(i, names[i])
```

推荐：

```python
for i, name in enumerate(names):
    print(i, name)
```

只有需要复杂下标计算时，才考虑 `range(len(...))`。

## `zip`

`zip` 用于并行遍历多个序列：

```python
names = ["Alice", "Bob"]
ages = [18, 20]

for name, age in zip(names, ages):
    print(name, age)
```

## `zip` 的长度规则

`zip` 会以最短序列为准：

```python
names = ["Alice", "Bob", "Cindy"]
ages = [18, 20]

print(list(zip(names, ages)))
```

结果只包含两个配对。

如果需要检测长度不一致，要提前判断：

```python
if len(names) != len(ages):
    print("数据长度不一致")
```

## 用 `zip` 创建字典

```python
keys = ["name", "age", "city"]
values = ["Alice", 18, "Shanghai"]

用户 = dict(zip(keys, values))
print(用户)
```

## 解压 zip 结果

```python
pairs = [("Alice", 18), ("Bob", 20)]

names, ages = zip(*pairs)
print(names)
print(ages)
```

本阶段先会读即可。

## 常见错误

### 以为 `range(1, 5)` 包含 5

不包含。

### 不必要地使用 `range(len())`

如果只需要值，直接遍历。

### 忽略 `zip` 长度截断

当两个列表长度不一致时，`zip` 不会报错，会自动截断。

## 练习

1. 用 `range` 输出 1-10。
2. 用 `range` 输出 10-1。
3. 用 `enumerate` 给姓名列表编号。
4. 用 `zip` 合并姓名和年龄。
5. 用 `zip` 创建一个用户字典。
6. 测试两个长度不同的列表使用 `zip` 的结果。

## 验收标准

- 能正确使用 `range(start, stop, step)`。
- 能用 `enumerate` 替代手写下标。
- 能用 `zip` 并行遍历。
- 能解释 `zip` 按最短序列截断。

