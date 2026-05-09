# schedule和APScheduler概念

Python 生态中常见的本地调度库包括 `schedule` 和 `APScheduler`。本节不是要求马上依赖某个库，而是让你理解轻量调度和工程化调度的差异。

## 标准库和第三方库的边界

标准库可以实现：

- 简单延迟。
- 简单周期循环。
- 基础调度。

第三方调度库通常提供：

- 更友好的时间表达。
- 多任务管理。
- 后台调度器。
- 任务存储。
- misfire 处理。
- 时区支持。

## schedule 概念

`schedule` 常用于轻量脚本。

典型写法类似：

```python
import schedule
import time


def job():
    print("run")


schedule.every(10).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
```

适合：

- 本地轻量脚本。
- 简单周期任务。
- 学习和个人自动化。

不适合：

- 高可靠生产任务。
- 大量任务。
- 需要持久化任务状态。
- 分布式调度。

## APScheduler 概念

APScheduler 更工程化，支持多种触发器和任务存储。

常见概念：

| 概念 | 说明 |
| --- | --- |
| scheduler | 调度器 |
| job | 任务 |
| trigger | 触发规则 |
| executor | 执行器 |
| job store | 任务存储 |

触发器：

- date：指定时间运行一次。
- interval：固定间隔运行。
- cron：按 cron 规则运行。

## misfire

misfire 指任务错过了预定执行时间。

原因：

- 程序没运行。
- 机器休眠。
- 上个任务占用执行器。
- 系统负载高。

需要决定：

- 是否补跑。
- 补跑几次。
- 超过多久不补跑。

## coalesce

如果错过多次执行，coalesce 表示是否合并成一次执行。

例如每分钟任务错过了 10 分钟：

- 合并：恢复后只跑一次。
- 不合并：恢复后补跑多次。

## max_instances

限制同一个任务同时运行的实例数。

如果任务还没结束，下次触发到了：

- 跳过。
- 排队。
- 报警。
- 允许并发。

初学阶段建议默认 `max_instances=1`。

## 和系统调度器的关系

Windows 任务计划程序、Linux cron、systemd timer 都可以调度 Python 脚本。

对比：

| 方式 | 适合 |
| --- | --- |
| Python 内部循环 | 简单本地工具 |
| schedule | 轻量周期脚本 |
| APScheduler | 应用内多个任务 |
| 系统调度器 | 稳定启动脚本 |
| 任务队列 | 分布式和高可靠任务 |

## 常见错误

### 用 schedule 做高可靠队列

它不是消息队列，也不是分布式任务系统。

### 忽略时区

每天 9 点运行必须说明是哪个时区。

### 任务没有超时

调度器只负责触发，不代表任务不会卡住。

### 不处理重叠执行

周期任务必须明确是否允许并发实例。

## 练习

1. 用普通循环实现每分钟任务。
2. 了解 `schedule.every().minutes.do()` 的表达方式。
3. 了解 APScheduler 的 date、interval、cron 触发器。
4. 写一份本地任务调度方案对比。
5. 设计一个每天生成报表的调度配置。
6. 说明错过执行时是否补跑。
7. 说明是否允许任务重叠。
8. 说明任务超时如何处理。

## 验收标准

- 能说明 schedule 和 APScheduler 的适用边界。
- 能解释 misfire、coalesce、max_instances。
- 能区分 Python 内部调度和系统调度器。
- 能为周期任务写出调度策略。
