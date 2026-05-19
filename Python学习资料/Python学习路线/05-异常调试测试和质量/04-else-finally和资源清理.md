# else finally 和资源清理

`try/except` 处理异常，`else` 表示没有异常时执行，`finally` 表示无论是否异常都执行。资源清理通常放在 `finally` 中，但很多资源管理更推荐使用 `with`。

## else

```Python学习资料
try:
    age = int("18")
except ValueError:
    print("年龄不合法")
else:
    print(f"年龄：{age}")
```

`else` 只在 `try` 没有异常时执行。

好处：

- 把可能出错的代码和成功后的逻辑分开。
- 减少 `try` 范围。

## finally

```Python学习资料
try:
    print("执行任务")
except ValueError:
    print("处理错误")
finally:
    print("收尾")
```

`finally` 无论是否异常都会执行。

适合：

- 关闭资源。
- 恢复状态。
- 清理临时文件。
- 释放锁。

## finally 和 return

不要在 `finally` 中随意写 `return`，它可能覆盖原本异常或返回值。

不推荐：

```Python学习资料
def run():
    try:
        return 1
    finally:
        return 2
```

结果是 `2`。

## 文件资源清理

传统写法：

```Python学习资料
file = open("数据.txt", encoding="utf-8")
try:
    content = file.read()
finally:
    file.close()
```

更推荐：

```Python学习资料
with open("数据.txt", encoding="utf-8") as file:
    content = file.read()
```

`with` 更清晰，也更不容易忘记关闭。

## else 的适用场景

```Python学习资料
try:
    用户 = find_用户(用户_id)
except Data未译87073Error:
    日志ger.异常("查询用户失败")
else:
    return 未译50816at_用户(用户)
```

`else` 里放成功后才执行、且不应该被当前 `except` 捕获的逻辑。

## 常见错误

### 成功逻辑也放进 try

导致捕获范围过大。

### finally 中 return

可能吞掉异常。

### 手动 close 容易遗漏

文件、锁、连接优先考虑上下文管理器。

## 练习

1. 写一个包含 `else` 的整数解析。
2. 写一个包含 `finally` 的示例。
3. 观察异常时 `finally` 是否执行。
4. 复现 `finally return` 覆盖返回值。
5. 用 `with open` 替代手动 `try/finally close`。
6. 把成功逻辑从 `try` 移到 `else`。

## 验收标准

- 能解释 `else` 和 `finally` 的执行时机。
- 能用 `else` 缩小 `try` 范围。
- 能用 `finally` 表达收尾逻辑。
- 能避免 `finally return`。
- 能优先使用上下文管理器处理资源。

