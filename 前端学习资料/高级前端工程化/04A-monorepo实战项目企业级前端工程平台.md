# monorepo 实战项目：企业级前端工程平台

这个练习项目不是写一个 demo 页面，而是搭建一个接近真实团队使用的前端 monorepo 工程平台。目标是把多个应用、多个共享包、统一规范、任务编排、缓存、测试和 CI/CD 串起来。

## 项目背景

假设你在一个 SaaS 团队，需要维护两个前端应用：

- `admin`：运营后台，给内部员工管理用户、工单、角色和 Feature Flag。
- `portal`：客户门户，给客户查看工单、资料和通知。

两个应用共享：

- UI 组件。
- 请求客户端。
- 权限和登录态逻辑。
- 类型定义。
- ESLint、TypeScript、Vite、Vitest 配置。
- 代码生成器。

你要把这些能力放进一个 monorepo，形成可长期演进的前端工程平台。

## 最终目标

最终仓库应该支持：

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm affected:build
```

并满足：

- 两个应用能独立开发和构建。
- 内部包能被应用通过 workspace 引用。
- 修改 `packages/ui` 时，只重新构建依赖它的应用。
- 共享配置包能被所有应用和包复用。
- CI 能自动执行 lint、typecheck、test、build。
- 组件库、请求库、权限库有清晰 public API。
- 新建页面、组件、package 可以通过 generator 生成。

## 推荐技术栈

| 类别 | 技术 |
| --- | --- |
| 包管理 | pnpm workspace |
| 任务编排 | Turborepo 或 Nx，建议先用 Turborepo |
| 应用框架 | Vite + React + TypeScript |
| 组件文档 | Storybook 或 VitePress，练习可先用 Storybook |
| 测试 | Vitest + Testing Library + Playwright |
| 规范 | ESLint + Prettier + commitlint |
| 构建 | Vite library mode + tsup 或 Rollup |
| CI | GitHub Actions 或 GitLab CI |

## 目录结构

```text
acme-frontend-platform/
  apps/
    admin/
      src/
        pages/
        features/
        app/
      package.json
      vite.config.ts
    portal/
      src/
        pages/
        features/
        app/
      package.json
      vite.config.ts
    docs/
      package.json
  packages/
    ui/
      src/
        button/
        modal/
        data-table/
        form-field/
      package.json
      vite.config.ts
    api-client/
      src/
        createClient.ts
        adapters/
        errors/
      package.json
    auth/
      src/
        session.ts
        permissions.ts
        guards.ts
      package.json
    feature-flags/
      src/
        client.ts
        types.ts
      package.json
    shared/
      src/
        date.ts
        object.ts
        result.ts
      package.json
    config-eslint/
      package.json
      index.js
    config-ts/
      package.json
      base.json
      react-app.json
      library.json
    config-vite/
      package.json
      app.ts
      library.ts
    config-vitest/
      package.json
      index.ts
  tooling/
    generators/
      create-feature.ts
      create-package.ts
      create-component.ts
    scripts/
      check-package-boundaries.ts
  .github/
    workflows/
      ci.yml
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.json
```

## 包职责

| 包 | 职责 | 不应该做什么 |
| --- | --- | --- |
| `apps/admin` | 内部运营后台页面和业务编排 | 不沉淀通用组件 |
| `apps/portal` | 客户门户页面和业务编排 | 不直接复制 admin 的业务逻辑 |
| `@acme/ui` | Button、Modal、DataTable、FormField 等基础组件 | 不依赖具体业务接口 |
| `@acme/api-client` | 请求封装、错误归一化、mock adapter | 不处理 UI loading |
| `@acme/auth` | session、权限判断、路由 guard | 不依赖某个应用页面 |
| `@acme/feature-flags` | flag 类型、默认值、客户端读取 | 不直接决定页面 UI |
| `@acme/shared` | 无框架工具函数 | 不放业务实体 |
| `@acme/config-*` | 统一工程配置 | 不包含业务代码 |
| `tooling/generators` | 生成页面、组件、package | 不绕过目录规范 |

## 根配置

`pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*
```

根 `package.json`：

```json
{
  "name": "acme-frontend-platform",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "turbo dev --parallel",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "build": "turbo build",
    "affected:build": "turbo build --filter=...[HEAD^1]",
    "gen:feature": "tsx tooling/generators/create-feature.ts",
    "gen:component": "tsx tooling/generators/create-component.ts"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

`turbo.json`：

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "build": {
      "dependsOn": ["^build"],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env*",
        "tsconfig*.json",
        "vite.config.ts"
      ],
      "outputs": ["dist/**", ".vitepress/dist/**"]
    }
  }
}
```

## 应用业务要求

### admin

至少实现 4 个页面：

| 页面 | 功能 |
| --- | --- |
| 用户列表 | 表格、搜索、分页、状态筛选 |
| 用户详情 | 基本资料、角色、最近工单 |
| 工单管理 | 工单列表、优先级、状态流转 |
| Feature Flag | flag 列表、开关、灰度百分比 |

### portal

至少实现 3 个页面：

| 页面 | 功能 |
| --- | --- |
| 首页 | 当前用户信息、通知、快捷入口 |
| 我的工单 | 工单列表、状态筛选 |
| 工单详情 | 工单内容、回复列表、提交回复 |

## 共享包要求

### `@acme/ui`

实现这些组件：

- `Button`
- `Modal`
- `DataTable`
- `FormField`
- `EmptyState`
- `StatusBadge`

验收：

- 每个组件有 `index.ts` 导出。
- 每个组件有 props 类型。
- 每个组件至少 1 个测试。
- `DataTable` 被 `admin` 和 `portal` 同时使用。

### `@acme/api-client`

Public API：

```typescript
const client = createClient({
  baseURL: '/api',
  adapter: mockAdapter()
})

