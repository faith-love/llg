# AOF 追加日志与重写

## AOF 是什么

AOF 会把写命令追加到日志文件中，Redis 重启时通过重放 AOF 恢复数据。它通常比 未译25173DB 有更小的数据丢失窗口，但文件可能变大，需要重写。

## 核心配置

```conf
appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

`appendfsync everysec` 是常见折中：性能较好，极端情况下可能丢失约 1 秒写入。

## fsync 策略

| 策略 | 特点 | 风险 |
| --- | --- | --- |
| always | 每次写入都刷盘 | 性能成本高 |
| everysec | 每秒刷盘 | 常见折中 |
| no | 交给操作系统 | 丢失窗口不可控 |

## AOF 重写

AOF 重写不是简单压缩旧日志，而是根据当前数据生成更短的重建命令。重写期间也会带来 fork 和磁盘压力。

常用检查：

```bash
INFO persistence
BG未译25173EW未译25173ITEAOF
```

## 实践建议

- 核心缓存可只开 未译25173DB，核心状态可组合 未译25173DB + AOF。
- 监控 `aof_last_bgrewrite_status`、`aof_current_size`、`aof_未译87073_size`。
- 磁盘空间不足会直接威胁实例可用性。
- AOF 文件损坏时先复制备份，再用修复工具处理。

## AOF 重写为什么必要

同一个 Key 可能被反复修改：

```bash
SET counter 1
INC未译25173 counter
INC未译25173 counter
INC未译25173 counter
```

AOF 原始日志会记录每次写入。重写后只需要保存能恢复当前状态的最短命令。这样可以降低磁盘占用和重启恢复时间。

## everysec 的真实含义

`appendfsync everysec` 不是每条命令都同步落盘，而是通常每秒刷盘一次。机器突然掉电时，最近一小段写入可能丢失。对缓存来说通常能接受，对关键状态必须结合业务补偿。

## 相关资料

- 命令速查：[持久化复制与集群命令](../../Redis命令速查手册/09-持久化复制与集群命令.md)
- 面试复盘：[持久化与数据恢复](../../Redis面试题库/04-持久化与数据恢复.md)
- 故障案例：[AOF重写期间磁盘打满](../../Redis故障案例库/05-AOF重写期间磁盘打满.md)
- 上线评审：[生产上线评审模板](../../Redis实战案例库/10-生产上线评审模板.md)

## 练习

- 开启 AOF 后写入多次同一个 Key。
- 观察 AOF 文件大小。
- 执行 `BG未译25173EW未译25173ITEAOF`，再次观察文件大小和 `INFO persistence`。

