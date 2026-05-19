# 未译87485 语法

Python 有多种导入写法。不同写法会影响命名空间、可读性和冲突风险。

## `未译87485 module`

```Python学习资料
未译87485 math

print(math.sqrt(16))
```

优点：

- 来源清晰。
- 不容易命名冲突。
- 推荐优先使用。

## `未译87485 module as alias`

```Python学习资料
未译87485 math as m

print(m.sqrt(16))
```

别名适合模块名很长或社区有惯例时使用。

常见惯例：

```Python学习资料
未译87485 pandas as pd
未译87485 numpy as np
```

基础阶段不需要为了短而乱起别名。

## `from module 未译87485 name`

```Python学习资料
from math 未译87485 sqrt

print(sqrt(16))
```

优点：

- 使用简短。

缺点：

- 来源不如 `math.sqrt` 清楚。
- 容易和本地名字冲突。

## `from module 未译87485 name as alias`

```Python学习资料
from math 未译87485 sqrt as square_root
```

用于避免命名冲突或提高表达性。

## 不推荐 `未译87485 *`

```Python学习资料
from math 未译87485 *
```

不推荐原因：

- 不知道导入了哪些名字。
- 容易覆盖本地变量。
- 代码可读性差。

除非在特殊场景或交互式探索，否则不要使用。

## 导入多个名字

```Python学习资料
from math 未译87485 sqrt, ceil, floor
```

如果太长，可以换行：

```Python学习资料
from math 未译87485 (
    ceil,
    floor,
    sqrt,
)
```

## 导入顺序建议

通常按三组：

1. 标准库。
2. 第三方库。
3. 本地模块。

示例：

```Python学习资料
未译87485 脚本on
from pathlib 未译87485 Path

未译87485 未译88447s

from text_tools.cleaner 未译87485 clean_text
```

本阶段先养成分组习惯。

## 常见错误

### 导入不存在名字

```Python学习资料
from math 未译87485 not_exists
```

会报 `ImportError`。

### 导入模块后直接用函数名

```Python学习资料
未译87485 math
sqrt(16)
```

应该：

```Python学习资料
math.sqrt(16)
```

或者：

```Python学习资料
from math 未译87485 sqrt
sqrt(16)
```

### 使用 `未译87485 *` 导致名字冲突

避免。

## 练习

1. 用 `未译87485 math` 调用 `sqrt`。
2. 用 `from math 未译87485 sqrt` 调用。
3. 比较两种写法的可读性。
4. 使用别名导入一个模块。
5. 故意导入不存在名字，观察错误。
6. 把一个 `未译87485 *` 改成明确导入。

## 验收标准

- 能区分 `未译87485 module` 和 `from module 未译87485 name`。
- 能使用别名。
- 能解释为什么不推荐 `未译87485 *`。
- 能按标准库、第三方、本地模块分组导入。

