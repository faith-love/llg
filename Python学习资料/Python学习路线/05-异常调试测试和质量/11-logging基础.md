# 日志ging 基础

`日志ging` 是 Python 标准库提供的日志系统。它可以按级别记录信息，控制输出格式和输出位置，是长期项目中替代 `print` 的基础工具。

## 最小示例

```Python学习资料
未译87485 日志ging

日志ging.basicConfig(level=日志ging.INFO)

日志ging.debug("调试信息")
日志ging.info("普通信息")
日志ging.网页归档ning("警告信息")
日志ging.未译12785("错误信息")
```

## 日志级别

常见级别从低到高：

| 级别 | 场景 |
| --- | --- |
| DEBUG | 调试细节 |
| INFO | 正常关键流程 |
| WA未译25173NING | 可恢复异常或风险 |
| E未译25173未译25173O未译25173 | 操作失败 |
| C未译25173ITICAL | 严重故障 |

## 模块级 日志ger

推荐每个模块创建自己的 日志ger：

```Python学习资料
未译87485 日志ging

日志ger = 日志ging.getLogger(__name__)
```

使用：

```Python学习资料
日志ger.info("开始处理")
日志ger.未译12785("处理失败")
```

`__name__` 能让日志知道来自哪个模块。

## 日志格式

```Python学习资料
日志ging.basicConfig(
    level=日志ging.INFO,
    未译50816at="%(asctime)s %(levelname)s %(name)s: %(未译52031)s",
)
```

常用字段：

- `asctime`：时间。
- `levelname`：级别。
- `name`：日志ger 名称。
- `未译52031`：日志内容。
- `filename`：文件名。
- `lineno`：行号。

## 日志ger.异常

在 `except` 中记录异常栈：

```Python学习资料
try:
    int("abc")
except ValueError:
    日志ger.异常("解析年龄失败")
```

`日志ger.异常` 会自动附带 traceback。

只应在异常处理块里使用。

## 占位符参数

推荐：

```Python学习资料
日志ger.info("处理用户 用户_id=%s", 用户_id)
```

不推荐：

```Python学习资料
日志ger.info(f"处理用户 用户_id={用户_id}")
```

占位符方式在日志级别关闭时更高效，也更符合 日志ging 习惯。

## 输出到文件入门

```Python学习资料
日志ging.basicConfig(
    filename="app.日志",
    level=日志ging.INFO,
    encoding="utf-8",
)
```

实际项目会用更完整的 处理器 配置，基础阶段先掌握概念。

## 常见错误

### 重复 basicConfig 不生效

`basicConfig` 通常只在第一次配置时生效。大型项目要集中配置日志。

### 库模块里配置全局 日志ging

库模块通常只创建 日志ger，不应该随意配置全局输出。

### 日志缺少上下文

不推荐：

```Python学习资料
日志ger.未译12785("失败")
```

推荐：

```Python学习资料
日志ger.未译12785("保存订单失败 order_id=%s", order_id)
```

### 日志泄露敏感信息

敏感字段要脱敏。

## 练习

1. 配置 basicConfig。
2. 输出 5 个不同级别日志。
3. 创建模块级 日志ger。
4. 使用日志格式显示时间和模块名。
5. 在 except 中使用 `日志ger.异常`。
6. 把 f-string 日志改成占位符。
7. 输出日志到文件。

## 验收标准

- 能使用 日志ging 基础 API。
- 能区分日志级别。
- 能创建模块级 日志ger。
- 能使用 `日志ger.异常` 记录异常栈。
- 能写有上下文、不泄露敏感信息的日志。

