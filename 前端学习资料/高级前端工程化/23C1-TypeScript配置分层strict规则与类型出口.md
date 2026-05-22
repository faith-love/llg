# TypeScript 配置分层、strict 规则与类型出口

这一页拆 TypeScript 工程治理。重点不是会写 `tsconfig`，而是知道哪些规则应该全局统一，哪些规则应该按应用和库分别继承。

## 步骤一：抽出 base 配置

`packages/config-ts/base.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

字段说明：

- `moduleResolution: Bundler` 更贴近 Vite、Rollup、Webpack 的解析方式。
- `strict` 打开严格模式，是类型质量的底线。
- `noUncheckedIndexedAccess` 让 `arr[0]` 类型包含 `undefined`，减少越界假设。
- `exactOptionalPropertyTypes` 区分“没有这个字段”和“字段值是 undefined”。
- `isolatedModules` 保证每个文件能被单文件转译工具处理。

## 步骤二：应用配置

`packages/config-ts/react-app.json`：

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": false
  }
}
```

应用只做类型检查，不产出声明文件，所以用 `noEmit: true`。

`apps/admin/tsconfig.json`：

```json
{
  "extends": "@acme/config-ts/react-app",
  "include": ["src", "vite.config.ts"]
}
```

## 步骤三：库配置

`packages/config-ts/library.json`：

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "outDir": "dist"
  }
}
```

库包需要输出 `.d.ts`，因为其他包依赖它的类型。应用包不应该输出 `.d.ts`，因为应用不是被复用的库。

`packages/shared/tsconfig.json`：

```json
{
  "extends": "@acme/config-ts/library",
  "include": ["src"]
}
```

## 步骤四：用类型出口保护 public API

`packages/api-client/src/index.ts`：

```typescript
export { createClient } from './createClient'
export { ApiError } from './errors'
export type { ApiResponse, RequestConfig, Adapter } from './types'
```

解释：

- `createClient` 和 `ApiError` 是运行时值，用普通 `export`。
- `ApiResponse`、`RequestConfig`、`Adapter` 是类型，用 `export type`。
- 不导出内部 helper，避免消费者依赖内部实现。

## 步骤五：检查类型出口是否稳定

构建声明文件：

```bash
pnpm --filter @acme/api-client build
```

检查：

```text
packages/api-client/dist/index.d.ts
```

你要关注三件事：

1. 是否出现了不该暴露的内部类型。
2. public function 的参数和返回值是否清晰。
3. 是否有 `any` 逃逸到声明文件。

## 常见问题

| 问题 | 原因 | 修正 |
| --- | --- | --- |
| `Cannot find module @acme/config-ts/react-app` | 配置包 exports 不完整 | 检查 `packages/config-ts/package.json` |
| app build 时输出 `.d.ts` | app 继承了 library 配置 | app 改继承 react-app |
| dist 类型里出现内部路径 | public API 直接暴露内部类型 | 把类型移动到稳定出口 |

## 练习

1. 给 `@acme/shared` 加一个 `formatCurrency(value: number, currency: string)`。
2. 导出它的类型签名。
3. 构建后查看 `dist/index.d.ts`。
4. 故意返回 `any`，观察 TypeScript 或 ESLint 是否能发现。

## 验收

- app 和 library 使用不同 tsconfig。
- 能解释 strict 下几个关键规则的价值。
- 能检查 `.d.ts` 是否暴露了稳定 public API。
- 能避免把内部 helper 类型泄露给消费者。
