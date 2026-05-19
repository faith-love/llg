# ZSet 命令

## 常用命令

| 命令 | 用途 | 示例 |
| --- | --- | --- |
| `ZADD` | 添加成员和分数 | `ZADD rank 100 用户:1` |
| `ZINCRBY` | 增加分数 | `ZINCRBY rank 10 用户:1` |
| `ZSCORE` | 查看分数 | `ZSCORE rank 用户:1` |
| `ZRANK` | 从小到大排名 | `ZRANK rank 用户:1` |
| `ZREVRANK` | 从大到小排名 | `ZREVRANK rank 用户:1` |
| `ZRANGE` | 范围读取 | `ZRANGE rank 0 9 WITHSCORES` |
| `ZREVRANGE` | 逆序范围读取 | `ZREVRANGE rank 0 9 WITHSCORES` |
| `ZRANGEBYSCORE` | 按分数范围读取 | `ZRANGEBYSCORE delay -inf now` |
| `ZREM` | 删除成员 | `ZREM rank 用户:1` |
| `ZCARD` | 成员数量 | `ZCARD rank` |

## 排行榜示例

```bash
ZINCRBY rank:article:daily:20260514 1 article:1001
ZREVRANGE rank:article:daily:20260514 0 9 WITHSCORES
ZREVRANK rank:article:daily:20260514 article:1001
```

## 延迟任务示例

```bash
ZADD delay:order:close 1710000000000 order:1001
ZRANGEBYSCORE delay:order:close -inf 1710000000000 LIMIT 0 10
ZREM delay:order:close order:1001
```

只有 `ZREM` 成功的消费者才处理任务。

## 风险提示

- score 是浮点数，不适合直接保存精确金额。
- 大 ZSet 要按时间或业务维度拆分。
- 历史榜单要设置 TTL 或归档。
- 同分排序默认按成员字典序，不一定符合业务预期。

## 练习

- 用 ZSet 实现文章日榜。
- 查询 Top 10 和某篇文章排名。
- 用 ZSet 实现订单超时关闭任务。

