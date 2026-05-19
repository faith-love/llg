# Cluster 跨槽命令失败

## 现象

应用在 Redis Cluster 环境报错：`CROSSSLOT Keys in request don't hash to the same slot`。本地单机环境正常，生产集群失败。

## 影响

- 批量操作失败。
- Lua 脚本执行失败。
- 事务或多 Key 命令不可用。
- 部分接口只在生产报错。

## 排查路径

1. 找到报错命令。
2. 列出命令涉及的所有 Key。
3. 使用 `CLUSTER KEYSLOT key` 查看槽位。
4. 检查是否使用 hash tag。
5. 检查客户端是否支持 Cluster。

## 常见根因

- `MGET key1 key2` 两个 Key 不在同槽。
- Lua 脚本传入多个不同槽 Key。
- 事务中操作多个跨槽 Key。
- 本地单机测试没有暴露 Cluster 限制。

## 止血动作

- 拆成单 Key 操作。
- 调整 Key 使用 hash tag。
- 临时回滚相关功能。
- 对批量操作按槽分组。

## 长期修复

- Key 设计阶段考虑 Cluster。
- 需要多 Key 原子操作的对象使用同一 hash tag。
- 避免把大量无关 Key 放同一 tag。
- 测试环境增加 Cluster 模式验证。

## 复盘问题

- 为什么单机测试没有覆盖生产模式？
- hash tag 是否会造成热点？
- 这组 Key 是否真的需要原子操作？
- 客户端是否正确处理 `MOVED` 和 `ASK`？


