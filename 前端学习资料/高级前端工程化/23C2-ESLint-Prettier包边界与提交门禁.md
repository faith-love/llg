# ESLint、Prettier、包边界与提交门禁

这一页拆代码规范。工程化里的 lint 不只是格式问题，更重要的是自动阻断危险依赖方向和不稳定 import。

## 步骤一：共享 ESLint 配置包

`packages/config-eslint/index.js`：

```javascript
export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*', '../../apps/*'],
              message: 'packages must not import app code'
            },
            {
              group: ['@acme/*/src/*'],
              message: 'import from package public entry instead of src internals'
            }
          ]
        }
      ]
    }
  }
]
```

规则说明：

- 第一条禁止 package 引用 app。
- 第二条禁止从 `@acme/ui/src/button/Button` 这种内部路径引用。
- `message` 要写清楚修复方式，否则团队只知道报错，不知道怎么改。

## 步骤二：根目录接入

`eslint.config.js`：

```javascript
import acme from '@acme/config-eslint'

export default acme
```

根目录只引用共享配置，不复制规则。以后升级 ESLint 规则时，只改 `@acme/config-eslint`。

## 步骤三：Prettier 只管格式

`.prettierrc.json`：

```json
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 100,
  "trailingComma": "none"
}
```

职责划分：

| 工具 | 负责 | 不负责 |
| --- | --- | --- |
| Prettier | 缩进、换行、引号、分号 | import 边界、潜在 bug |
| ESLint | 代码规则、危险模式、依赖边界 | 大部分纯格式 |
| TypeScript | 类型正确性 | 代码风格 |

不要把所有问题都塞给 ESLint。工具职责越清楚，配置冲突越少。

## 步骤四：写包边界检查脚本

ESLint 适合检查 import 文本，脚本适合检查 package.json 依赖声明。

`tooling/scripts/check-package-boundaries.ts`：

```typescript
import fs from 'node:fs'
import path from 'node:path'

type BoundaryRule = {
  packageDir: string
  forbiddenDependencies: string[]
}

const rules: BoundaryRule[] = [
  { packageDir: 'packages/shared', forbiddenDependencies: ['react', 'react-dom'] },
  { packageDir: 'packages/api-client', forbiddenDependencies: ['react', 'react-dom'] },
  { packageDir: 'packages/auth', forbiddenDependencies: ['react', 'react-dom'] }
]

for (const rule of rules) {
  const pkgPath = path.join(rule.packageDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies
  }

  for (const dependency of rule.forbiddenDependencies) {
    if (deps[dependency]) {
      throw new Error(`${rule.packageDir} must not depend on ${dependency}`)
    }
  }
}
```

代码说明：

- import 规则只能发现源码里的引用。
- package 边界脚本能发现 dependency 声明层面的污染。
- `shared`、`api-client`、`auth` 都应该保持无 React。

## 步骤五：提交前门禁

根 `package.json`：

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check:boundaries": "tsx tooling/scripts/check-package-boundaries.ts",
    "precommit": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm check:boundaries"
  }
}
```

练习项目里可以手动跑 `pnpm precommit`。真实项目可以接 husky 或 lefthook。

## 练习

1. 在 `packages/shared` 的 `package.json` 里故意添加 `react`。
2. 运行 `pnpm check:boundaries`，确认脚本失败。
3. 在 app 里写 `import { Button } from '@acme/ui/src/button/Button'`。
4. 运行 `pnpm lint`，确认 ESLint 失败。

## 验收

- 能说清 ESLint、Prettier、TypeScript 的职责边界。
- 能用 lint 禁止 deep import。
- 能用脚本检查 package.json 依赖污染。
- 能把格式检查、lint、typecheck、边界检查组合成门禁命令。
