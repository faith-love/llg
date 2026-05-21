# 条件类型与 infer

条件类型让类型可以根据条件分支计算。`infer` 让你从已有类型中提取局部类型。

## 条件类型基础

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'a'> // true
type B = IsString<1> // false
```

语法：

```typescript
T extends U ? X : Y
```

含义是：如果 `T` 可以赋给 `U`，结果是 `X`，否则是 `Y`。

## 提取 Promise 结果

```typescript
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

type A = UnwrapPromise<Promise<string>> // string
type B = UnwrapPromise<number> // number
```

`infer R` 表示在匹配 `Promise<...>` 时，把里面的类型提取出来命名为 `R`。

## 提取数组项

```typescript
type ElementType<T> = T extends Array<infer Item> ? Item : never

type A = ElementType<string[]> // string
type B = ElementType<number[]> // number
```

也可以支持只读数组：

```typescript
type ElementType<T> = T extends readonly (infer Item)[] ? Item : never
```

## 提取函数返回值

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type A = MyReturnType<() => string> // string
```

内置工具类型 `ReturnType` 就是类似思路。

## 分布式条件类型

当条件类型作用于裸类型参数，并传入联合类型时，会分发到联合成员：

```typescript
type ToArray<T> = T extends any ? T[] : never

type A = ToArray<string | number>
```

结果是：

```typescript
string[] | number[]
```

而不是：

```typescript
(string | number)[]
```

## 关闭分布式

用元组包起来：

```typescript
type ToArray<T> = [T] extends [any] ? T[] : never

type A = ToArray<string | number>
```

结果是：

```typescript
(string | number)[]
```

## never 和条件类型

```typescript
type A = never extends string ? true : false
```

结果是 `true`。

但分布式条件类型里传入 `never`：

```typescript
type IsString<T> = T extends string ? true : false
type A = IsString<never>
```

结果是 `never`，因为没有联合成员可分发。

这也是复杂类型中 `never` 容易让人困惑的原因。

## 条件类型适合什么

适合：

- 从 Promise、数组、函数中提取类型。
- 根据配置类型推导返回值。
- 编写公共工具类型。
- 包装第三方库类型。

不适合：

- 业务开发里过度类型编程。
- 把简单 if else 逻辑搬到类型系统里。
- 写出团队无法维护的嵌套类型。

