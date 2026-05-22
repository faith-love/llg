# 子集八：性能、监控、灰度与 Babel 链路

这一节补齐上线后能力：性能指标、错误监控、runtime config、Feature Flag 灰度和 Babel 编译链路。

## runtime config

`apps/admin/public/runtime-config.js`：

```javascript
window.__ACME_CONFIG__ = {
  env: 'local',
  release: 'dev',
  apiBaseURL: 'http://localhost',
  flags: {
    newUserTable: {
      defaultValue: false,
      rollout: 50
    }
  }
}
```

`apps/admin/src/app/runtimeConfig.ts`：

```typescript
type RuntimeConfig = {
  env: 'local' | 'test' | 'staging' | 'production'
  release: string
  apiBaseURL: string
  flags: Record<string, { defaultValue: boolean; rollout?: number }>
}

declare global {
  interface Window {
    __ACME_CONFIG__?: RuntimeConfig
  }
}

export function getRuntimeConfig(): RuntimeConfig {
  const config = window.__ACME_CONFIG__

  if (!config) {
    throw new Error('runtime config missing')
  }

  return config
}
```

## 错误监控最小实现

`packages/shared/src/monitoring.ts`：

```typescript
type ErrorEventPayload = {
  release: string
  message: string
  stack?: string
  route: string
}

export function reportError(payload: ErrorEventPayload) {
  console.error('[monitor:error]', payload)
}

export function setupGlobalErrorMonitoring(getRelease: () => string) {
  window.addEventListener('error', (event) => {
    reportError({
      release: getRelease(),
      message: event.message,
      stack: event.error?.stack,
      route: window.location.pathname
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportError({
      release: getRelease(),
      message: String(event.reason),
      stack: event.reason?.stack,
      route: window.location.pathname
    })
  })
}
```

应用接入：

```typescript
import { setupGlobalErrorMonitoring } from '@acme/shared/monitoring'
import { getRuntimeConfig } from './runtimeConfig'

setupGlobalErrorMonitoring(() => getRuntimeConfig().release)
```

## Web Vitals 最小实现

`packages/shared/src/webVitals.ts`：

```typescript
type Metric = {
  name: 'LCP' | 'INP' | 'CLS'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export function reportMetric(metric: Metric) {
  console.log('[monitor:metric]', metric)
}
```

真实项目可以接入 `web-vitals` 包。练习阶段先定义统一上报入口，避免业务里到处散落 `console.log` 或第三方 SDK 调用。

## Feature Flag 灰度接入

```typescript
import { createFeatureFlags } from '@acme/feature-flags'
import { getRuntimeConfig } from './runtimeConfig'

const config = getRuntimeConfig()

export const flags = createFeatureFlags(config.flags)

export function canUseNewUserTable(userId: string) {
  return flags.isEnabled('newUserTable', { userId })
}
```

页面里：

```typescript
import { canUseNewUserTable } from '../../app/flags'

export function UsersPage() {
  const useNewTable = canUseNewUserTable('admin-1')

  return (
    <section>
      <h2>Users</h2>
      {useNewTable ? <p>New table enabled</p> : <p>Legacy table enabled</p>}
    </section>
  )
}
```

## Babel 插件练习

目标：实现一个非常小的 Babel 插件，移除生产代码里的 `debug()` 调用。

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
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0')
  }
}))
```

测试代码：

```typescript
function debug(message: string) {
  console.log('[debug]', message)
}

debug('users page render')
```

验收：

- dev 模式保留 debug。
- production build 后产物里没有 `users page render`。
- 你能解释这是 Babel transform，不是 bundler 分包。

## Source map 策略

`apps/admin/vite.config.ts`：

```typescript
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

练习要求：

- 构建产物生成 source map。
- release id 写入 runtime config。
- 错误上报包含 release。
- 说明 source map 不应该直接公开给所有用户访问。

## 包体预算

可以先写一个简单脚本：

`tooling/scripts/check-bundle-size.ts`：

```typescript
import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('apps/admin/dist/assets')
const budget = 300 * 1024

for (const name of fs.readdirSync(file)) {
  if (!name.endsWith('.js')) continue

  const full = path.join(file, name)
  const size = fs.statSync(full).size

  if (size > budget) {
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

## 验收标准

- runtime config 能读取并校验。
- 错误上报包含 release、route、message。
- Feature Flag 能按用户稳定分流。
- production build 能移除 `debug()`。
- source map 能生成，并能说明上传和访问策略。
- 包体预算脚本能在超限时失败。

