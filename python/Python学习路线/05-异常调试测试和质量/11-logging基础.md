# logging 基础

`logging` 是 Python 标准库提供的日志系统。它可以按级别记录信息，控制输出格式和输出位置，是长期项目中替代 `print` 的基础工具。

## 最小示例

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.debug("调试信息")
logging.info("普通信息")
logging.warning("警告信息")
logging.error("错误信息")
```

## 日志级别

常见级别从低到高：

| 级别 | 场景 |
| --- | --- |
| DEBUG | 调试细节 |
| INFO | 正常关键流程 |
| WARNING | 可恢复异常或风险 |
| ERROR | 操作失败 |
| CRITICAL | 严重故障 |

## 模块级 logger

推荐每个模块创建自己的 logger：

```python
import logging

logger = logging.getLogger(__name__)
```

使用：

```python
logger.info("开始处理")
logger.error("处理失败")
```

`__name__` 能让日志知道来自哪个模块。

## 日志格式

```python
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
```

常用字段：

- `asctime`：时间。
- `levelname`：级别。
- `name`：logger 名称。
- `message`：日志内容。
- `filename`：文件名。
- `lineno`：行号。

## logger.exception

在 `except` 中记录异常栈：

```python
try:
    int("abc")
except ValueError:
    logger.exception("解析年龄失败")
```

`logger.exception` 会自动附带 traceback。

只应在异常处理块里使用。

## 占位符参数

推荐：

```python
logger.info("处理用户 user_id=%s", user_id)
```

不推荐：

```python
logger.info(f"处理用户 user_id={user_id}")
```

占位符方式在日志级别关闭时更高效，也更符合 logging 习惯。

## 输出到文件入门

```python
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    encoding="utf-8",
)
```

实际项目会用更完整的 handler 配置，基础阶段先掌握概念。

## 常见错误

### 重复 basicConfig 不生效

`basicConfig` 通常只在第一次配置时生效。大型项目要集中配置日志。

### 库模块里配置全局 logging

库模块通常只创建 logger，不应该随意配置全局输出。

### 日志缺少上下文

不推荐：

```python
logger.error("失败")
```

推荐：

```python
logger.error("保存订单失败 order_id=%s", order_id)
```

### 日志泄露敏感信息

敏感字段要脱敏。

## 练习

1. 配置 basicConfig。
2. 输出 5 个不同级别日志。
3. 创建模块级 logger。
4. 使用日志格式显示时间和模块名。
5. 在 except 中使用 `logger.exception`。
6. 把 f-string 日志改成占位符。
7. 输出日志到文件。

## 验收标准

- 能使用 logging 基础 API。
- 能区分日志级别。
- 能创建模块级 logger。
- 能使用 `logger.exception` 记录异常栈。
- 能写有上下文、不泄露敏感信息的日志。

