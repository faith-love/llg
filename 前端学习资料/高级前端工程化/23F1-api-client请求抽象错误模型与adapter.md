# api-client 请求抽象、错误模型与 adapter

这一页拆请求库。一个好的 api-client 不应该只包一层 `fetch`，还要统一错误、取消、baseURL、mock、测试替换点。

## 步骤一：定义请求协议

`packages/api-client/src/types.ts`：

```typescript
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestConfig = {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
}

export type NormalizedRequestConfig = Required<Pick<RequestConfig, 'url' | 'method' | 'headers'>> &
  Pick<RequestConfig, 'body' | 'signal'>

export type ApiResponse<T> = {
  status: number
  data: T
  headers: Record<string, string>
}

export type Adapter = <T>(config: NormalizedRequestConfig) => Promise<ApiResponse<T>>
```

类型说明：

- 外部调用用 `RequestConfig`，可以省略 method 和 headers。
- 内部 adapter 接收 `NormalizedRequestConfig`，字段已经归一化。
- adapter 是替换点，可以是真实 fetch，也可以是 mock。

## 步骤二：统一错误模型

`packages/api-client/src/errors.ts`：

```typescript
export type ApiErrorCode = 'HTTP_ERROR' | 'NETWORK_ERROR' | 'ABORTED' | 'PARSE_ERROR'

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status?: number,
    public cause?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

统一错误的价值：

- 页面不用猜错误类型。
- 监控可以按 `code` 分类。
- 测试可以断言 `HTTP_ERROR` 或 `ABORTED`。

## 步骤三：实现真实 fetch adapter

`packages/api-client/src/fetchAdapter.ts`：

```typescript
import { ApiError } from './errors'
import type { Adapter } from './types'

export const fetchAdapter: Adapter = async (config) => {
  try {
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.body === undefined ? undefined : JSON.stringify(config.body),
      signal: config.signal
    })

    const data = await response.json().catch((error: unknown) => {
      throw new ApiError('PARSE_ERROR', 'Failed to parse response JSON', response.status, error)
    })

    if (!response.ok) {
      throw new ApiError('HTTP_ERROR', `HTTP ${response.status}`, response.status, data)
    }

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data
    }
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('ABORTED', 'Request aborted', undefined, error)
    }
    throw new ApiError('NETWORK_ERROR', 'Network request failed', undefined, error)
  }
}
```

代码说明：

- HTTP 非 2xx 是 `HTTP_ERROR`。
- JSON 解析失败是 `PARSE_ERROR`。
- abort 是 `ABORTED`。
- 其他异常归为 `NETWORK_ERROR`。

## 步骤四：实现 createClient

`packages/api-client/src/createClient.ts`：

```typescript
import type { Adapter, RequestConfig } from './types'

export type ApiClientOptions = {
  baseURL: string
  headers?: Record<string, string>
  adapter: Adapter
}

export function createClient(options: ApiClientOptions) {
  async function request<T>(config: RequestConfig): Promise<T> {
    const url = new URL(config.url, options.baseURL).toString()

    const response = await options.adapter<T>({
      url,
      method: config.method ?? 'GET',
      headers: {
        'content-type': 'application/json',
        ...options.headers,
        ...config.headers
      },
      body: config.body,
      signal: config.signal
    })

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

## 步骤五：mock adapter 用于测试和本地开发

`packages/api-client/src/mockAdapter.ts`：

```typescript
import { ApiError } from './errors'
import type { Adapter } from './types'

export function createMockAdapter(routes: Record<string, unknown>): Adapter {
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

## 练习

1. 实现 `put` 和 `delete` 快捷方法。
2. 给 `fetchAdapter` 加 `credentials` 配置。
3. 给 mock route miss 写测试。
4. 页面里禁止直接调用 `fetch`，只能使用 `api-client`。

## 验收

- 请求库不依赖 React。
- 错误类型可分类。
- adapter 可以替换。
- mock adapter 可以覆盖页面开发和单元测试。
