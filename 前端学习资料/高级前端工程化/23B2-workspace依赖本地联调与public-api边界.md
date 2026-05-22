# workspace 依赖、本地联调与 public API 边界

这一页拆解内部包如何互相引用，以及为什么要通过包入口暴露能力，而不是随意 deep import。

## 步骤一：用 workspace 协议声明内部依赖

`apps/admin/package.json`：

```json
{
  "name": "admin",
  "private": true,
  "type": "module",
  "dependencies": {
    "@acme/shared": "workspace:*",
    "@acme/ui": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "vite": "^5.4.0"
  }
}
```

代码说明：

- `workspace:*` 表示必须使用当前 monorepo 里的本地包。
- 如果本地不存在 `@acme/ui`，安装会失败。
- 它避免误装 npm registry 上同名包。

在练习项目里，内部包一律使用 `workspace:*`，不要写成 `^0.0.0`。

## 步骤二：只从包入口 import

推荐：

```typescript
import { formatDate } from '@acme/shared'
import { Button } from '@acme/ui'
```

不推荐：

```typescript
import { formatDate } from '@acme/shared/src/date'
import { Button } from '@acme/ui/src/button/Button'
```

原因：

- 入口 import 受 `exports` 约束，属于稳定 public API。
- deep import 绕开包边界，会把内部文件结构暴露给消费者。
- 一旦组件库调整目录，deep import 的应用会全部坏掉。

## 步骤三：设计 shared 的入口

`packages/shared/src/date.ts`：

```typescript
export function formatDate(input: Date) {
  return input.toISOString().slice(0, 10)
}
```

`packages/shared/src/result.ts`：

```typescript
export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E }
```

`packages/shared/src/index.ts`：

```typescript
export { formatDate } from './date'
export type { Result } from './result'
```

代码说明：

- 文件可以拆细，但只有 `index.ts` 统一对外暴露。
- `export type` 只导出类型，不会制造运行时代码。
- 后续重构内部文件时，只要 `index.ts` 不变，消费者就稳定。

## 步骤四：设计 package exports

开发阶段可以让 exports 指向源码：

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
}
```

构建阶段再切到 dist：

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

两种模式的区别：

| 模式 | 优点 | 风险 |
| --- | --- | --- |
| 指向 `src` | 本地联调快，不需要先构建库 | 更依赖 Vite/TS 对源码的处理 |
| 指向 `dist` | 更接近发布产物 | 开发时需要先 build 或 watch |

练习早期可以用 `src`，接入完整构建后改成 `dist`。

## 步骤五：验证本地联调

`apps/admin/src/main.ts`：

```typescript
import { formatDate } from '@acme/shared'

console.log(formatDate(new Date('2026-05-22T00:00:00.000Z')))
```

执行：

```bash
pnpm --filter admin typecheck
```

如果 TypeScript 找不到 `@acme/shared`，检查：

- admin 是否声明了 dependency。
- shared 的 package name 是否是 `@acme/shared`。
- shared 的 exports 是否暴露了 `.`。
- `pnpm install` 是否重新执行过。

## 练习

1. 在 `@acme/shared` 中新增 `formatCurrency`。
2. 只从 `src/index.ts` 导出。
3. 在 `apps/admin` 中通过 `@acme/shared` 引入。
4. 尝试 deep import，然后用 ESLint 规则禁止它。

## 验收

- 内部依赖全部使用 `workspace:*`。
- 应用只从包入口 import。
- 能说清源码入口和 dist 入口的差异。
- 能解释 public API 为什么比文件路径更稳定。
