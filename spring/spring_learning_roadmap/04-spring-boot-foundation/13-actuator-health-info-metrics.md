# 13-Actuator、health、info、metrics

## Actuator 解决什么问题

Actuator 是应用运行时观测入口。

它不是完整监控平台，但它能把最基本的信息暴露出来。

## 最常用端点

- `health`
- `info`
- `metrics`

这三个已经足够支撑你理解“服务是否活着、是否可用、有哪些基本指标”。

## health 不等于一切正常

`health` 至少能帮助你看：

- 应用是否启动。
- 某些依赖是否可用。

但它不能替代：

- 业务正确性验证。
- 完整性能观测。
- 用户侧体验判断。

## metrics 的价值

指标通常帮助你观察：

- 请求量。
- 耗时。
- JVM。
- 连接池。

这会是后续接 Prometheus 或其他监控系统的基础。

## 本节通过标准

- 能打开并访问常见 Actuator 端点。
- 能说明 `health`、`info`、`metrics` 分别看什么。
- 能知道 Actuator 是入口，不是完整监控体系。
