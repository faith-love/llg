# runtime config、错误监控、Web Vitals 与 release

这一页拆上线后配置和可观测性。构建产物一旦生成，不应该为了换 API 地址或 release id 就重新打包；运行时配置和监控就是为了解决这个问题。

## 步骤一：runtime config

`apps/admin/public/runtime-config.js`：

```javascript
window.__ACME_CONFIG__ = {
  env: 'local',
  release: 'dev',
  apiBaseURL: 'http://localhost:3000',
  flags: {
    newUserTable: {
      defaultValue: false,
      rollout: 50
    }
  }
}
```

这个文件放在 `public` 下，会原样复制到构建产物里。部署时可以由平台替换它，而不用重新构建 JS bundle。

## 步骤二：读取并校验配置

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

  if (!config.release || !config.apiBaseURL) {
    throw new Error('runtime config invalid')
  }

  return config
}
```

代码说明：

- `declare global` 给 window 扩展类型。
- 启动时尽早失败，避免页面运行一半才发现配置缺失。
- 真实项目可以用 zod 做更完整的运行时校验。

## 步骤三：错误监控

`packages/shared/src/monitoring.ts`：

```typescript
export type ErrorEventPayload = {
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

说明：

- `error` 捕获同步运行时错误。
- `unhandledrejection` 捕获未处理 Promise 异常。
- payload 必须包含 `release` 和 `route`，否则线上定位困难。

## 步骤四：Web Vitals 上报入口

`packages/shared/src/webVitals.ts`：

```typescript
export type WebVitalName = 'LCP' | 'INP' | 'CLS'

export type WebVitalMetric = {
  name: WebVitalName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  route: string
  release: string
}

export function reportWebVital(metric: WebVitalMetric) {
  console.log('[monitor:vital]', metric)
}
```

先定义统一入口，后续接 `web-vitals` 包时只替换采集层，不改页面代码。

## 步骤五：应用启动时接入

`apps/admin/src/main.tsx`：

```typescript
import { setupGlobalErrorMonitoring } from '@acme/shared/monitoring'
import { getRuntimeConfig } from './app/runtimeConfig'
import { App } from './app/App'

const config = getRuntimeConfig()

setupGlobalErrorMonitoring(() => config.release)

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
```

接入点要足够早，否则启动阶段错误可能漏报。

## 练习

1. 给 admin 增加 `runtime-config.js`。
2. 写 `getRuntimeConfig`，缺失配置时抛错。
3. 接入全局错误监听。
4. 手动 `Promise.reject(new Error('test'))`，观察错误上报 payload。

## 验收

- runtime config 不需要重新构建即可替换。
- 错误上报包含 release、route、message。
- Web Vitals 有统一上报入口。
- 应用启动时先读取配置，再初始化服务。
