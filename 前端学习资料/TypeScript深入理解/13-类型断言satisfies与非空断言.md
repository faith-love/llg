# 类型断言、satisfies 与非空断言

断言是告诉 TypeScript “我比你更清楚”。它能解决一些边界问题，也很容易掩盖真实错误。

## 类型断言 as

```typescript
const input = document.querySelector('#name') as HTMLInputElement
```

这表示你确信查询结果是 `HTMLInputElement`。

风险：

```typescript
const input = document.querySelector('#missing') as HTMLInputElement
input.value
```

如果元素不存在，运行时仍然会报错。

## 双重断言

```typescript
const value = input as unknown as User
```

这是强行绕过类型系统。除非在非常特殊的兼容边界，否则不要使用。

## 非空断言

```typescript
const el = document.querySelector('#app')!
```

`!` 表示告诉 TypeScript 这里不是 `null` 或 `undefined`。

更稳妥：

```typescript
const el = document.querySelector('#app')

if (!el) {
  throw new Error('Missing #app')
}
```

非空断言适合测试代码、框架保证存在的节点、或启动阶段立即失败的场景。业务逻辑中不要滥用。

## definite assignment assertion

```typescript
class User {
  name!: string
}
```

这个 `!` 表示属性稍后会被赋值，绕过严格属性初始化检查。

如果你不能明确说明由谁赋值、什么时候赋值，就不要用。

## satisfies

`satisfies` 用来检查一个值是否满足某个类型，同时保留值本身更精确的推断。

```typescript
type RouteConfig = Record<string, {
  path: string
  title: string
}>

const routes = {
  home: {
    path: '/',
    title: '首页'
  },
  user: {
    path: '/users/:id',
    title: '用户'
  }
} satisfies RouteConfig
```

`routes` 会被检查是否满足 `RouteConfig`，但不会被粗暴变成 `RouteConfig`。

## satisfies 和类型标注的区别

```typescript
type StatusMap = Record<string, string>

const map1: StatusMap = {
  success: '成功'
}

const map2 = {
  success: '成功'
} satisfies StatusMap
```

`map1` 被标注成宽类型 `Record<string, string>`。

`map2` 保留具体键 `success`，同时检查值是否满足约束。

## satisfies 和 as 的区别

`as` 是断言，可能绕过错误：

```typescript
const config = {
  timeout: '5000'
} as { timeout: number }
```

`satisfies` 是检查，不会把错误吞掉：

```typescript
const config = {
  timeout: '5000'
} satisfies { timeout: number }
```

这会报错。

## 使用原则

优先顺序：

1. 让 TypeScript 正确推断。
2. 写明确类型标注。
3. 使用类型守卫或运行时校验。
4. 使用 `satisfies` 检查配置。
5. 最后才考虑 `as` 和 `!`。

断言越多，说明类型和运行时之间的距离越大。不要把断言当常规修复手段。

