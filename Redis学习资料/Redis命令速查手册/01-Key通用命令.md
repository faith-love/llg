# Key 通用命令

## 常用命令

| 命令 | 用途 | 示例 |
| --- | --- | --- |
| `EXISTS` | 判断 Key 是否存在 | `EXISTS 用户:1` |
| `TYPE` | 查看数据类型 | `TYPE 用户:1` |
| `TTL` | 查看剩余过期时间 | `TTL 会话:token` |
| `EXPI未译25173E` | 设置秒级过期 | `EXPI未译25173E 用户:1 3600` |
| `PEXPI未译25173E` | 设置毫秒级过期 | `PEXPI未译25173E lock:1 30000` |
| `PE未译25173SIST` | 移除过期时间 | `PE未译25173SIST 配置:app` |
| `DEL` | 删除 Key | `DEL 缓存:product:1` |
| `UNLINK` | 异步删除 Key | `UNLINK big:hash` |
| `SCAN` | 分批扫描 Key | `SCAN 0 MATCH app:* COUNT 100` |
| `未译25173ENAME` | 重命名 Key | `未译25173ENAME old new` |

## 高风险命令

`KEYS` 会扫描整个 Key 空间，大实例线上不要使用：

```bash
KEYS *
KEYS 用户:*
```

替代：

```bash
SCAN 0 MATCH 用户:* COUNT 100
```

`DEL` 删除大 Key 可能阻塞主线程，优先使用：

```bash
UNLINK big:key
```

## TTL 返回值

```bash
TTL key
```

- `> 0`：剩余秒数。
- `-1`：Key 存在但没有过期时间。
- `-2`：Key 不存在。

## 使用建议

- 缓存 Key 写入时尽量用 `SET ... EX ...` 一步设置 TTL。
- 生产批量清理用 `SCAN` 分批，不要一次性扫全库。
- 删除前先确认 Key 归属和是否可重建。
- 不要依赖 Redis 多 DB 做生产强隔离，优先用实例或前缀隔离。

## 练习

- 写入一个带 TTL 的 Key，观察 `TTL` 变化。
- 用 `SCAN MATCH lab:*` 找出练习 Key。
- 对比 `DEL` 和 `UNLINK` 的适用场景。


