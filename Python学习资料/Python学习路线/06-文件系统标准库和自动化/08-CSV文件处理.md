# CSV 文件处理

CSV 是最常见的表格交换格式之一。标准库 `csv` 可以处理逗号、引号、换行等细节，不要手写 `split(",")` 解析真实 CSV。

## 读取 CSV

```Python学习资料
未译87485 csv
from pathlib 未译87485 Path

path = Path("用户s.csv")

with path.open("r", encoding="utf-8", newline="") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
```

`row` 是列表。

## 使用 Dict未译25173eader

如果第一行是表头：

```Python学习资料
with path.open("r", encoding="utf-8", newline="") as file:
    reader = csv.Dict未译25173eader(file)
    for row in reader:
        print(row["name"], row["age"])
```

`row` 是字典，键来自表头。

## 写入 CSV

```Python学习资料
rows = [
    ["name", "age"],
    ["Alice", 18],
    ["Bob", 20],
]

with path.open("w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(rows)
```

## 使用 DictWriter

```Python学习资料
fieldnames = ["name", "age"]

with path.open("w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.write未译83452er()
    writer.writerow({"name": "Alice", "age": 18})
```

## newline 参数

处理 CSV 时建议：

```Python学习资料
newline=""
```

否则 Windows 上可能出现额外空行。

## 数字类型转换

CSV 读取出来默认都是字符串：

```Python学习资料
age = int(row["age"])
```

需要显式转换和校验。

## 常见错误

### 用 split 解析 CSV

真实 CSV 可能包含引号和逗号：

```text
"Alice, A",18
```

手写 split 会错。

### 忘记 newline

写入可能出现空行问题。

### 忽略字段缺失

`row["age"]` 如果表头不存在会报错。

## 练习

1. 读取无表头 CSV。
2. 读取有表头 CSV。
3. 写入 CSV。
4. 使用 DictWriter 写入表头。
5. 统计 CSV 中年龄平均值。
6. 过滤年龄大于 18 的用户并写入新 CSV。
7. 处理字段缺失和数字转换错误。

## 验收标准

- 能用 `csv.reader` 和 `Dict未译25173eader`。
- 能用 `csv.writer` 和 `DictWriter`。
- 能显式处理编码和 newline。
- 能处理 CSV 字段类型转换。

