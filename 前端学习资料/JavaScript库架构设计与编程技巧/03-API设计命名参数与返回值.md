# API 设计命名参数与返回值

API 是库给使用者的操作界面。好的 API 会让正确用法自然发生，错误用法尽早暴露；坏的 API 会让使用者不断查源码、猜默认值、拼参数、处理奇怪返回值。

## API 设计目标

| 目标 | 说明 |
| --- | --- |
| 直觉 | 函数名和参数能表达意图 |
| 稳定 | 发布后不轻易破坏 |
| 可扩展 | 新能力能加到 options，不破坏旧调用 |
| 可组合 | API 返回值能和其他能力自然组合 |
| 可调试 | 错误信息和状态可观察 |
| 类型友好 | TS 能推断出主要结果 |

## 命名

命名要表达动作和领域概念。

```typescript
// 不清楚
run(data)
handle(options)

// 更清楚
createClient(options)
parseSchema(input)
registerPlugin(plugin)
```

常见命名约定：

| 前缀 | 语义 |
| --- | --- |
| `create` | 创建实例 |
| `define` | 定义配置或声明式对象 |
| `resolve` | 解析并归一化 |
| `parse` | 把输入解析成结构化结果 |
| `format` | 把结构化数据格式化 |
| `register` | 注册扩展 |
| `subscribe` | 订阅变化 |
| `dispose` | 释放资源 |

## 参数设计

参数少时可以用位置参数：

```typescript
clamp(value, min, max)
```

参数多、可选项多、未来可能扩展时，用 options：

```typescript
createClient({
  baseURL: '/api',
  timeout: 5000,
  retry: 2
})
```

位置参数一旦发布，不容易插入新参数；options 更适合库 API 演进。

## 返回值设计

返回值要稳定，不要频繁改变形态。

```typescript
type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ParseError }
```

这种 discriminated union 比返回 `null` 更容易处理：

```typescript
const result = parseUser(input)

if (!result.ok) {
  console.error(result.error.message)
  return
}

console.log(result.data.name)
```

## 同步和异步要清晰

不要让同一个 API 有时同步、有时异步。

```typescript
// 不推荐：返回 T 或 Promise<T>
function load(key: string): Value | Promise<Value>
```

更推荐拆开：

```typescript
getSync(key)
get(key): Promise<Value>
```

或者统一异步：

```typescript
await client.get('/users')
```

## 默认值

默认值要可预测，并且能在文档中说清楚。

```typescript
const defaultOptions = {
  timeout: 10000,
  retry: 0,
  cache: false
}
```

配置合并要避免隐式覆盖：

```typescript
const options = {
  ...defaultOptions,
  ...userOptions
}
```

对于深层配置，要明确是 shallow merge 还是 deep merge。

## 兼容演进

API 设计时要预留演进空间：

- 用 options 承载可选能力。
- 返回对象比返回数组更容易扩展字段。
- 错误对象保留 code。
- 插件 API 要有版本字段。
- 实验 API 加 `experimental` 标识。

## API 自检清单

- 使用者看名字能否猜到用途？
- 参数顺序是否容易记错？
- 是否能用 options 扩展新能力？
- 返回值是否能表达成功和失败？
- 错误是否有 code 和上下文？
- TypeScript 是否能推断主要类型？
- 这个 API 三年后还能兼容吗？

## 知识点展开与对应练习

| 知识点 | 小点展开 | 对应练习 | 验收标准 |
| --- | --- | --- | --- |
| 命名 | API 名称要表达动作和领域语义，避免 `handle`、`run` 这类空泛名称 | 重命名 10 个模糊函数名 | 每个新名字都能看出输入对象和动作意图 |
| 位置参数 | 适合少量、稳定、顺序自然的参数 | 设计 `clamp(value, min, max)` 并写 5 个测试 | 测试覆盖正常、越界、边界相等、`min > max` |
| options 参数 | 适合可选项多、未来要扩展的 API | 把 `request(url, method, headers, timeout)` 改成 options API | 新 API 能新增 `retry` 而不破坏旧调用 |
| 返回对象 | 返回对象比返回数组更适合扩展字段 | 设计 `parse(input)` 的返回结构 | 能表达成功、失败、错误码、原始输入位置 |
| Result 风格 | `ok/data/error` 能减少异常控制流，适合校验和解析 | 实现 `safeParseJSON(text)` | 不抛异常，返回 `{ ok: true, data }` 或 `{ ok: false, error }` |
| 异步一致性 | 同一个 API 不要有时返回值有时返回 Promise | 设计同步缓存读取和异步缓存读取 API | API 名称能明确区分 `getSync` 和 `get` |
| 默认值 | 默认值要可预测、可文档化、可覆盖 | 实现 `resolveOptions(defaults, userOptions)` | 明确 shallow merge 行为，并用测试覆盖用户覆盖默认值 |
| 兼容演进 | API 发布后优先新增字段，不轻易改变语义 | 为 `createClient` 设计 v1 到 v2 的兼容升级方案 | v1 调用在 v2 中仍然可运行，并有 deprecated 提示 |
