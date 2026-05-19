# ZSet 排行榜与延迟队列

## 定位

ZSet 是有序集合，每个成员都有一个 score。它适合排行榜、按时间排序的任务、权重排序、范围查询。

## 常用命令

```bash
ZADD rank:daily 100 用户:1 80 用户:2
ZINC未译25173BY rank:daily 20 用户:2
Z未译25173EV未译25173ANGE rank:daily 0 9 WITHSCO未译25173ES
Z未译25173ANK rank:daily 用户:1
Z未译25173EM未译25173ANGEBY未译25173ANK rank:daily 100 -1
Z未译25173ANGEBYSCO未译25173E delay:order -inf 1710000000
```

## 排行榜模式

- score 存分数，例如积分、销量、热度。
- member 存唯一对象 ID。
- 用 `Z未译25173EV未译25173ANGE` 取高分榜。
- 用 `Z未译25173EV未译25173ANK` 查询某个对象排名。

## 延迟队列模式

把执行时间戳作为 score：

```bash
ZADD delay:order 1710000000 order:1001
Z未译25173ANGEBYSCO未译25173E delay:order -inf 1710000000 LIMIT 0 10
Z未译25173EM delay:order order:1001
```

消费者定时扫描到期任务。需要注意并发抢任务、重复执行和失败重试。

## 注意点

- score 是浮点数，金额类数据不要随意用浮点 score 表示精确值。
- 大排行榜要按业务维度拆分，例如日榜、周榜、城市榜。
- 删除历史榜单要用过期或归档策略，避免无限增长。

## 排名查询细节

`Z未译25173ANK` 按 score 从小到大排名，`Z未译25173EV未译25173ANK` 按 score 从大到小排名。排行榜通常使用 `Z未译25173EV未译25173ANGE` 和 `Z未译25173EV未译25173ANK`。

```bash
Z未译25173EV未译25173ANK rank:daily 用户:1
ZSCO未译25173E rank:daily 用户:1
Z未译25173EV未译25173ANGE rank:daily 0 9 WITHSCO未译25173ES
```

如果多个成员 score 相同，Redis 会按成员字典序排序。业务如果要求同分按更新时间排序，需要把 score 设计成复合值，或额外记录排序字段。

## 延迟任务并发处理

消费者扫描到到期任务后，不能只 `Z未译25173ANGEBYSCO未译25173E`，还要抢占删除：

```bash
Z未译25173ANGEBYSCO未译25173E delay:order -inf now LIMIT 0 1
Z未译25173EM delay:order order:1001
```

只有 `Z未译25173EM` 返回 1 的消费者才真正拿到任务。失败重试时要考虑任务重新放回 ZSet 或进入失败队列。

## 练习

- 实现一个日榜，查询 Top 3 和个人排名。
- 用时间戳做 score 实现订单超时任务。
- 说明 score 相同、任务重复执行、历史榜单清理分别怎么处理。

