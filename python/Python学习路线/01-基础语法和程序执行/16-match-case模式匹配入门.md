# match case 模式匹配入门

`match case` 是 Python 3.10 引入的结构化模式匹配语法。基础阶段不需要深入掌握，但应该知道它可以替代一部分复杂的 `if/elif`。

## 基本语法

```python
command = input("请输入命令：").strip()

match command:
    case "start":
        print("启动")
    case "stop":
        print("停止")
    case "quit":
        print("退出")
    case _:
        print("未知命令")
```

`_` 表示默认匹配。

## 和 `if/elif` 对比

使用 `if/elif`：

```python
if command == "start":
    print("启动")
elif command == "stop":
    print("停止")
elif command == "quit":
    print("退出")
else:
    print("未知命令")
```

命令分支较多时，`match case` 可读性更好。

## 多值匹配

```python
status = 404

match status:
    case 200:
        print("成功")
    case 400 | 401 | 403:
        print("客户端权限或请求错误")
    case 404:
        print("未找到")
    case _:
        print("其他状态")
```

## 守卫条件

```python
score = 85

match score:
    case value if value >= 90:
        print("优秀")
    case value if value >= 60:
        print("及格")
    case _:
        print("不及格")
```

如果只是范围判断，`if/elif` 通常更直观。

## 结构匹配概念

`match case` 不只是比较值，还可以匹配结构。

```python
point = (3, 5)

match point:
    case (0, 0):
        print("原点")
    case (x, 0):
        print(f"x 轴上：{x}")
    case (0, y):
        print(f"y 轴上：{y}")
    case (x, y):
        print(f"普通点：{x}, {y}")
```

本阶段只需要看懂，后面数据结构和面向对象阶段再深入。

## 常见错误

### 忘记默认分支

如果没有 `case _`，未知输入可能没有任何输出。

### 把变量名当常量

在 `case name:` 中，`name` 可能被当作捕获变量，而不是比较变量。基础阶段避免写复杂匹配。

### 过度使用

简单二选一用 `if/else` 更清楚，不需要强行使用 `match case`。

## 适合使用的场景

- 命令分发。
- 状态码分支。
- 简单结构匹配。
- 多种固定输入分支。

## 不适合使用的场景

- 简单条件。
- 复杂范围判断。
- 初学阶段还没掌握 `if/elif`。

## 练习

1. 用 `match case` 实现命令菜单。
2. 匹配 HTTP 状态码。
3. 匹配星期数字，输出星期名称。
4. 把一个 `if/elif` 命令分支改写成 `match case`。
5. 给所有 `match` 都加上 `case _`。

## 验收标准

- 能看懂基本 `match case`。
- 能写固定值匹配。
- 能使用 `case _` 处理默认情况。
- 能判断什么时候应该继续使用 `if/elif`。

