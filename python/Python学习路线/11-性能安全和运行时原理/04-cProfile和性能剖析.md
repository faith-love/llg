# cProfile和性能剖析

`cProfile` 是 Python 标准库里的性能剖析工具。它可以告诉你函数调用次数、总耗时、累计耗时，帮助定位真正的热点。

## 命令行使用

```powershell
python -m cProfile -s cumulative script.py
```

常用排序：

- `cumulative`：累计耗时。
- `time`：函数自身耗时。
- `calls`：调用次数。

## 输出字段

常见字段：

| 字段 | 含义 |
| --- | --- |
| ncalls | 调用次数 |
| tottime | 函数自身耗时 |
| percall | 单次耗时 |
| cumtime | 包含子调用的累计耗时 |
| filename:lineno(function) | 函数位置 |

## 保存 profile 文件

```powershell
python -m cProfile -o profile.out script.py
```

后续可以用工具查看。

## 在代码中使用

```python
import cProfile
import pstats


profiler = cProfile.Profile()
profiler.enable()
do_work()
profiler.disable()

stats = pstats.Stats(profiler)
stats.sort_stats("cumulative").print_stats(20)
```

## 如何看结果

优先看：

- 累计耗时最高的函数。
- 调用次数异常高的函数。
- 自身耗时高的函数。
- 意外出现的慢函数。

不要只看第一行，要结合调用关系理解。

## 常见热点

- 重复数据库查询。
- 循环中重复正则编译。
- 大量字符串拼接。
- 不必要的深拷贝。
- 重复 JSON 解析。
- 低效数据结构成员测试。

## profile 的成本

profile 会增加运行开销，所以不要把 profile 数据当绝对耗时，只用来定位相对热点。

## 常见错误

### 只看总耗时不看调用次数

调用次数高的轻函数也可能是瓶颈。

### 优化非热点

profile 已经显示慢在 IO，却去优化字符串格式化。

### 用生产流量直接 profile

可能影响性能。应在测试环境或采样工具中谨慎操作。

### 不保存原始 profile

无法对比优化前后。

## 练习

1. 用 cProfile 运行一个脚本。
2. 按 cumulative 排序。
3. 按 time 排序。
4. 找出调用次数最高的函数。
5. 保存 profile.out。
6. 优化一个热点并重新 profile。
7. 写一份 profile 分析报告。

## 验收标准

- 能使用 cProfile。
- 能解释 ncalls、tottime、cumtime。
- 能根据 profile 找热点。
- 能保存并对比优化前后数据。
