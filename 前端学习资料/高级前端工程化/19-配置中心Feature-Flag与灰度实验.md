# 配置中心 Feature Flag 与灰度实验

Feature Flag 的核心价值是把代码发布和功能开放解耦。代码可以先上线，功能可以按用户、租户、地区、版本、百分比逐步放开，也可以在出现问题时快速关闭。高级工程化要把开关、配置、灰度和实验治理成可靠系统。

## 为什么需要 Feature Flag

它解决这些问题：

- 大功能分多次合并，不必长期保留大分支。
- 功能可以只对内部用户开放。
- 可以按小流量灰度。
- 线上异常时可以快速关闭。
- A/B 实验可以基于同一份代码运行。

## Flag 类型

| 类型 | 用途 | 生命周期 |
| --- | --- | --- |
| Release Flag | 控制新功能发布 | 短期 |
| Ops Flag | 故障降级、限流、关闭能力 | 长期 |
| Experiment Flag | A/B 实验 | 实验结束后清理 |
| Permission Flag | 权限或套餐能力 | 长期 |
| Kill Switch | 紧急开关 | 长期 |

短期 flag 必须有清理计划，否则代码里会堆满分支。

## 配置来源

前端可以从这些地方拿配置：

- runtime config 文件。
- 配置中心接口。
- 登录态返回的用户配置。
- CDN 下发 JSON。
- 边缘逻辑注入。

关键要求：

- 启动时有默认值。
- 拉取失败有降级。
- 配置值有类型校验。
- 配置变更能追溯。
- 高风险开关有审批。

## Flag 评估

一个 flag 通常根据上下文评估：

```typescript
type FlagContext = {
  userId: string
  tenantId: string
  region: string
  appVersion: string
}
```

评估结果要稳定。例如按用户百分比灰度时，同一个用户不能每次刷新都随机进不同组。

## 灰度发布

灰度常见维度：

- 内部员工。
- 白名单用户。
- 租户。
- 地区。
- 浏览器或设备。
- 百分比。
- 版本。

灰度流程：

```text
0% -> 内部白名单 -> 1% -> 5% -> 20% -> 50% -> 100%
```

每一步都要观察错误率、性能、核心转化和用户反馈。

## A/B 实验

实验要注意：

- 分组稳定。
- 样本量足够。
- 指标定义清晰。
- 不同时运行互相干扰的实验。
- 结果要有统计意义。
- 实验结束后清理代码。

实验不是“上线两个版本看感觉”，而是受控的数据决策。

## 代码治理

Flag 分支要可读：

```typescript
if (flags.newCheckout) {
  return <NewCheckout />
}

return <LegacyCheckout />
```

不要让一个组件里散落几十个 flag 判断。复杂实验可以抽成策略或独立模块。

## 落地清单

- Flag 是否有类型、默认值和说明？
- 短期 flag 是否有 owner 和过期时间？
- 配置拉取失败是否有降级？
- 灰度是否能按用户、租户、地区和百分比控制？
- 关键 flag 变更是否有审计记录？
- 实验结束后是否清理无用分支？
- 监控是否能按 flag 分组查看错误和性能？

## 深入展开：Flag 要治理生命周期

Feature Flag 最大风险是长期不清理，代码里堆满分支。每个 flag 创建时就应该带元数据：

```typescript
type FlagMeta = {
  name: string
  type: 'release' | 'ops' | 'experiment' | 'permission'
  owner: string
  defaultValue: boolean
  expiresAt?: string
  description: string
}
```

治理规则：

| 规则 | 说明 |
| --- | --- |
| release flag 必须有过期时间 | 功能全量后删除旧分支 |
| ops flag 必须有演练 | 确认关闭后系统能降级 |
| experiment flag 必须记录实验口径 | 避免结果无法解释 |
| permission flag 必须和权限系统一致 | 避免前端开关绕过后端授权 |

监控要能按 flag 分组，否则灰度问题会被全量平均值掩盖。
