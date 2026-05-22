# 灰度、Babel 插件、source map、包体预算与上线检查

这一页拆最后一段上线工程能力：灰度控制、生产编译改写、source map 策略、包体预算和发布前检查。

## 步骤一：生产环境移除 debug

`tooling/babel/remove-debug.js`：

```javascript
export default function removeDebugPlugin() {
  return {
    name: 'remove-debug-plugin',
    visitor: {
      CallExpression(path) {
        const callee = path.node.callee

        if (callee.type === 'Identifier' && callee.name === 'debug') {
          path.remove()
        }
      }
    }
  }
}
```

代码说明：

- Babel 插件访问 AST。
- `CallExpression` 表示函数调用。
- `debug('x')` 的 callee 是 Identifier，name 是 `debug`。
- `path.remove()` 删除整个调用语句。

## 步骤二：Vite React 插件接入 Babel

`apps/admin/vite.config.ts`：

```typescript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import removeDebugPlugin from '../../tooling/babel/remove-debug.js'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: mode === 'production' ? [removeDebugPlugin] : []
      }
    })
  ]
}))
```

解释：

- Vite 负责 dev server、依赖预构建、生产打包入口。
- React 插件内部可以调用 Babel 处理 JSX/React 相关转换。
- 这个插件只在 production 开启，避免开发时 debug 消失。

## 步骤三：验证编译结果

业务代码：

```typescript
function debug(message: string) {
  console.log('[debug]', message)
}

debug('users page render')
```

验证命令：

```bash
pnpm --filter admin build
grep -R "users page render" apps/admin/dist
```

预期：

```text
没有匹配结果
```

如果还能搜到字符串，检查：

- build mode 是否是 production。
- Babel 插件是否被传给 `@vitejs/plugin-react`。
- 调用形式是不是 `debug()`，如果是 `window.debug()` 当前插件不会删除。

## 步骤四：source map 策略

`apps/admin/vite.config.ts`：

```typescript
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

策略说明：

- staging 可以公开 source map，方便调试。
- production 可以生成 source map，但上传到监控平台后从静态资源中删除。
- 错误上报必须带 release，否则 source map 无法和产物版本对应。

## 步骤五：包体预算

`tooling/scripts/check-bundle-size.ts`：

```typescript
import fs from 'node:fs'
import path from 'node:path'

const assetsDir = path.resolve('apps/admin/dist/assets')
const maxJsSize = 300 * 1024

for (const name of fs.readdirSync(assetsDir)) {
  if (!name.endsWith('.js')) continue

  const fullPath = path.join(assetsDir, name)
  const size = fs.statSync(fullPath).size

  if (size > maxJsSize) {
    throw new Error(`${name} is too large: ${size} bytes`)
  }
}
```

根脚本：

```json
{
  "scripts": {
    "check:bundle": "tsx tooling/scripts/check-bundle-size.ts"
  }
}
```

包体预算不是为了追求极小，而是为了防止无意识引入大依赖。

## 步骤六：上线检查清单

`docs/release-checklist.md`：

```markdown
# Release Checklist

- pnpm lint passed
- pnpm typecheck passed
- pnpm test passed
- pnpm build passed
- pnpm check:bundle passed
- runtime-config.js release updated
- source maps uploaded
- smoke test passed on staging
- error monitor has release events
- feature flags default values verified
```

## 练习

1. 写 `remove-debug` Babel 插件。
2. 在 production build 中接入。
3. 构建后搜索 debug 字符串。
4. 写包体预算脚本。
5. 写上线检查清单。

## 验收

- production build 能删除 `debug()`。
- 能解释 Babel transform 和 bundler 打包的区别。
- source map 有 release 对应策略。
- 包体超限时 CI 可以失败。
- 发布前检查不是口头确认，而是清单化。
