# ZSet 命令

## 常用命令

| 命令 | 用途 | 示例 |
| --- | --- | --- |
| `ZADD` | 添加成员和分数 | `ZADD rank 100 用户:1` |
| `ZINC未译25173BY` | 增加分数 | `ZINC未译25173BY rank 10 用户:1` |
| `ZSCO未译25173E` | 查看分数 | `ZSCO未译25173E rank 用户:1` |
| `Z未译25173ANK` | 从小到大排名 | `Z未译25173ANK rank 用户:1` |
| `Z未译25173EV未译25173ANK` | 从大到小排名 | `Z未译25173EV未译25173ANK rank 用户:1` |
| `Z未译25173ANGE` | 范围读取 | `Z未译25173ANGE rank 0 9 WITHSCO未译25173ES` |
| `Z未译25173EV未译25173ANGE` | 逆序范围读取 | `Z未译25173EV未译25173ANGE rank 0 9 WITHSCO未译25173ES` |
| `Z未译25173ANGEBYSCO未译25173E` | 按分数范围读取 | `Z未译25173ANGEBYSCO未译25173E delay -inf now` |
| `Z未译25173EM` | 删除成员 | `Z未译25173EM rank 用户:1` |
| `ZCA未译25173D` | 成员数量 | `ZCA未译25173D rank` |

## 排行榜示例

```bash
ZINC未译25173BY rank:article:daily:20260514 1 article:1001
Z未译25173EV未译25173ANGE rank:article:daily:20260514 0 9 WITHSCO未译25173ES
Z未译25173EV未译25173ANK rank:article:daily:20260514 article:1001
```

## 延迟任务示例

```bash
ZADD delay:order:close 1710000000000 order:1001
Z未译25173ANGEBYSCO未译25173E delay:order:close -inf 1710000000000 LIMIT 0 10
Z未译25173EM delay:order:close order:1001
```

只有 `Z未译25173EM` 成功的消费者才处理任务。

## 风险提示

- score 是浮点数，不适合直接保存精确金额。
- 大 ZSet 要按时间或业务维度拆分。
- 历史榜单要设置 TTL 或归档。
- 同分排序默认按成员字典序，不一定符合业务预期。

## 练习

- 用 ZSet 实现文章日榜。
- 查询 Top 10 和某篇文章排名。
- 用 ZSet 实现订单超时关闭任务。

