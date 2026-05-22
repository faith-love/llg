# 子集七：测试体系与 CI

这一节把质量门禁接起来：单元测试、组件测试、E2E smoke 和 CI。重点是不同层级测试保护不同风险。

## Vitest 配置包

`packages/config-vitest/package.json`：

```json
{
  "name": "@acme/config-vitest",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./index.ts"
  }
}
```

`packages/config-vitest/index.ts`：

```typescript
import { defineConfig } from 'vitest/config'

export function defineTestConfig() {
  return defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'html']
      }
    }
  })
}
```

包内 `vitest.config.ts`：

```typescript
import { defineTestConfig } from '@acme/config-vitest'

export default defineTestConfig()
```

## shared 单元测试

`packages/shared/src/result.test.ts`：

```typescript
import { formatDate } from './index'

test('formatDate returns yyyy-mm-dd', () => {
  expect(formatDate(new Date('2026-05-22T10:00:00.000Z'))).toBe('2026-05-22')
})
```

## api-client 契约测试

`packages/api-client/src/createClient.test.ts`：

```typescript
import { createClient } from './createClient'
import { createMockAdapter } from './mockAdapter'

test('get returns typed data', async () => {
  const client = createClient({
    baseURL: 'http://localhost',
    adapter: createMockAdapter({
      'GET /users': [{ id: 'u1', name: 'Ada' }]
    })
  })

  const users = await client.get<Array<{ id: string; name: string }>>('/users')

  expect(users[0]?.name).toBe('Ada')
})
```

## UI 组件测试

`packages/ui/src/status-badge/StatusBadge.test.tsx`：

```typescript
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

test('renders active label', () => {
  render(<StatusBadge status="active" />)
  expect(screen.getByText('Active')).toBeTruthy()
})
```

## Playwright E2E smoke

`apps/admin/e2e/users.spec.ts`：

```typescript
import { expect, test } from '@playwright/test'

test('admin users page opens', async ({ page }) => {
  await page.goto('/users')
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  await expect(page.getByText('Ada')).toBeVisible()
})
```

`apps/admin/playwright.config.ts`：

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5174'
  },
  webServer: {
    command: 'pnpm dev',
    port: 5174,
    reuseExistingServer: true
  }
})
```

## GitHub Actions

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

## CI 分层建议

PR 阶段：

```text
install -> lint -> typecheck -> unit/component test -> build
```

main 分支：

```text
install -> full test -> build -> e2e smoke -> upload artifacts
```

发布阶段：

```text
deploy staging -> smoke -> approve -> deploy production -> monitor
```

## 验收标准

- `pnpm test` 能跑所有 package 基础测试。
- `api-client` 有契约测试。
- `ui` 有组件测试。
- `admin` 至少有一个 E2E smoke。
- CI 能在 PR 中阻断 lint、typecheck、test、build 失败。
- 测试失败能定位到具体 package。

