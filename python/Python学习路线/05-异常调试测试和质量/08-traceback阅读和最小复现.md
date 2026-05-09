# traceback 阅读和最小复现

traceback 是 Python 报错时给出的调用栈信息。读懂 traceback，比盲目搜索错误信息更重要。最小复现能把复杂问题缩小到几行代码。

## traceback 示例

```text
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    main()
  File "main.py", line 7, in main
    age = parse_age("abc")
  File "main.py", line 3, in parse_age
    return int(text)
ValueError: invalid literal for int() with base 10: 'abc'
```

重点看：

- 最后一行：异常类型和信息。
- 倒数几段：自己写的文件和行号。
- 调用链：错误是如何一路传出来的。

## 从下往上读

最后一行：

```text
ValueError: invalid literal for int() with base 10: 'abc'
```

说明字符串 `"abc"` 不能转整数。

上一段：

```text
File "main.py", line 3, in parse_age
    return int(text)
```

说明真正触发异常的代码行。

## 找自己的代码

大型项目 traceback 可能包含很多第三方库路径。优先找：

- 自己项目目录下的文件。
- 最近修改过的代码。
- 最靠近异常底部的自己写的函数。

## 最小复现

如果原脚本很大，不要在大文件里乱改。先抽出最小代码：

```python
def parse_age(text):
    return int(text)


parse_age("abc")
```

这就是最小复现。

## 最小复现原则

保留：

- 能触发问题的最少代码。
- 必要输入数据。
- 必要环境说明。

删除：

- 无关函数。
- 无关文件读写。
- 无关网络请求。
- 无关 UI 和打印。

## 变量观察

在错误行前打印：

```python
print(type(text), repr(text))
```

`repr` 能显示空格、换行、引号等细节。

## traceback 模块入门

可以手动打印异常栈：

```python
import traceback

try:
    int("abc")
except ValueError:
    traceback.print_exc()
```

实际项目里通常用 logging 的 `logger.exception`。

## 常见错误

### 只看第一行

traceback 第一行只是说明开始，不是根因。

### 只看最后一行，不看自己代码行

最后一行告诉异常类型，代码行告诉哪里触发。

### 复现代码仍然太大

最小复现应该小到别人一眼能看懂。

## 练习

1. 制造一个三层函数调用的 `ValueError`。
2. 标出 traceback 中的异常类型。
3. 标出真正触发异常的代码行。
4. 把 30 行脚本缩小成 5 行最小复现。
5. 使用 `repr` 观察带空格字符串。
6. 使用 `traceback.print_exc()`。

## 验收标准

- 能从 traceback 中找到异常类型、文件、行号。
- 能识别调用链。
- 能抽取最小复现。
- 能用 `repr` 辅助观察数据。

