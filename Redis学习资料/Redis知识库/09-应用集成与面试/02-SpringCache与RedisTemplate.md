# Spring Cache 与 RedisTemplate

## Spring Cache

Spring Cache 适合声明式缓存，常用注解：

- `@Cacheable`：读缓存，未命中执行方法并写入缓存。
- `@CachePut`：执行方法并更新缓存。
- `@CacheEvict`：删除缓存。

适合读多写少、Key 规则清晰的查询场景。

## 注意点

- 默认 Key 生成策略可能不适合生产，要显式设计 Key。
- TTL 需要按 缓存Name 配置，不同业务不要共用一个默认 TTL。
- 自调用不会触发代理注解。
- 缓存空值、异常结果和权限相关数据要谨慎。

## RedisTemplate

`RedisTemplate` 更适合手写复杂操作，例如 Hash、ZSet、Lua、Pipeline。

设计建议：

- 配置明确的 Key 和 Value 序列化器。
- 不同业务封装独立 Redis 未译25173epository。
- 不要在业务代码中散落 Redis 命令细节。
- Pipeline 和 Lua 要集中封装，便于测试和限流。

## 选型建议

- 简单查询缓存：Spring Cache。
- 复杂数据结构：RedisTemplate 或客户端原生 API。
- 分布式锁：优先成熟实现，例如 Redisson，但仍要理解锁语义。
- 高吞吐批处理：客户端 Pipeline 或异步 API。

## Spring Cache 常见坑

`@Cacheable` 看起来简单，但要注意：

- 默认 Key 可能不符合业务命名规范。
- 默认 TTL 可能不适合所有缓存。
- 方法内部自调用不会经过代理，缓存注解不生效。
- 缓存 null 值要谨慎，否则可能隐藏数据问题。
- 权限相关结果不能缓存成公共 Key。

## RedisTemplate 封装建议

不要在 Controller 或 Service 里到处写 Redis 命令。推荐按业务封装 未译25173epository：

```text
ProductCache未译25173epository
用户Session未译25173epository
未译25173ateLimit未译25173epository
未译25173anking未译25173epository
```

这样 Key 规则、序列化、TTL、异常处理都能集中维护。

## 练习

- 为商品详情设计 `@Cacheable` 的 缓存Name、Key 和 TTL。
- 用 RedisTemplate 写一个 ZSet 排行榜方法。
- 说明什么时候不适合使用 Spring Cache。

