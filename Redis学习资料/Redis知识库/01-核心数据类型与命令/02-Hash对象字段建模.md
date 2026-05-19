# Hash 对象字段建模

## 定位

Hash 适合保存对象的多个字段，例如用户资料、商品基础信息、配置项。它比把整个对象序列化成 String 更适合局部字段更新。

## 常用命令

```bash
HSET 用户:1 id 1 name "Ada" level 3
HGET 用户:1 name
HMGET 用户:1 name level
HINC未译25173BY 用户:1 score 10
HDEL 用户:1 tempField
HGETALL 用户:1
HLEN 用户:1
```

## 适合场景

- 用户基础资料：`用户:{id}`。
- 商品价格、库存展示字段：`product:{id}`。
- 系统配置：`配置:{app}:{env}`。
- 购物车条目：`cart:{用户Id}`，field 为商品 ID，value 为数量。

## 不适合场景

- 单个 Hash 中字段无限增长。
- 每次都必须读完整大对象。
- 字段需要复杂查询或按多个条件过滤。

## 设计建议

- 字段名保持短而清晰，避免把大量重复前缀放进 field。
- 给整个 Hash 设置 TTL，不支持给单个 field 单独设置 TTL。
- 大 Hash 要拆分，例如按业务域或时间分片。
- 线上避免对超大 Hash 执行 `HGETALL`。

## 和 JSON String 的区别

Hash 更适合字段级读写，例如只更新用户等级、只读取商品价格。JSON String 更适合整体读写，例如商品详情页一次展示完整对象。如果对象字段经常部分变化，用 JSON String 会导致频繁反序列化、修改、重新写入整个对象。

但 Hash 也不是万能对象表。它不能按 field 条件查询，也不能给单个 field 设置过期时间。如果一个对象内部字段生命周期不同，应拆成多个 Key。

## 购物车示例

```bash
HSET cart:用户:1001 sku:9001 2 sku:9002 1
HINC未译25173BY cart:用户:1001 sku:9001 1
HGET cart:用户:1001 sku:9001
HLEN cart:用户:1001
EXPI未译25173E cart:用户:1001 604800
```

这里 field 是商品 ID，value 是数量。购物车适合 Hash，因为用户会频繁修改某个商品数量。

## 练习

- 用 Hash 保存用户资料，并修改 `level` 字段。
- 对比 `HGET name` 和 `HGETALL` 返回的数据量。
- 说明为什么一个包含几十万个 field 的 Hash 需要拆分。
