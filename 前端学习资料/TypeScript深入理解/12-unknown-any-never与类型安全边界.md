# unknown、any、never 与类型安全边界

`unknown`、`any`、`never` 是 TypeScript 类型系统的边界类型。理解它们，才能避免类型安全失控。

## any

`any` 会关闭类型检查：

```typescript
let value: any = 1

value.toUpperCase()
value.foo.bar()
```

TypeScript 不会拦你。`any` 会传染：

```typescript
function parse(input: string): any {
  return JSON.parse(input)
}

const user = parse('{}')
user.not.exists.deep.call()
```

一旦 `any` 进入核心业务，后面很多类型保护都会失效。

## unknown

`unknown` 表示“我不知道它是什么”。使用前必须收窄：

```typescript
let value: unknown = JSON.parse('{}')

value.name // 类型错误
```

必须检查：

```typescript
if (
  typeof value === 'object' &&
  value !== null &&
  'name' in value
) {
  console.log(value.name)
}
```

外部输入边界优先用 `unknown`，不要直接用 `any`。

## any vs unknown

| 类型 | 能否随便访问属性 | 是否安全 | 适合场景 |
| --- | --- | --- | --- |
| `any` | 能 | 不安全 | 临时迁移、极少数兼容边界 |
| `unknown` | 不能，必须收窄 | 更安全 | 外部输入、JSON、第三方未知数据 |

## never

`never` 表示不可能出现的值。

函数永不返回：

```typescript
function fail(message: string): never {
  throw new Error(message)
}
```

穷尽检查：

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
```

联合类型被完全排除后也会得到 `never`：

```typescript
type A = Exclude<'a' | 'b', 'a' | 'b'>
```

## void 和 never 的区别

`void` 是没有有效返回值：

```typescript
function log(): void {
  console.log('ok')
}
```

`never` 是函数不会正常结束：

```typescript
function crash(): never {
  throw new Error('crash')
}
```

## 安全边界建议

外部输入：

```typescript
function parseUser(input: unknown): User {
  if (!isUser(input)) {
    throw new Error('Invalid user')
  }

  return input
}
```

内部业务：

```typescript
function renderUser(user: User) {}
```

边界外用 `unknown`，边界内用明确业务类型。

## any 的治理原则

可以接受：

- 迁移旧 JS 项目的短期临时类型。
- 第三方库类型缺失时的隔离层。
- 很窄的兼容代码。

不应该接受：

- 核心业务模型。
- API 返回值直接 `any`。
- 组件 props 大面积 `any`。
- 公共工具函数返回 `any`。

如果必须用，尽量隔离：

```typescript
function unsafeParseJSON(input: string): unknown {
  return JSON.parse(input) as unknown
}
```

