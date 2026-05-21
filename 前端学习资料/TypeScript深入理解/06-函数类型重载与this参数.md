# 函数类型、重载与 this 参数

函数是 TypeScript 中最重要的类型边界之一。函数参数约束调用方，返回值约束使用方。

## 函数声明类型

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

函数返回值通常可以推断，但公共函数建议显式写返回值，避免不小心改坏 API。

## 函数表达式类型

```typescript
const add = (a: number, b: number): number => {
  return a + b
}
```

也可以先定义函数类型：

```typescript
type Add = (a: number, b: number) => number

const add: Add = (a, b) => a + b
```

## 可选参数和默认参数

```typescript
function greet(name: string, prefix?: string) {
  return `${prefix ?? 'Hello'}, ${name}`
}
```

可选参数类型是：

```typescript
string | undefined
```

默认参数：

```typescript
function greet(name: string, prefix = 'Hello') {}
```

## 剩余参数

```typescript
function sum(...numbers: number[]) {
  return numbers.reduce((total, item) => total + item, 0)
}
```

固定参数列表可以用元组：

```typescript
type RequestArgs = [url: string, options?: RequestInit]

function request(...args: RequestArgs) {}
```

## 回调函数

```typescript
type Listener<T> = (payload: T) => void

function on<T>(event: string, listener: Listener<T>) {}
```

回调返回 `void` 表示调用方不关心返回值，不代表实现里绝对不能返回值。

## 函数重载

```typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  return String(value)
}
```

前两行是重载签名，最后一行是实现签名。

调用方只能看到重载签名：

```typescript
format('a')
format(1)
format(true) // 类型错误
```

## 什么时候用重载

适合：

- 入参不同，返回值类型也不同。
- 需要兼容历史 API。
- 函数有清晰的几种调用方式。

不适合：

- 可以用联合类型简单表达。
- 只是为了让类型看起来复杂。

例如：

```typescript
function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value]
}
```

这种不需要重载。

## this 参数

普通函数可以声明 `this` 类型：

```typescript
function handleClick(this: HTMLButtonElement, event: MouseEvent) {
  console.log(this.disabled)
}
```

`this` 参数是 TypeScript 的假参数，编译后不存在。

对象方法中也可以约束：

```typescript
type User = {
  name: string
  sayHi(this: User): string
}
```

## 箭头函数没有自己的 this

```typescript
class User {
  name = 'Ada'

  sayHi = () => {
    return this.name
  }
}
```

箭头函数捕获外层 `this`，不适合声明 `this` 参数。

## 函数类型的参数兼容

开启 `strictFunctionTypes` 后，函数参数检查更严格。事件回调、组件回调、通用工具函数中，经常会遇到参数类型兼容问题。

基本原则：

- 传入的回调不能要求比调用方能提供的参数更具体。
- 返回值可以更具体。
- 公共 API 的回调参数不要设计得过窄。

