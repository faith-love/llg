# monorepo 工作区与任务编排

monorepo 是把多个应用和多个包放在一个仓库中管理的工程组织方式。它不是为了“看起来高级”，而是为了解决共享代码、统一规范、批量重构、跨包变更和影响范围分析。

## 什么时候适合 monorepo

适合：

- 多个前端应用共享组件、工具、类型或 SDK。
- 基础包和应用需要同 PR 联动修改。
- 希望统一 ESLint、TypeScript、构建、测试和发布配置。
- 需要按影响范围只构建或测试部分项目。
- 团队能接受仓库治理和任务编排成本。

不适合：

- 只有一个小应用。
- 项目没有共享代码和统一治理需求。
- 团队没有维护工具链的能力。
- 权限隔离强依赖多仓库边界。

## 基本结构

```text
apps/
  web/
  admin/
packages/
  ui/
  shared/
  api-client/
  config-eslint/
  config-ts/
tooling/
  generators/
package.json
pnpm-workspace.yaml
```

`apps` 放最终部署的应用，`packages` 放可复用包，`tooling` 放脚本、生成器和内部工具。

## workspace 解决什么

workspace 主要解决本地包互相引用：

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/shared": "workspace:*"
  }
}
```

这样开发时不需要先发布 npm 包，应用可以直接引用本仓库的内部包。

## 任务图

monorepo 的关键不是目录，而是任务图。

```text
web:build
  depends on ui:build
  depends on shared:build

admin:test
  depends on ui:build
```

任务编排工具会根据依赖关系决定执行顺序，并结合输入输出做缓存。

## 缓存模型

任务缓存通常由这些内容计算：

- 源码文件。
- package.json。
- lockfile。
- tsconfig、vite config、eslint config 等配置。
- 环境变量。
- 命令参数。

如果输入没变，就可以复用上次输出。

```text
输入 hash 一致 -> 命中缓存 -> 跳过真实执行
输入 hash 改变 -> 执行任务 -> 保存输出
```

缓存要配置输出目录，例如：

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    },
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}
```

## affected 思维

affected 是按改动影响范围执行任务：

```text
改了 packages/ui/Button.tsx
  -> 需要测试 packages/ui
  -> 需要构建依赖 ui 的 apps/web 和 apps/admin
  -> 不需要构建不依赖 ui 的 apps/docs
```

这能显著降低大型仓库的 CI 时间。

## 包边界

每个包都应该有清晰职责：

| 包 | 职责 |
| --- | --- |
| `@repo/ui` | 通用组件 |
| `@repo/shared` | 无框架通用工具 |
| `@repo/api-client` | 请求客户端和接口类型 |
| `@repo/config-eslint` | 统一 ESLint 配置 |
| `@repo/config-ts` | 统一 TypeScript 配置 |

不要把 `shared` 做成垃圾桶。共享包越底层，越要避免业务依赖。

## 发布策略

monorepo 有两种常见发布方式：

| 策略 | 适用场景 |
| --- | --- |
| 固定版本 | 所有包共用一个版本，适合强耦合组件体系 |
| 独立版本 | 每个包独立发版，适合复用包差异较大 |

内部应用不一定需要发布 npm 包，但组件库、SDK、配置包通常需要有版本、变更日志和回滚方式。

## 常见问题

- 构建缓存没有声明输出，导致每次都重新跑。
- 环境变量参与构建但没有纳入缓存输入。
- 包之间深层引用源码，破坏发布边界。
- 所有包都依赖根目录配置，单包无法独立验证。
- 任务太细导致编排复杂，任务太粗导致缓存收益差。

## 落地清单

- 根目录是否固定包管理器和 Node 版本？
- 每个 package 是否有明确 name、入口、构建产物和依赖声明？
- 任务是否声明 dependsOn、inputs、outputs？
- CI 是否支持只跑受影响项目？
- 内部包是否禁止跨包深层引用？
- 发布策略是否明确是固定版本还是独立版本？

## 深入展开：monorepo 的核心是任务图和所有权

monorepo 不只是把代码放进一个仓库。真正要治理的是两张图：

| 图 | 说明 |
| --- | --- |
| 包依赖图 | `apps/web` 依赖哪些 packages，哪些包会影响哪些应用 |
| 任务依赖图 | `build`、`test`、`lint`、`typecheck` 之间的执行顺序 |

还要配套所有权：

```text
packages/ui          -> 设计系统团队 owner
packages/api-client  -> 平台或接口团队 owner
apps/admin           -> 管理后台团队 owner
packages/config-*    -> 工程平台 owner
```

没有 owner 的共享包会变成公共垃圾桶。新增共享包时要先回答：谁维护、谁 review、版本怎么发、破坏性变更怎么通知。

CI 也要围绕任务图设计：

```text
改 shared -> 测 shared -> 构建依赖 shared 的 app
改 docs   -> 只构建 docs
改 lockfile -> 全量验证
```

这样 monorepo 才能在规模变大后继续保持反馈速度。

## 对应实战项目

如果你想把本章内容落到代码里，直接做这个练习：

- [monorepo 实战项目：企业级前端工程平台](04A-monorepo实战项目企业级前端工程平台.md)

这个项目会让你实际搭建 `apps/admin`、`apps/portal`、`packages/ui`、`packages/api-client`、`packages/auth`、`packages/feature-flags`、共享配置包、任务缓存、代码生成器和 CI。重点不是页面多复杂，而是把工作区、包边界、任务图、缓存和质量门禁练出来。
