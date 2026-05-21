# 数组、元组、readonly 与 as const

数组和元组是前端中很常见的数据结构。数组表示同类列表，元组表示固定位置和固定长度的结构。

## 数组类型

```typescript
const names: string[] = ['Ada', 'Grace']
const ages: Array<number> = [18, 20]
```

两种写法等价。业务代码里 `string[]` 更常见。

对象数组：

```typescript
type User = {
  id: string
  name: string
}

const users: User[] = []
```

## 联合数组

```typescript
const values: Array<string | number> = ['a', 1]
```

这表示数组里每一项可以是字符串或数字。

注意区别：

```typescript
string[] | number[]
```

这表示整个数组要么全是字符串，要么全是数字。

## 元组

```typescript
type Point = [number, number]

const point: Point = [10, 20]
```

元组适合固定位置有含义的数据：

```typescript
type Result<T> = [Error | null, T | null]
type Size = [width: number, height: number]
```

带标签的元组能提升可读性：

```typescript
type RGB = [red: number, green: number, blue: number]
```

## 可选元组项和剩余项

```typescript
type Range = [start: number, end?: number]
type StringAndNumbers = [name: string, ...values: number[]]
```

元组比普通数组更适合表达函数参数列表。

## readonly 数组

```typescript
const names: readonly string[] = ['Ada', 'Grace']

names.push('Linus') // 类型错误
```

`readonly` 限制数组变更方法，但不代表运行时冻结。

也可以写：

```typescript
const names: ReadonlyArray<string> = ['Ada']
```

## as const

```typescript
const status = ['idle', 'loading', 'success'] as const
```

推断结果接近：

```typescript
readonly ['idle', 'loading', 'success']
```

可以从数组生成联合类型：

```typescript
type Status = (typeof status)[number]
```

`Status` 是：

```typescript
'idle' | 'loading' | 'success'
```

## 对象 as const

```typescript
const routes = {
  home: '/',
  user: '/users/:id'
} as const
```

属性会变成只读，值会保留字面量类型：

```typescript
type RouteName = keyof typeof routes
type RoutePath = (typeof routes)[RouteName]
```

## as const 的适用场景

适合：

- 常量配置。
- 枚举替代。
- 路由名、状态名、事件名。
- 从值生成联合类型。

不适合：

- 后续要频繁修改的数据。
- 大型可变状态对象。
- 为了压住类型错误而随便加。

## 数组方法和类型收窄

```typescript
const list: Array<string | undefined> = ['a', undefined]

const filtered = list.filter(Boolean)
```

`filtered` 不一定会被准确推断为 `string[]`。更明确的方式是写类型守卫：

```typescript
function isString(value: string | undefined): value is string {
  return typeof value === 'string'
}

const filtered = list.filter(isString)
```

