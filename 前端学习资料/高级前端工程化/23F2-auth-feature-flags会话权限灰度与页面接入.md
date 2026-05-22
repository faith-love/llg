# auth、feature flags、会话权限、灰度与页面接入

这一页拆权限和灰度。权限决定“能不能做”，Feature Flag 决定“用哪个版本”。两者都不应该散落在页面里的 if 判断中。

## 步骤一：定义权限模型

`packages/auth/src/types.ts`：

```typescript
export type Role = 'admin' | 'support' | 'customer'

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'tickets:read'
  | 'tickets:write'
  | 'flags:read'
  | 'flags:write'

export type Session = {
  userId: string
  role: Role
  permissions: Permission[]
}
```

说明：

- `Role` 是角色标签。
- `Permission` 是具体动作权限。
- 页面应该优先判断 permission，而不是直接判断 role。

## 步骤二：权限工具

`packages/auth/src/permissions.ts`：

```typescript
import type { Permission, Session } from './types'

export function hasPermission(session: Session | null, permission: Permission) {
  return Boolean(session?.permissions.includes(permission))
}

export function requirePermission(session: Session | null, permission: Permission) {
  if (!hasPermission(session, permission)) {
    throw new Error(`Missing permission: ${permission}`)
  }
}

export function canAccessAny(session: Session | null, permissions: Permission[]) {
  return permissions.some((permission) => hasPermission(session, permission))
}
```

代码说明：

- `hasPermission` 用于页面展示。
- `requirePermission` 用于必须阻断的动作。
- `canAccessAny` 用于菜单、入口、组合权限。

## 步骤三：Feature Flag 稳定分流

`packages/feature-flags/src/client.ts`：

```typescript
export type FlagDefinition = {
  defaultValue: boolean
  rollout?: number
}

export type FlagContext = {
  userId: string
}

function stableHash(input: string) {
  let hash = 0
  for (const char of input) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100
  }
  return hash
}

export function createFeatureFlags(flags: Record<string, FlagDefinition>) {
  return {
    isEnabled(name: string, context: FlagContext) {
      const flag = flags[name]
      if (!flag) return false
      if (flag.rollout === undefined) return flag.defaultValue
      return stableHash(`${name}:${context.userId}`) < flag.rollout
    }
  }
}
```

为什么 hash 输入要包含 `name`：

- 同一个用户不应该在所有 flag 上都落到相同桶。
- `flagName:userId` 可以让不同实验独立分流。

## 步骤四：应用中封装业务开关

`apps/admin/src/app/flags.ts`：

```typescript
import { flags, session } from './services'

export function canUseNewUserTable() {
  return flags.isEnabled('newUserTable', { userId: session.userId })
}
```

页面不直接写 flag 名称：

```typescript
import { canUseNewUserTable } from '../../app/flags'

export function UsersPage() {
  const useNewTable = canUseNewUserTable()

  return useNewTable ? <p>New table enabled</p> : <p>Legacy table enabled</p>
}
```

这样做的好处是 flag 名称变更时，只改应用封装层，不用搜索所有页面。

## 步骤五：权限和灰度组合

`apps/admin/src/pages/flags/FlagsPage.tsx`：

```typescript
import { hasPermission } from '@acme/auth'
import { session } from '../../app/services'

export function FlagsPage() {
  const canReadFlags = hasPermission(session, 'flags:read')
  const canWriteFlags = hasPermission(session, 'flags:write')

  if (!canReadFlags) {
    return <p role="alert">You do not have permission to view feature flags.</p>
  }

  return (
    <section>
      <h2>Feature Flags</h2>
      <button disabled={!canWriteFlags}>Create flag</button>
    </section>
  )
}
```

权限和灰度的边界：

| 能力 | 解决问题 | 不应该做 |
| --- | --- | --- |
| auth | 用户有没有权限 | 控制新旧功能版本 |
| feature flag | 某个功能是否对用户开放 | 替代安全权限 |

Feature Flag 不是权限系统。不能因为 flag 关了就认为用户没有权限，也不能因为 flag 开了就绕过权限。

## 练习

1. 给 `auth` 增加 `canAccessAny` 测试。
2. 给 feature flag 增加两个不同 flag，验证同一用户分流可以不同。
3. 页面里禁止直接写 flag name，统一放到 `app/flags.ts`。
4. 给 `FlagsPage` 做 read/write 两级权限展示。

## 验收

- 页面判断 permission，不直接判断 role。
- Feature Flag 对同一用户和同一 flag 稳定。
- flag 名称集中管理。
- 能说清权限和灰度的职责差异。
