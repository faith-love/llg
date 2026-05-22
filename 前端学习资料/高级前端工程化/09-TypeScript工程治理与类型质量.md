# TypeScript 工程治理与类型质量

TypeScript 工程治理的目标不是“项目能编译”，而是让类型成为系统边界的一部分。类型要帮助团队表达数据结构、模块契约、接口边界和变更影响，而不是被 `any`、断言和松散配置绕开。

## 类型质量层级

| 层级 | 特征 |
| --- | --- |
| 可运行 | TS 只负责少量标注，很多 `any` |
| 可编译 | 项目能通过 `tsc`，但类型边界弱 |
| 可维护 | strict 打开，核心数据结构有明确类型 |
| 可治理 | 类型债有预算，公共包输出声明文件，CI 阻断类型退化 |

## tsconfig 分层

monorepo 中推荐把配置拆成基础包：

```text
packages/config-ts/
  base.json
  react-app.json
  library.json
```

应用继承配置：

```json
{
  "extends": "@repo/config-ts/react-app.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src"]
}
```

这样可以统一 strict、moduleResolution、jsx、target、paths 等关键配置。

## strict 策略

新项目建议直接打开：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

老项目可以分阶段：

1. 打开 `strict` 但允许部分目录暂时排除。
2. 先修核心领域类型和公共 API。
3. 对新增代码禁止引入新的 `any`。
4. 逐步缩小 `skipLibCheck`、断言和忽略注释范围。

## 类型边界

这些地方必须重视类型：

- API 请求和响应。
- 路由参数。
- 表单数据。
- 权限和角色。
- 组件 props。
- 事件和埋点。
- Feature Flag。
- runtime config。
- 公共包导出 API。

类型边界要接近数据进入系统的位置。例如服务端返回的数据应该先经过解析和校验，再进入业务模型。

## any 治理

`any` 最大的问题是会污染后续类型推导。

治理方式：

- 对新增 `any` 设为 warn 或 error。
- 老代码建立 baseline。
- 用 `unknown` 替代不可信输入。
- 用类型守卫或 schema 校验收窄。
- 对确实无法表达的地方写说明。

```typescript
function parsePayload(input: unknown) {
  if (typeof input !== 'object' || input === null) {
    throw new Error('invalid payload')
  }

  return input
}
```

## 声明文件

库项目要输出 `.d.ts`，否则消费者拿不到可靠类型。

需要关注：

- `declaration` 是否开启。
- `exports` 是否同时指向类型入口。
- 内部类型是否误暴露。
- public API 是否稳定。
- breaking change 是否体现在 changelog。

## 工程引用

大型 TS 项目可以使用 project references 降低类型检查成本。

```json
{
  "references": [
    { "path": "../shared" },
    { "path": "../ui" }
  ]
}
```

它让 TS 知道包之间的依赖关系，并可以增量构建。

## 落地清单

- 是否有统一 tsconfig 配置包？
- 新项目是否默认 strict？
- API、配置、埋点、组件 props 是否有明确类型？
- 公共包是否输出声明文件？
- 是否限制新增 `any`、`as` 和 `ts-ignore`？
- CI 是否独立执行 `typecheck`？
- 类型错误是否能阻断合并？

## 深入展开：类型治理要守住边界

TypeScript 的价值集中在系统边界，而不是给每个局部变量都写显式类型。

必须重点治理的边界：

| 边界 | 推荐做法 |
| --- | --- |
| 接口响应 | 用 schema 或类型守卫校验 unknown 数据 |
| runtime config | 启动时校验配置结构 |
| 组件 props | 对外组件 API 必须稳定、可导出 |
| 埋点事件 | 用联合类型约束事件名和字段 |
| Feature Flag | flag 名称、值类型、默认值要有类型 |
| 公共包导出 | 输出 `.d.ts`，禁止暴露内部类型 |

类型债也要量化：

```text
any 数量
ts-ignore 数量
as unknown as 数量
strict 覆盖目录
声明文件生成失败次数
```

把这些数字放进工程指标，类型质量才不会随着赶需求慢慢退化。
