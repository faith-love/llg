# 数据库表拆分方法论

面向后端架构设计、DBA 评审和业务系统落地。目标是把“什么时候拆、怎么拆、拆完怎么查、怎么扩、怎么避坑”讲清楚。

## 文档目录

1. [01_decision_standards.md](./01_decision_standards.md)：什么情况下必须拆、建议拆、不用拆
2. [02_split_types.md](./02_split_types.md)：表拆分类型、适用场景、优缺点和业务匹配
3. [03_design_by_split_type.md](./03_design_by_split_type.md)：每种拆分方式的字段、主键、外键、关联设计
4. [04_best_practices_checklist.md](./04_best_practices_checklist.md)：库表拆分最佳实践和避坑清单
5. [05_case_normal_business.md](./05_case_normal_business.md)：案例 1，普通业务系统该不该拆、怎么拆
6. [06_case_order_ledger_high_concurrency.md](./06_case_order_ledger_high_concurrency.md)：案例 2，订单/流水高并发怎么拆
7. [07_case_wide_table_vertical_split.md](./07_case_wide_table_vertical_split.md)：案例 3，大宽表字段臃肿如何垂直拆分
8. [08_quick_decision_template.md](./08_quick_decision_template.md)：可直接套用的拆分决策模板

## 总原则

拆表不是为了“显得架构高级”，而是为了解决明确问题：单表过大、写入热点、字段过宽、冷热混杂、业务边界混乱、扩容受阻。

先优化，再拆分。常规顺序：

1. 确认 SQL、索引、数据类型、分页方式、缓存是否合理。
2. 确认慢查询是否由表结构或数据规模导致。
3. 确认未来 6 到 12 个月增长是否会穿透单表安全边界。
4. 再决定垂直拆、水平拆、冷热拆、归档拆、拆库或分库分表。

## 一句话判断

- 只是几百万行、查询慢：优先优化 SQL 和索引，不要急着拆。
- 单表过亿、写入持续高并发、历史数据拖慢核心交易：必须进入拆分设计。
- 字段上百、TEXT/JSON/BLOB 混在主查询表里：优先垂直拆。
- 订单、流水、日志、消息这类持续增长表：提前规划水平拆或归档。
