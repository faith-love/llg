# pandas入门和数据结构

pandas 是 Python 数据处理常用库。它适合清洗、转换、汇总中小规模结构化数据。学习 pandas 要先理解 Series、DataFrame、索引、列和数据类型。

## Series

Series 是一维带索引的数据。

```python
import pandas as pd


s = pd.Series([10, 20, 30], name="amount")
```

可以理解为一列数据。

## DataFrame

DataFrame 是二维表格数据。

```python
df = pd.DataFrame({
    "name": ["Alice", "Bob"],
    "amount": [100, 200],
})
```

可以理解为内存中的表。

## 列选择

```python
df["name"]
df[["name", "amount"]]
```

单列返回 Series，多列返回 DataFrame。

## 行过滤

```python
paid = df[df["amount"] >= 100]
```

过滤条件会生成布尔 Series。

## 新增列

```python
df["amount_with_tax"] = df["amount"] * 1.06
```

## 索引

索引用于标识行。

```python
df = df.set_index("id")
```

注意：pandas 索引不等于数据库主键。索引可以重复，除非你主动校验。

## 数据类型

查看类型：

```python
df.dtypes
```

常见类型：

- `object`
- `int64`
- `float64`
- `bool`
- `datetime64`
- `category`

类型错误会影响排序、计算、合并和导出。

## pandas 适用边界

适合：

- CSV/Excel 清洗。
- 报表汇总。
- 中小规模数据转换。
- 探索性分析。

不适合：

- 替代数据库长期存储。
- 无限制加载超大数据。
- 高并发服务状态管理。
- 需要强事务的业务写入。

## 常见错误

### 链式赋值

可能出现 SettingWithCopy 问题。优先使用 `.loc`。

```python
df.loc[df["amount"] > 100, "level"] = "high"
```

### 不检查 dtypes

金额可能是字符串，日期可能是 object。

### 把 DataFrame 当数据库

DataFrame 是内存对象，不提供数据库事务、索引约束和并发控制。

## 练习

1. 创建 Series。
2. 创建 DataFrame。
3. 选择单列和多列。
4. 过滤金额大于 100 的行。
5. 新增计算列。
6. 查看 dtypes。
7. 设置索引。
8. 使用 `.loc` 修改数据。
9. 说明 DataFrame 和数据库表的差异。

## 验收标准

- 能创建和操作 Series、DataFrame。
- 能选择、过滤、新增列。
- 能查看和解释 dtypes。
- 能说明 pandas 的适用边界。
