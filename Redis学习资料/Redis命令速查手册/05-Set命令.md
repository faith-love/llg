# Set 命令

## 常用命令

| 命令 | 用途 | 示例 |
| --- | --- | --- |
| `SADD` | 添加成员 | `SADD tag:redis 用户:1` |
| `SREM` | 删除成员 | `SREM tag:redis 用户:1` |
| `SISMEMBER` | 判断成员存在 | `SISMEMBER tag:redis 用户:1` |
| `SMEMBERS` | 获取全部成员 | `SMEMBERS tag:redis` |
| `SCARD` | 成员数量 | `SCARD tag:redis` |
| `SINTER` | 交集 | `SINTER a b` |
| `SUNION` | 并集 | `SUNION a b` |
| `SDIFF` | 差集 | `SDIFF a b` |
| `SPOP` | 随机弹出 | `SPOP lottery:用户s` |
| `SSCAN` | 分批扫描 | `SSCAN big:set 0 COUNT 100` |

## 适用场景

- 标签集合。
- 关注关系。
- 活动参与去重。
- 权限集合。
- 抽奖候选池。

示例：

```bash
SADD activity:1001:用户s 用户:1
SADD activity:1001:用户s 用户:1
SCARD activity:1001:用户s
```

重复添加不会重复计数。

## 风险提示

- 大 Set 上不要直接 `SMEMBERS`。
- 交并差在大集合上会消耗 CPU。
- Set 没有顺序，如果需要排名或时间顺序，考虑 ZSet。
- 只需要估算 UV 时，HyperLogLog 更省内存。

## 替代建议

大集合遍历：

```bash
SSCAN activity:big:用户s 0 COUNT 100
```

关系计算如果很重，考虑离线任务或数据库分析。

## 练习

- 用 Set 保存用户标签。
- 计算两个用户共同标签。
- 说明 Set 和 ZSet 的选择区别。

