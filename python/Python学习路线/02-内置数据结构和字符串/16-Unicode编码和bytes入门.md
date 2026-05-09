# Unicode 编码和 bytes 入门

字符串是文本，`bytes` 是字节。文件、网络、接口、图片、压缩包等底层都涉及字节。基础阶段先理解文本和字节的区别，避免乱码问题。

## 文本和字节

字符串：

```python
text = "你好"
print(type(text))
```

字节：

```python
data = b"hello"
print(type(data))
```

`str` 表示文本字符。

`bytes` 表示原始字节。

## Unicode

Python 3 的 `str` 使用 Unicode 表示文本。Unicode 是字符集，目标是给世界上不同语言的字符统一编号。

例如：

```python
text = "你好，Python"
print(len(text))
```

`len` 返回字符数量，不是字节数量。

## 编码

把字符串变成字节叫编码：

```python
text = "你好"
data = text.encode("utf-8")
print(data)
```

## 解码

把字节变成字符串叫解码：

```python
text = data.decode("utf-8")
print(text)
```

编码和解码要使用同一种规则，否则可能乱码或报错。

## UTF-8

UTF-8 是最常用的编码。建议默认使用 UTF-8。

后续读写文件时经常会写：

```python
open("data.txt", encoding="utf-8")
```

## 字节长度和字符长度

```python
text = "你好"
data = text.encode("utf-8")

print(len(text))
print(len(data))
```

中文字符在 UTF-8 中通常占多个字节。

## 错误处理

解码失败可能报 `UnicodeDecodeError`。

```python
data = b"\xff"
data.decode("utf-8")
```

可以指定错误处理方式：

```python
data.decode("utf-8", errors="replace")
```

但不要把错误处理当作随意忽略乱码的借口。应该尽量确认真实编码。

## 常见乱码原因

- 文件实际编码不是 UTF-8。
- 读取文件时没有指定编码。
- 网络响应编码判断错误。
- Windows 终端显示编码和文件编码不一致。
- 把 bytes 当 str 处理。

## `bytes` 基础操作

```python
data = b"hello"

print(data[0])
print(data[:2])
```

`bytes` 是不可变序列，索引结果是整数。

如果需要可变字节序列，有 `bytearray`，本阶段只了解。

## 常见错误

### 字符串和字节混用

```python
text = "hello"
data = b" world"

print(text + data)
```

会报 `TypeError`。需要先统一类型。

### 读文件不指定编码

不同系统默认编码可能不同，建议明确写 `encoding="utf-8"`。

### 看到乱码就随便换编码

应该先判断数据来源和实际编码。

## 练习

1. 把中文字符串编码成 UTF-8 字节。
2. 把 UTF-8 字节解码回字符串。
3. 比较中文字符串的字符长度和字节长度。
4. 制造一次 `UnicodeDecodeError`。
5. 尝试字符串和 bytes 相加，观察错误。

## 验收标准

- 能区分 `str` 和 `bytes`。
- 能解释编码和解码。
- 能使用 UTF-8 编码解码。
- 能说明乱码的常见原因。

