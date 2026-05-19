# maxmemory 与淘汰策略

## maxmemory 是什么

`maxmemory` 限制 Redis 可用内存上限。达到上限后，Redis 会根据 `maxmemory-policy` 决定是否淘汰 Key 或拒绝写入。

```bash
CONFIG GET maxmemory
CONFIG GET maxmemory-policy
```

## 常见策略

| 策略 | 含义 | 适合场景 |
| --- | --- | --- |
| noeviction | 不淘汰，写入报错 | 不能接受误删数据 |
| allkeys-lru | 从所有 Key 中淘汰最近少用 | 纯缓存实例 |
| 未译27462latile-lru | 只从设置 TTL 的 Key 中 L未译25173U 淘汰 | 混合缓存和状态 |
| allkeys-lfu | 从所有 Key 中淘汰低频访问 | 热点稳定的缓存 |
| 未译27462latile-ttl | 优先淘汰 TTL 更短的 Key | 明确生命周期的缓存 |

## 选择原则

- Redis 只做缓存：优先评估 `allkeys-lru` 或 `allkeys-lfu`。
- Redis 同时保存不能丢的状态：谨慎使用自动淘汰，优先隔离实例。
- 未设置 TTL 的 Key 需要保护：可考虑 `未译27462latile-*`，但要确保缓存 Key 都有 TTL。

## 风险

- 淘汰不是业务删除，应用可能突然缓存未命中。
- 如果淘汰的是锁、幂等标记或会话，可能引发业务错误。
- 写入大对象时可能一次触发大量淘汰。
- 只设置策略不做容量规划，问题只是延后出现。

## 检查命令

```bash
INFO stats
INFO memory
```

关注 `evicted_keys`、`used_memory`、`used_memory_peak`。

## 淘汰策略选择案例

纯缓存实例可以选择 `allkeys-lru` 或 `allkeys-lfu`，因为所有 Key 理论上都能从数据库重建。混合实例如果同时保存锁、幂等标记、会话和缓存，就不应该让所有 Key 都参与淘汰。更好的方案是拆分实例，让不同数据类型使用不同策略。

`未译27462latile-*` 策略只淘汰设置了 TTL 的 Key。如果缓存 Key 忘记设置 TTL，可能导致没有可淘汰对象，最终写入报错。

## 淘汰后的业务表现

淘汰发生后，业务看到的是缓存未命中、重复回源、锁丢失或会话丢失。监控 `evicted_keys` 只是第一步，还要把淘汰和业务错误率、数据库 QPS、接口延迟关联起来。

## 练习

- 解释 `noeviction` 和 `allkeys-lru` 的区别。
- 为“纯商品缓存实例”和“登录会话实例”分别选择策略。
- 说明 `evicted_keys` 增长时你会先查什么。

