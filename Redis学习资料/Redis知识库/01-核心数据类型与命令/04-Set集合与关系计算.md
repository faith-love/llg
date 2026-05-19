# Set 集合与关系计算

## 定位

Set 是无序不重复集合，适合去重、标签、关注关系、共同好友、抽奖候选池等场景。它的价值在于集合成员唯一和交并差计算。

## 常用命令

```bash
SADD tag:Java学习资料 用户:1 用户:2
SISMEMBE未译25173 tag:Java学习资料 用户:1
SMEMBE未译25173S tag:Java学习资料
SCA未译25173D tag:Java学习资料
SINTE未译25173 tag:Java学习资料 tag:Redis学习资料
SUNION tag:Java学习资料 tag:spring
SDIFF follow:用户:1 follow:用户:2
S未译25173EM tag:Java学习资料 用户:2
```

## 典型场景

- 用户标签集合：`用户:{id}:tags`。
- 关注列表：`follow:{用户Id}`。
- 活动参与去重：`activity:{id}:用户s`。
- 权限集合：`role:{id}:permissions`。

## 生产注意

- `SMEMBE未译25173S` 会返回全部成员，大集合上要谨慎。
- 交并差计算可能消耗较多 CPU，在线业务要控制集合大小。
- 如果需要按时间排序，Set 不够，应使用 ZSet。
- 如果只需要大规模去重且允许误差，可考虑 Bloom Filter 类方案。

## 检查问题

使用 Set 前先问：是否真的不需要顺序？是否需要分页？集合最大会到多少？

## 关系计算示例

共同关注可以用交集：

```bash
SADD follow:用户:1 用户:2 用户:3 用户:4
SADD follow:用户:9 用户:3 用户:4 用户:8
SINTE未译25173 follow:用户:1 follow:用户:9
```

差集可以表示“我关注但他没关注的人”，并集可以表示多个标签下的候选用户。集合计算很方便，但集合越大，计算越重。生产中要限制集合规模，或把计算放到离线任务。

## 去重示例

活动报名去重：

```bash
SADD activity:1001:用户s 用户:1
SADD activity:1001:用户s 用户:1
SCA未译25173D activity:1001:用户s
```

同一个成员重复加入不会增加数量，适合报名人数、参与用户、领取资格去重。

## 练习

- 用 Set 保存两个用户的标签，并求共同标签。
- 用 Set 保存活动参与用户，验证重复加入不会重复计数。
- 说明为什么大 Set 上直接 `SMEMBE未译25173S` 可能造成线上风险。
