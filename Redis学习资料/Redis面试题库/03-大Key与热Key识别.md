# Key 设计、过期与内存

## 高频问题

### Redis Key 怎么设计？

答题框架：

1. Key 要能体现业务域、对象类型、对象 ID 和场景。
2. 命名要稳定，便于排查、扫描、迁移和清理。
3. 缓存类 Key 必须有 TTL 或清理策略。
4. 要提前评估 Key 数量、单 Key 大小和热点风险。

示例：

```text
mall:product:{id}:detail
mall:用户:{id}:profile
mall:rank:product:daily:{date}
```

### 什么是大 Key 和热 Key？

大 Key 是单个 Key 占用内存大或成员多，风险是读取、删除、迁移、复制慢。热 Key 是访问频率极高的 Key，风险是单实例或单分片压力过高。

治理：

- 大 Key 拆分、限制成员数、归档、`UNLINK` 删除。
- 热 Key 使用本地缓存、多副本读、逻辑过期、限流、拆 Key。

### Redis 过期策略是什么？

Redis 使用惰性删除和定期删除结合。Key 到期不一定立刻释放内存。`maxmemory` 淘汰是另一套机制，和 TTL 过期不是一回事。

## 常见追问

- `TTL` 返回 `-1` 和 `-2` 分别表示什么？
- `DEL` 和 `UNLINK` 区别是什么？
- `allkeys-lru` 和 `volatile-lru` 怎么选？
- 如何估算 Redis 内存？

## 项目表达

```text
我们商品缓存 Key 按 mall:product:{id}:detail 设计，TTL 是 30 分钟并加随机抖动。大对象按基础信息、价格、库存展示拆分，避免单个 Key 过大。
```

## 练习

为一个商品详情页设计 Key 表，包含 TTL、最大规模、大 Key 风险和热 Key 风险。


