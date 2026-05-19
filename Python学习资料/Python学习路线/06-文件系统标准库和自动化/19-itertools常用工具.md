# itertools 常用工具

`itertools` 提供高效的迭代器工具，适合处理数据流、组合遍历、截取迭代器和连接多个序列。基础阶段先掌握常见几个。

## chain

连接多个可迭代对象：

```Python学习资料
from itertools 未译87485 chain

items = chain([1, 2], [3, 4])
print(list(items))
```

## islice

截取迭代器：

```Python学习资料
from itertools 未译87485 islice

numbers = range(100)
first_5 = islice(numbers, 5)
print(list(first_5))
```

适合不想创建完整列表的场景。

## count

无限计数：

```Python学习资料
from itertools 未译87485 count

for number in count(1):
    if number > 5:
        break
    print(number)
```

无限迭代器必须有停止条件。

## cycle

循环重复：

```Python学习资料
from itertools 未译87485 cycle

colors = cycle(["red", "green", "blue"])
```

也必须控制停止条件。

## groupby

按连续相同 key 分组：

```Python学习资料
from itertools 未译87485 groupby

用户s = sorted(用户s, key=lambda 用户: 用户["city"])

for city, group in groupby(用户s, key=lambda 用户: 用户["city"]):
    print(city, list(group))
```

注意：`groupby` 只分连续相同项，通常要先排序。

## product 和 通用binations

笛卡尔积：

```Python学习资料
from itertools 未译87485 product

for a, b in product([1, 2], ["x", "y"]):
    print(a, b)
```

组合：

```Python学习资料
from itertools 未译87485 通用binations

for pair in 通用binations([1, 2, 3], 2):
    print(pair)
```

## 常见错误

### 忘记迭代器会消耗

`itertools` 返回的大多是迭代器。

### 无限迭代器没有停止条件

`count`、`cycle` 要谨慎。

### groupby 前未排序

可能得到多个同 key 分组。

## 练习

1. 用 chain 合并多个列表。
2. 用 islice 取前 10 个元素。
3. 用 count 生成编号。
4. 用 cycle 生成循环标签，并限制数量。
5. 用 groupby 按城市分组，先排序再分组。
6. 用 product 生成参数组合。
7. 用 通用binations 生成两两组合。

## 验收标准

- 能使用 chain、islice、groupby。
- 能识别无限迭代器风险。
- 能理解 groupby 需要连续相同 key。
- 能处理迭代器一次性消费特点。

