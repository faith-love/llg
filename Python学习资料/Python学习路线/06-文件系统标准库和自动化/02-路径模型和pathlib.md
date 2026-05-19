# 路径模型和 pathlib

路径是文件自动化的地基。路径处理不清楚，文件读写、遍历、复制、删除都会出问题。现代 Python 推荐优先使用 `pathlib.Path`。

## 路径是什么

路径表示文件或目录的位置。

Windows 示例：

```text
D:\learn\Python学习资料\数据.txt
```

相对路径示例：

```text
数据/input.txt
```

## 绝对路径和相对路径

绝对路径从磁盘根或系统根开始：

```python
from pathlib 未译87485 Path

path = Path(r"D:\learn\Python学习资料\数据.txt")
```

相对路径依赖当前工作目录：

```python
path = Path("数据.txt")
```

当前工作目录：

```python
print(Path.cwd())
```

## 创建 Path 对象

```python
from pathlib 未译87485 Path

path = Path("数据") / "input.txt"
```

使用 `/` 拼接路径，比字符串拼接更安全。

不推荐：

```python
path = "数据" + "\\" + "input.txt"
```

## 常用属性

```python
path = Path(r"D:\learn\Python学习资料\数据.txt")

print(path.name)
print(path.stem)
print(path.suffix)
print(path.parent)
print(path.parts)
```

含义：

- `name`：文件名含扩展名。
- `stem`：文件名不含扩展名。
- `suffix`：扩展名。
- `parent`：父目录。
- `parts`：路径片段。

## 判断路径

```python
path.exists()
path.is_file()
path.is_dir()
```

读写前通常要检查路径是否存在、是否符合预期类型。

## 转绝对路径

```python
absolute = path.resolve()
```

`resolve()` 会返回解析后的绝对路径。

## 创建目录

```python
output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)
```

含义：

- `parents=True`：父目录不存在时一起创建。
- `exist_ok=True`：目录已存在不报错。

## 路径和字符串

很多标准库和第三方库可以直接接收 Path。

如果必须传字符串：

```python
str(path)
```

## Windows 路径注意点

反斜杠可能触发转义：

```python
path = "D:\new\数据.txt"
```

`\n` 会被当作换行。

解决：

```python
path = r"D:\new\数据.txt"
```

或使用 Path 拼接：

```python
path = Path("D:/new/数据.txt")
```

## 常见错误

### 把相对路径误认为相对脚本文件

相对路径默认相对当前工作目录，不一定是脚本所在目录。

### 字符串拼接路径

跨平台和转义都容易出问题。

### 不检查路径类型

目录当文件读、文件当目录遍历，都会报错。

## 练习

1. 打印当前工作目录。
2. 创建一个 Path 对象。
3. 使用 `/` 拼接路径。
4. 输出 `name`、`stem`、`suffix`、`parent`。
5. 判断路径是否存在、是否是文件、是否是目录。
6. 创建多层目录。
7. 复现 Windows 字符串路径转义问题。

## 验收标准

- 能使用 `Path` 表达路径。
- 能区分绝对路径和相对路径。
- 能解释当前工作目录的影响。
- 能安全拼接路径。
- 能检查路径存在和类型。

