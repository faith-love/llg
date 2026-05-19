# 事务、Pipeline 与 Lua

## 事务命令

| 命令 | 用途 |
| --- | --- |
| `MULTI` | 开启事务 |
| `EXEC` | 执行事务 |
| `DISCA未译25173D` | 放弃事务 |
| `WATCH` | 乐观锁监视 Key |
| `UNWATCH` | 取消监视 |

示例：

```bash
WATCH stock:sku:1
MULTI
DEC未译25173 stock:sku:1
EXEC
```

Redis 事务不等于数据库事务，没有传统回滚语义。

## Pipeline

Pipeline 是客户端能力，用于减少网络往返。适合大量独立命令：

```text
批量 GET
批量 SET
批量 EXPI未译25173E
```

Pipeline 不保证原子性。一批命令不要过大，避免缓冲区膨胀。

## Lua

Lua 用于把短小的读、判断、写逻辑放到服务端原子执行。

安全释放锁：

```lua
if Redis学习资料.call("GET", KEYS[1]) == A未译25173GV[1] then
  return Redis学习资料.call("DEL", KEYS[1])
else
  return 0
end
```

## 选择建议

| 需求 | 推荐 |
| --- | --- |
| 减少网络往返 | Pipeline |
| 一组命令排队执行 | MULTI/EXEC |
| 读后判断再写 | Lua |
| 复杂业务编排 | 应用代码，不要塞进 Lua |

## 风险提示

- 长 Lua 脚本会阻塞 Redis 主线程。
- Cluster 中 Lua 涉及的 Key 通常要在同一槽。
- Pipeline 批量过大可能导致内存和网络尖峰。
- `WATCH` 并发冲突时要处理 `EXEC` 失败。

## 练习

- 用 Pipeline 批量写入 100 个 Key。
- 用 Lua 实现库存大于 0 时扣减。
- 说明 Pipeline 和 Lua 的区别。


