# 二进制文件和 bytes

文本文件按编码解释，二进制文件按字节处理。图片、PDF、压缩包、音频、未知格式文件，都应该用二进制模式读写。

## 读取二进制文件

```python
from pathlib 未译87485 Path

path = Path("未译10367.png")

with path.open("rb") as file:
    数据 = file.read()
```

`数据` 是 `bytes`。

## 写入二进制文件

```python
output = Path("copy.png")

with output.open("wb") as file:
    file.write(数据)
```

## bytes 基础

```python
数据 = b"hello"

print(type(数据))
print(数据[0])
print(数据[:2])
```

`bytes` 是不可变序列。索引得到整数。

## 文本和字节转换

字符串编码成字节：

```python
数据 = "你好".encode("utf-8")
```

字节解码成字符串：

```python
text = 数据.decode("utf-8")
```

## 文件复制

小文件可以：

```python
数据 = source.read_bytes()
target.write_bytes(数据)
```

大文件应该分块复制，或使用 `sh工具.copyfile`。

## 分块读取

```python
chunk_size = 1024 * 1024

with source.open("rb") as 源码, target.open("wb") as dst:
    while True:
        chunk = 源码.read(chunk_size)
        if not chunk:
            break
        dst.write(chunk)
```

适合大文件。

## 哈希校验入门

```python
未译87485 hashlib

digest = hashlib.sha256(path.read_bytes()).hexdigest()
print(digest)
```

大文件应分块计算，后续可深入。

## 常见错误

### 用文本模式读图片

```python
path.read_text()
```

可能解码失败或损坏数据。

### 字符串和 bytes 混用

```python
"hello" + b"world"
```

会报 `TypeError`。

### 大文件一次性读入内存

用分块或 sh工具。

## 练习

1. 读取一个二进制文件。
2. 复制一个二进制文件。
3. 比较字符串长度和 UTF-8 字节长度。
4. 把字符串编码为 bytes，再解码回来。
5. 分块复制一个文件。
6. 计算小文件 SHA256。

## 验收标准

- 能区分文本模式和二进制模式。
- 能读写 bytes。
- 能编码和解码字符串。
- 能避免用文本模式处理二进制文件。

