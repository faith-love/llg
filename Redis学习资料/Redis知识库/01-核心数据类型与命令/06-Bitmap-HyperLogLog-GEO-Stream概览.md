# Bitmap、HyperLogLog、GEO、Stream 概览

## Bitmap

Bitmap 适合按位记录布尔状态，例如用户签到、是否活跃、是否完成任务。

```bash
SETBIT signin:2026-05 用户Offset 1
GETBIT signin:2026-05 用户Offset
BITCOUNT signin:2026-05
```

适合 ID 可映射为偏移量的场景。偏移量过大时会导致内存浪费。

## HyperLogLog

HyperLogLog 适合做大规模 UV 估算，优点是内存很小，缺点是结果有误差。

```bash
PFADD uv:article:1 用户:1 用户:2
PFCOUNT uv:article:1
PFMERGE uv:site uv:article:1 uv:article:2
```

如果业务要求精确去重，不要使用 HyperLogLog。

## GEO

GEO 适合附近门店、附近车辆、地理距离计算。

```bash
GEOADD shop:geo 116.397 39.908 shop:1
GEOSEARCH shop:geo FROMLONLAT 116.40 39.90 BYRADIUS 3 km WITHDIST
```

复杂地理检索仍应评估专门Elasticsearch。

## Stream

Stream 是 Redis 的消息流结构，支持追加消息、消费组、确认和重试。

```bash
XADD stream:order * orderId 1001 status created
XGROUP CREATE stream:order group-a 0 MKSTREAM
XREADGROUP GROUP group-a consumer-1 COUNT 10 STREAMS stream:order >
XACK stream:order group-a message-id
```

它适合轻量消息和事件流，不等于可以替代所有 MQ 场景。

## 选择边界

这些结构都很有用，但适用面比 String、Hash、Set、ZSet 更窄：

- Bitmap 的前提是能把对象映射成合理偏移量。
- HyperLogLog 的前提是业务能接受统计误差。
- GEO 的前提是附近查询足够简单。
- Stream 的前提是消息规模、可靠性要求和运维复杂度可控。

不要因为结构高级就强行使用。先确认业务问题，再选择数据类型。

## 组合示例

一个活动系统可以这样设计：

- Bitmap 记录用户每日是否签到。
- HyperLogLog 估算活动页 UV。
- GEO 查询附近活动门店。
- Stream 记录用户报名事件，异步发放奖励。

每个结构负责一个清晰问题，避免一个 Key 承担过多职责。

## 练习

- 用 Bitmap 记录 7 天签到。
- 用 HyperLogLog 估算 100 个用户访问后的 UV。
- 用 Stream 创建消费组并确认消息。

