# E2E smoke、CI 流水线、缓存与质量门禁

这一页拆 CI。CI 不是把本地命令搬到云上就完了，还要考虑触发时机、缓存、失败定位和不同阶段的门禁。

## 步骤一：E2E smoke 测试

`apps/admin/e2e/users.spec.ts`：

```typescript
import { expect, test } from '@playwright/test'

test('admin users page opens', async ({ page }) => {
  await page.goto('/users')

  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  await expect(page.getByText('Ada')).toBeVisible()
})
```

smoke 测试只验证关键路径能打开，不追求覆盖所有边界。它的价值是上线前快速发现“应用起不来、路由坏了、核心页面空白”。

## 步骤二：Playwright 配置

`apps/admin/playwright.config.ts`：

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
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

代码说明：

- `baseURL` 让测试里可以写 `/users`。
- `webServer` 自动启动应用。
- `reuseExistingServer` 方便本地已有 dev server 时复用。

## 步骤三：CI 工作流

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

步骤说明：

- `--frozen-lockfile` 保证 CI 不偷偷改 lockfile。
- lint 和 typecheck 放在 test 前，失败更快。
- build 放在最后，确保前面质量门禁通过。

## 步骤四：添加 E2E job

```yaml
  e2e:
    runs-on: ubuntu-latest
    needs: verify
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
      - run: pnpm --filter admin exec playwright install --with-deps chromium
      - run: pnpm --filter admin e2e
```

为什么 E2E 单独 job：

- E2E 慢且更容易受环境影响。
- 先让基础 verify 通过，再跑更重的浏览器测试。
- 失败时更容易区分是代码质量问题还是端到端问题。

## 步骤五：CI 分层策略

| 阶段 | 命令 | 目标 |
| --- | --- | --- |
| PR | lint、typecheck、test、build | 快速阻断明显问题 |
| main | full test、build、e2e | 保护主干稳定 |
| release | deploy staging、smoke、approve、deploy production | 保护发布 |

不是所有测试都必须在每次保存时跑。工程化要平衡反馈速度和覆盖深度。

## 练习

1. 给 admin 添加一个 E2E smoke。
2. 在 package.json 增加 `"e2e": "playwright test"`。
3. 把 CI 拆成 verify 和 e2e 两个 job。
4. 故意让 E2E 失败，观察 CI 日志定位方式。

## 验收

- CI 使用 frozen lockfile。
- PR 阶段能阻断 lint、typecheck、test、build。
- E2E smoke 能覆盖核心页面打开。
- E2E 和基础验证可以分 job 定位失败。
