# print 调试和日志边界

`print` 是最简单的调试工具，但不应该长期留在项目里。随着程序变大，应该逐步使用 logging 管理运行信息。

## print 调试适合什么

适合：

- 临时观察变量。
- 快速验证执行路径。
- 学习阶段理解流程。
- 最小复现里显示结果。

示例：

```python
print(type(value), repr(value))
```

## print 调试的边界

不适合：

- 长期记录运行状态。
- 区分日志级别。
- 写入日志文件。
- 多模块项目。
- 生产环境排查。

## 临时 print 要有标识

不推荐：

```python
print(value)
```

更推荐：

```python
print(f"debug: value={value!r}")
```

这样容易搜索和清理。

## 什么时候升级到 logging

出现以下情况应该使用 logging：

- 需要区分 debug、info、warning、error。
- 需要记录时间、模块名、行号。
- 需要输出到文件。
- 需要在不同环境控制日志级别。
- 需要长期保留运行记录。

## print 和 logging 的区别

| 能力 | print | logging |
| --- | --- | --- |
| 临时观察 | 适合 | 也可 |
| 日志级别 | 不支持 | 支持 |
| 输出格式 | 简单 | 可配置 |
| 输出到文件 | 手动处理 | 支持 |
| 模块名和时间 | 手动拼 | 支持 |
| 生产环境 | 不适合 | 适合 |

## 不要输出敏感信息

无论 print 还是 logging，都不要输出：

- 密码。
- token。
- API key。
- 身份证号。
- 手机号完整明文。
- 数据库连接串密码。

## 清理 print

提交前检查：

```powershell
Select-String -Path . -Pattern "print\\(" -Recurse
```

在实际项目中可用 Ruff 等工具辅助检查。

## 常见错误

### 用 print 代替错误处理

```python
if not valid:
    print("错误")
```

如果调用方需要知道失败，应该返回状态或抛异常。

### print 太多导致关键信息被淹没

日志应该有级别和上下文。

### 输出敏感信息

调试时最容易泄露敏感数据。

## 练习

1. 使用 `print(type(x), repr(x))` 观察变量。
2. 给调试输出加 `debug:` 前缀。
3. 把 5 个长期 print 改成 logging。
4. 检查日志里是否包含敏感字段。
5. 写一个清理临时 print 的检查清单。

## 验收标准

- 能合理使用临时 print。
- 能判断什么时候应该用 logging。
- 能避免 print 替代错误处理。
- 能避免输出敏感信息。

