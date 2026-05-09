# 生成器和 yield

生成器是一种惰性产生数据的工具。它不会一次性返回所有结果，而是每次需要时产生一个值。处理大文件、大列表、流式数据时非常有用。

## 生成器函数

函数里出现 `yield`，它就是生成器函数。

```python
def count_up_to(n):
    current = 1
    while current <= n:
        yield current
        current += 1
```

使用：

```python
for number in count_up_to(3):
    print(number)
```

输出：

```text
1
2
3
```

## `yield` 和 `return`

`return`：

- 返回一个结果。
- 函数结束。

`yield`：

- 产出一个值。
- 暂停函数状态。
- 下次继续从暂停处执行。

## 生成器对象

```python
gen = count_up_to(3)

print(next(gen))
print(next(gen))
print(next(gen))
```

生成器也是迭代器，会被消费。

## 生成器表达式

列表推导式：

```python
squares = [n * n for n in range(10)]
```

生成器表达式：

```python
squares = (n * n for n in range(10))
```

生成器表达式不会立即创建完整列表。

## 适合生成器的场景

- 大文件逐行处理。
- 大量数据按需处理。
- 无限序列。
- 数据管道。
- 避免一次性占用大量内存。

## 示例：逐行清洗文本

```python
def clean_lines(lines):
    for line in lines:
        line = line.strip()
        if line:
            yield line
```

使用：

```python
lines = [" hello ", "", " python "]

for line in clean_lines(lines):
    print(line)
```

## 生成器只能消费一次

```python
gen = count_up_to(3)

print(list(gen))
print(list(gen))
```

第二次是空列表。

## 常见错误

### 以为生成器是列表

```python
gen = (n for n in range(3))
print(gen[0])
```

生成器不能索引。

### 多次消费同一个生成器

生成器消费后不会自动重置。

### 在需要列表的地方传生成器

有些函数需要列表长度、索引或多次遍历，这时应该显式转成列表。

## 练习

1. 写一个生成 1-n 的生成器。
2. 写一个生成偶数的生成器。
3. 写一个清洗非空行的生成器。
4. 比较列表推导式和生成器表达式。
5. 观察生成器被消费一次后的结果。
6. 用生成器处理 100000 个数字，避免创建完整列表。

## 验收标准

- 能写简单 `yield` 生成器。
- 能解释 `yield` 和 `return` 的区别。
- 能使用生成器表达式。
- 能说明生成器惰性和一次性消费特点。

