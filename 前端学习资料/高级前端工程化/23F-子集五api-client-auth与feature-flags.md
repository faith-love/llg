# 子集五：api-client、auth 与 feature-flags

这一节实现三个业务基础包。它们不是页面代码，而是跨应用共享的业务底座。

## api-client

`packages/api-client/src/types.ts`：

```typescript
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestConfig = {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
}

export type ApiResponse<T> = {
  status: number
  data: T
  headers: Record<string, string>
}

export type Adapter = <T>(config: Required<RequestConfig>) => Promise<ApiResponse<T>>
```

`packages/api-client/src/errors.ts`：

```typescript
export class ApiError extends Error {
  constructor(
    public code: 'HTTP_ERROR' | 'NETWORK_ERROR' | 'ABORTED',
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

`packages/api-client/src/createClient.ts`：

```typescript
import type { Adapter, ApiResponse, RequestConfig } from './types'

export type ApiClientOptions = {
  baseURL?: string
  headers?: Record<string, string>
  adapter: Adapter
}

export function createClient(options: ApiClientOptions) {
  const baseURL = options.baseURL ?? ''

  async function request<T>(config: RequestConfig): Promise<T> {
    const normalized = {
      method: 'GET' as const,
      headers: {
        ...options.headers,
        ...config.headers
      },
      body: config.body,
      signal: config.signal,
      url: new URL(config.url, baseURL || window.location.origin).toString()
    }

    const response: ApiResponse<T> = await options.adapter<T>(normalized)
    return response.data
  }

  return {
    request,
    get<T>(url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}) {
      return request<T>({ ...config, url, method: 'GET' })
    },
    post<T>(url: string, body: unknown, config: Omit<RequestConfig, 'url' | 'method' | 'body'> = {}) {
      return request<T>({ ...config, url, method: 'POST', body })
    }
  }
}
```

`packages/api-client/src/mockAdapter.ts`：

```typescript
import type { Adapter } from './types'
import { ApiError } from './errors'

type RouteMap = Record<string, unknown>

export function createMockAdapter(routes: RouteMap): Adapter {
  return async (config) => {
    const url = new URL(config.url)
    const key = `${config.method} ${url.pathname}`

    if (config.signal?.aborted) {
      throw new ApiError('ABORTED', 'Request aborted')
    }

    if (!(key in routes)) {
      throw new ApiError('HTTP_ERROR', `Mock route not found: ${key}`, 404)
    }

    return {
      status: 200,
      headers: {},
      data: routes[key]
    }
  }
}
```

`packages/api-client/src/index.ts`：

```typescript
export { createClient } from './createClient'
export { createMockAdapter } from './mockAdapter'
export { ApiError } from './errors'
export type { Adapter, ApiResponse, RequestConfig } from './types'
```

## auth

`packages/auth/src/types.ts`：

```typescript
export type Role = 'admin' | 'support' | 'customer'

export type Permission =
  | 'users:read'
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

`packages/auth/src/permissions.ts`：

```typescript
import type { Permission, Session } from './types'

export function hasPermission(session: Session | null, permission: Permission) {
  if (!session) return false
  return session.permissions.includes(permission)
}

export function requirePermission(session: Session | null, permission: Permission) {
  if (!hasPermission(session, permission)) {
    throw new Error(`Missing permission: ${permission}`)
  }
}
```

`packages/auth/src/session.ts`：

```typescript
import type { Session } from './types'

export function createAdminSession(): Session {
  return {
    userId: 'admin-1',
    role: 'admin',
    permissions: ['users:read', 'tickets:read', 'tickets:write', 'flags:read', 'flags:write']
  }
}

export function createCustomerSession(userId: string): Session {
  return {
    userId,
    role: 'customer',
    permissions: ['tickets:read', 'tickets:write']
  }
}
```

`packages/auth/src/index.ts`：

```typescript
export { hasPermission, requirePermission } from './permissions'
export { createAdminSession, createCustomerSession } from './session'
export type { Permission, Role, Session } from './types'
```

## feature-flags

`packages/feature-flags/src/types.ts`：

```typescript
export type FlagDefinition = {
  defaultValue: boolean
  rollout?: number
}

export type FlagMap = Record<string, FlagDefinition>
```

`packages/feature-flags/src/client.ts`：

```typescript
import type { FlagDefinition, FlagMap } from './types'

function stableHash(input: string) {
  let hash = 0
  for (const char of input) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100
  }
  return hash
}

function evaluateFlag(userId: string, flag: FlagDefinition) {
  if (flag.rollout === undefined) return flag.defaultValue
  return stableHash(userId) < flag.rollout
}

export function createFeatureFlags(flags: FlagMap) {
  return {
    isEnabled(name: string, context: { userId: string }) {
      const flag = flags[name]
      if (!flag) return false
      return evaluateFlag(context.userId, flag)
    }
  }
}
```

`packages/feature-flags/src/index.ts`：

```typescript
export { createFeatureFlags } from './client'
export type { FlagDefinition, FlagMap } from './types'
```

## 在 admin 中接入

`apps/admin/src/app/services.ts`：

```typescript
import { createClient, createMockAdapter } from '@acme/api-client'
import { createAdminSession } from '@acme/auth'
import { createFeatureFlags } from '@acme/feature-flags'

export const session = createAdminSession()

export const api = createClient({
  baseURL: 'http://localhost',
  adapter: createMockAdapter({
    'GET /users': [
      { id: 'u1', name: 'Ada', status: 'active' },
      { id: 'u2', name: 'Linus', status: 'disabled' }
    ]
  })
})

export const flags = createFeatureFlags({
  newUserTable: {
    defaultValue: false,
    rollout: 50
  }
})
```

## 验收标准

- 应用不直接调用 `fetch`，只通过 `@acme/api-client`。
- 权限判断不写在页面内部，而是复用 `@acme/auth`。
- Feature Flag 分流对同一用户稳定。
- `api-client` 不依赖 React。
- `auth` 不依赖 app。

