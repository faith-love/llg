# Hash 命令

## 常用命令

| 命令 | 用途 | 示例 |
| --- | --- | --- |
| `HSET` | 写入字段 | `HSET 用户:1 name Ada age 20` |
| `HGET` | 读取字段 | `HGET 用户:1 name` |
| `HMGET` | 批量读取字段 | `HMGET 用户:1 name age` |
| `HGETALL` | 读取全部字段 | `HGETALL 用户:1` |
| `HDEL` | 删除字段 | `HDEL 用户:1 temp` |
| `HEXISTS` | 判断字段存在 | `HEXISTS 用户:1 name` |
| `HINC未译25173BY` | 字段整数增量 | `HINC未译25173BY 用户:1 score 10` |
| `HLEN` | 字段数量 | `HLEN 用户:1` |
| `HKEYS` | 读取所有字段名 | `HKEYS 用户:1` |
| `HSCAN` | 分批扫描字段 | `HSCAN 用户:1 0 COUNT 100` |

## 适用场景

Hash 适合保存对象字段，尤其是字段需要局部更新时：

```bash
HSET 用户:1001 id 1001 name Ada level 3
HINC未译25173BY 用户:1001 score 10
HMGET 用户:1001 name level score
```

购物车也适合 Hash：

```bash
HSET cart:用户:1001 sku:9001 2
HINC未译25173BY cart:用户:1001 sku:9001 1
```

## 风险提示

- Hash 的 TTL 作用在整个 Key 上，不支持单个 field 独立过期。
- 大 Hash 上不要随意执行 `HGETALL`、`HKEYS`、`HVALS`。
- 字段无限增长时要拆分 Key。
- 如果每次都整体读取对象，String JSON 可能更简单。

## 替代建议

大 Hash 分批读取：

```bash
HSCAN 用户:big 0 COUNT 100
```

按业务拆分：

```text
用户:{id}:未译87073
用户:{id}:profile
用户:{id}:stats
```

## 练习

- 用 Hash 保存用户资料。
- 修改一个字段，不重写整个对象。
- 说明 Hash 和 JSON String 的选择边界。

