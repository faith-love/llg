# keyof、typeof、索引访问与模板字面量类型

这一章关注从已有值或类型中派生新类型。项目越大，越需要减少重复类型定义。

## keyof

```typescript
type User = {
  id: string
  name: string
  age: number
}

type UserKey = keyof User
```

`UserKey` 是：

```typescript
'id' | 'name' | 'age'
```

常见用法：

```typescript
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

## typeof 类型查询

```typescript
const config = {
  apiBase: '/api',
  timeout: 5000
}

type Config = typeof config
```

`typeof` 可以从值生成类型。

注意这不是运行时 `typeof`，而是类型位置中的 TypeScript 语法。

## 索引访问类型

```typescript
type User = {
  id: string
  profile: {
    name: string
    email: string
  }
}

type Profile = User['profile']
type Email = User['profile']['email']
```

数组项类型：

```typescript
type Users = User[]
type UserItem = Users[number]
```

## 从常量生成联合类型

```typescript
const statuses = ['idle', 'loading', 'success', 'error'] as const

type Status = (typeof statuses)[number]
```

`Status` 是：

```typescript
'idle' | 'loading' | 'success' | 'error'
```

这种模式很适合状态、事件名、路由名。

## 模板字面量类型

```typescript
type Size = 'sm' | 'md' | 'lg'
type Variant = 'primary' | 'danger'

type ClassName = `btn-${Size}-${Variant}`
```

结果：

```typescript
'btn-sm-primary' | 'btn-sm-danger' | 'btn-md-primary' | ...
```

## 事件名派生

```typescript
type Model = {
  name: string
  age: number
}

type ChangeEventName = `${keyof Model & string}Changed`
```

结果：

```typescript
'nameChanged' | 'ageChanged'
```

结合泛型：

```typescript
type Watcher<T> = {
  on<K extends keyof T & string>(
    event: `${K}Changed`,
    listener: (value: T[K]) => void
  ): void
}
```

## keyof 的 number 和 symbol

对象键不一定只是字符串：

```typescript
type Keys = keyof any
```

等价于：

```typescript
string | number | symbol
```

当模板字面量类型需要字符串键时，常写：

```typescript
keyof T & string
```

这表示只取字符串键。

## 使用原则

适合派生：

- 常量配置到联合类型。
- API 模型到字段名。
- 对象类型到子类型。
- 事件名、表单字段名、权限点。

不适合：

- 为了少写几行类型而牺牲可读性。
- 把简单类型变成复杂类型谜题。
- 从不稳定的临时对象派生公共类型。