const users = await client.get<User[]>('/users')
```

要求：

- 支持 `get`、`post`。
- 支持 mock adapter。
- 统一错误类型 `ApiError`。
- 返回类型支持泛型。
- 不依赖 React。

### `@acme/auth`

要求：

- `getSession()`
- `hasPermission(session, permission)`
- `requirePermission(permission)`
- `Role`、`Permission` 类型。

应用中：

- `admin` 的 Feature Flag 页面需要 `flag:write` 权限。
- `portal` 的用户只能访问自己的工单。

### `@acme/feature-flags`

要求：

- 定义 flag 类型。
- 提供默认值。
- 支持读取 runtime config。
- 支持按用户 id 做稳定百分比分流。

示例：

```typescript
const flags = createFeatureFlags({
  newTicketFlow: {
    defaultValue: false,
    rollout: 20
  }
})
```

## 里程碑一：初始化 workspace

任务：

1. 创建目录结构。
2. 配置 `pnpm-workspace.yaml`。
3. 创建 `apps/admin` 和 `apps/portal`。
4. 创建 `packages/shared`、`packages/ui`。
5. 根目录配置 `turbo.json`。

验收：

```bash
pnpm install
pnpm build
```

必须看到：

- 根目录安装成功。
- 两个 app 至少能构建空页面。
- `@acme/shared` 能被 app 引用。

## 里程碑二：统一配置包

任务：

1. 创建 `@acme/config-ts`。
2. 创建 `@acme/config-eslint`。
3. 创建 `@acme/config-vite`。
4. 所有 app 和 package 继承共享配置。

验收：

```bash
pnpm lint
pnpm typecheck
```

必须满足：

- 不允许新增 `any`。
- 不允许 app 之间互相 import。
- `packages/shared` 不允许依赖 React。
- `packages/ui` 不允许依赖 `apps/*`。

## 里程碑三：共享 UI 和业务接入

任务：

1. 在 `@acme/ui` 实现基础组件。
2. 在 `admin` 用户列表使用 `DataTable`。
3. 在 `portal` 工单列表使用 `DataTable`。
4. 给 `Button` 和 `DataTable` 写测试。

验收：

```bash
pnpm --filter @acme/ui test
pnpm --filter admin build
pnpm --filter portal build
```

必须满足：

- UI 包不引用任何 app 代码。
- `admin` 和 `portal` 都通过 workspace 引用 `@acme/ui`。
- 修改 `@acme/ui` 后两个应用构建都受影响。

## 里程碑四：请求、权限和 Feature Flag

任务：

1. 实现 `@acme/api-client`。
2. 实现 `@acme/auth`。
3. 实现 `@acme/feature-flags`。
4. 两个 app 接入 mock API。

验收：

- `admin` 用户列表通过 api-client 读取 mock users。
- `portal` 工单列表通过 api-client 读取 mock tickets。
- 无权限访问 `admin/feature-flags` 时显示无权限页。
- `newTicketFlow` flag 能控制 portal 工单提交入口。

## 里程碑五：任务编排和缓存

任务：

1. 每个 package 增加 `build`、`lint`、`typecheck`、`test` 脚本。
2. 在 `turbo.json` 配置 `dependsOn` 和 `outputs`。
3. 验证二次构建缓存。
4. 验证修改某个包后的影响范围。

验收：

```bash
pnpm build
pnpm build
```

第二次应该出现 cache hit。

再修改 `packages/shared/src/date.ts`：

```bash
pnpm build
```

应该重新构建：

- `@acme/shared`
- 依赖 shared 的包
- 依赖这些包的 app

## 里程碑六：代码生成器

实现三个 generator：

```bash
pnpm gen:feature admin users
pnpm gen:component StatusBadge
pnpm gen:package analytics
```

生成规则：

| 命令 | 结果 |
| --- | --- |
| `gen:feature admin users` | 在 `apps/admin/src/features/users` 生成 feature 结构 |
| `gen:component StatusBadge` | 在 `packages/ui/src/status-badge` 生成组件、测试、导出 |
| `gen:package analytics` | 在 `packages/analytics` 生成 package 模板 |

验收：

- 生成后自动补 `index.ts` 导出。
- 生成后 `pnpm lint` 通过。
- 生成器有 dry-run 模式。

## 里程碑七：CI

`.github/workflows/ci.yml`：

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

验收：

- PR 自动跑完整验证。
- 任一 package 类型错误会阻断合并。
- 任一应用构建失败会阻断合并。

## 必做任务清单

| 编号 | 任务 | 验收 |
| --- | --- | --- |
| 1 | 初始化 workspace | 根目录 `pnpm install` 成功 |
| 2 | 创建两个 app | `admin`、`portal` 可独立 dev/build |
| 3 | 创建 `@acme/ui` | 两个 app 共用 `DataTable` |
| 4 | 创建 `@acme/api-client` | app 不直接调用 fetch |
| 5 | 创建 `@acme/auth` | 权限页面可控制访问 |
| 6 | 创建 `@acme/feature-flags` | flag 控制一个入口显示 |
| 7 | 创建 config 包 | TS/ESLint/Vite 配置复用 |
| 8 | 配置 turbo | build 有 dependsOn 和 outputs |
| 9 | 配置测试 | 至少 UI、shared、api-client 有测试 |
| 10 | 配置 CI | PR 跑 lint/typecheck/test/build |

## 进阶任务

- 加 `apps/docs`，用 VitePress 写组件和工程文档。
- 加 `@acme/analytics`，统一埋点类型和上报。
- 加 `@acme/runtime-config`，支持一份构建产物多环境部署。
- 加 `@acme/design-tokens`，让 UI 组件使用 token。
- 加 Playwright，覆盖 admin 用户列表和 portal 工单详情。
- 加 changesets，给 `@acme/ui` 和 `@acme/api-client` 生成 changelog。
- 加 package boundary 检查，禁止 `apps/*` 被 packages 引用。
- 加 bundle analyzer，给 `admin` 和 `portal` 设置包体预算。

## 最终评分标准

| 维度 | 及格 | 良好 | 优秀 |
| --- | --- | --- | --- |
| 结构 | 有 apps/packages 分层 | 包职责清晰 | 有边界检查和 owner |
| 依赖 | workspace 能引用 | 无幽灵依赖 | 依赖升级有策略 |
| 构建 | 能全量 build | 有任务缓存 | 能按影响范围执行 |
| 质量 | lint/typecheck 可跑 | test 覆盖核心包 | CI 阻断质量退化 |
| 共享能力 | 有 UI/shared | 有 api/auth/flag | 有 generator 和 docs |
| 工程表达 | 能说清工具配置 | 能画任务图 | 能说明收益和取舍 |

## 项目复盘问题

完成后写一份复盘，回答：

1. 哪些代码应该放在 app，哪些应该放在 package？
2. 哪个包最容易变成垃圾桶，如何治理？
3. 修改 `@acme/ui` 会影响哪些 app？如何证明？
4. 任务缓存的 inputs 和 outputs 配置是否完整？
5. 如果 CI 变慢，先排查依赖安装、typecheck、test 还是 build？
6. 如果 `@acme/api-client` 要发布给其他仓库使用，需要补哪些能力？
7. 如果团队变成 20 人，这个 monorepo 还缺哪些 owner 和 review 规则？
