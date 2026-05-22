# 库构建产物、声明文件、affected build 与产物检查

这一页拆构建产物。应用构建产出页面资源，库构建产出 JS 和 `.d.ts`。二者目标不同，检查方式也不同。

## 步骤一：库包构建配置

`packages/api-client/vite.config.ts`：

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    }
  }
})
```

说明：

- `entry` 是库入口。
- `formats: ['es']` 产出 ESM。
- `fileName: 'index'` 让产物稳定为 `dist/index.js`。

## 步骤二：声明文件产出

`packages/api-client/package.json`：

```json
{
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

为什么需要两步：

- Vite/Rollup 负责 JS 打包。
- TypeScript 负责 `.d.ts` 声明文件。
- 很多构建器不会自动生成高质量类型声明。

## 步骤三：应用构建配置

`apps/admin/vite.config.ts`：

```typescript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

应用构建产物包含：

```text
apps/admin/dist/index.html
apps/admin/dist/assets/*.js
apps/admin/dist/assets/*.css
```

应用不需要导出 `.d.ts`，因为应用不是被其他 package import 的库。

## 步骤四：产物检查脚本

`tooling/scripts/check-build-artifacts.ts`：

```typescript
import fs from 'node:fs'

const requiredFiles = [
  'packages/api-client/dist/index.js',
  'packages/api-client/dist/index.d.ts',
  'packages/ui/dist/index.js',
  'packages/ui/dist/index.d.ts',
  'apps/admin/dist/index.html',
  'apps/portal/dist/index.html'
]

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing build artifact: ${file}`)
  }
}
```

根脚本：

```json
{
  "scripts": {
    "check:artifacts": "tsx tooling/scripts/check-build-artifacts.ts"
  }
}
```

代码说明：

- 构建成功不代表产物符合预期。
- 产物检查能发现 package exports 指向的文件没有生成。
- CI 中可以在 `pnpm build` 后追加 `pnpm check:artifacts`。

## 步骤五：affected build

根脚本：

```json
{
  "scripts": {
    "affected:build": "turbo build --filter=...[HEAD^1]"
  }
}
```

含义：

- `HEAD^1` 是上一次提交。
- `...[HEAD^1]` 表示从这次变更出发，包含受影响的依赖链。
- 改 `@acme/ui` 时，依赖它的 `admin` 和 `portal` 也应该被构建。

练习流程：

```bash
git add .
git commit -m "chore: baseline"

# 修改 packages/ui
pnpm affected:build
```

## 练习

1. 给 `api-client` 和 `ui` 都配置 library build。
2. 构建后检查 `dist/index.js` 和 `dist/index.d.ts`。
3. 写 `check-build-artifacts.ts`。
4. 修改 `packages/ui`，运行 `affected:build`。

## 验收

- 库包产出 JS 和 `.d.ts`。
- 应用产出 `index.html` 和 assets。
- package exports 指向真实存在的 dist 文件。
- affected build 能覆盖依赖当前变更的应用。
