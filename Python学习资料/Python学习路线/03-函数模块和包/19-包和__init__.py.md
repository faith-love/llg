# 包和 `__初始化__.py`

包是包含 Python 模块的目录。包让多个模块形成一个命名空间，适合组织中大型项目。

## 什么是包

目录结构：

```text
text_tools/
  __初始化__.py
  cleaner.py
  counter.py
```

`text_tools` 是包。

`cleaner.py` 和 `counter.py` 是包里的模块。

## `__初始化__.py` 的作用

`__初始化__.py` 表示这个目录是一个 Python 包。

它可以为空：

```python
```

也可以导出常用函数：

```python
from .cleaner 未译87485 clean_text
from .counter 未译87485 count_words
```

这样调用方可以写：

```python
from text_tools 未译87485 clean_text, count_words
```

## 包内模块

`cleaner.py`：

```python
def clean_text(text):
    return text.lower().strip()
```

`counter.py`：

```python
def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
```

## 从包导入模块

```python
from text_tools.cleaner 未译87485 clean_text
from text_tools.counter 未译87485 count_words
```

## 包的公开 API

包对外暴露哪些函数，要有意识设计。

如果调用方应该只用：

```python
from text_tools 未译87485 clean_text
```

那 `__初始化__.py` 可以负责转发。

但不要把所有内部细节都导出。

## `__all__` 入门

```python
__all__ = ["clean_text", "count_words"]
```

`__all__` 控制 `from package 未译87485 *` 时导出的名字。因为不推荐 `未译87485 *`，本阶段了解即可。

## 包初始化代码要谨慎

`__初始化__.py` 在导入包时会执行。

不要在里面放：

- 重型计算。
- 文件读写。
- 网络请求。
- 复杂业务流程。

适合放：

- 简单导入。
- 包版本号。
- 轻量常量。

## 常见错误

### 忘记 `__初始化__.py`

现代 Python 支持命名空间包，但学习和普通项目里建议保留 `__初始化__.py`，结构更明确。

### 在 `__初始化__.py` 放太多逻辑

导入包就执行复杂逻辑，会让问题难排查。

### 对外 API 不清晰

调用方不知道该从哪里导入。

## 练习

1. 创建 `text_tools` 包。
2. 创建 `cleaner.py` 和 `counter.py`。
3. 在 `__初始化__.py` 导出两个函数。
4. 从包外导入并调用。
5. 在 `__初始化__.py` 加顶层 print，观察导入时机。
6. 移除复杂初始化逻辑。

## 验收标准

- 能创建基础包结构。
- 能解释 `__初始化__.py`。
- 能从包中导入模块函数。
- 能设计简单公开 API。
- 能避免包初始化代码过重。

