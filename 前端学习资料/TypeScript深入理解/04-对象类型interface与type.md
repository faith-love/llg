# 对象类型、interface 与 type

前端项目里大多数类型都是对象类型：接口返回值、组件 props、表单模型、状态对象、配置项。对象类型设计得好，项目边界会清晰很多。

## 对象类型基础

```typescript
type User = {
  id: string
  name: string
  age?: number
}
```

`age?: number` 表示属性可选。读取时类型是：

```typescript
number | undefined
```

所以使用时要处理 `undefined`：

```typescript
if (user.age !== undefined) {
  console.log(user.age + 1)
}
```

## readonly 属性

```typescript
type User = {
  readonly id: string
  name: string
}
```

`readonly` 限制重新赋值：

```typescript
user.id = '2' // 类型错误
```

它不是运行时冻结，也不是深度不可变。

## interface

```typescript
interface User {
  id: string
  name: string
}
```

`interface` 常用于描述对象结构，尤其适合公开 API 和可扩展结构。

## type

```typescript
type User = {
  id: string
  name: string
}
```

`type` 更通用，可以表达对象、联合、交叉、元组、条件类型等：

```typescript
type Status = 'idle' | 'loading' | 'success'
type Point = [number, number]
```

## interface 和 type 怎么选

实用规则：

| 场景 | 推荐 |
| --- | --- |
| 只描述对象结构 | `interface` 或 `type` 都可以 |
| 需要联合类型 | `type` |
| 需要元组 | `type` |
| 需要条件类型、映射类型组合 | `type` |
| 希望被外部声明合并扩展 | `interface` |
| 团队已有统一规范 | 跟随团队 |

不要在项目里为这个问题过度争论。保持一致比混用风格更重要。

## 声明合并

`interface` 可以声明合并：

```typescript
interface User {
  id: string
}

interface User {
  name: string
}

const user: User = {
  id: '1',
  name: 'Ada'
}
```

`type` 不能重复声明同名类型。

声明合并适合扩展第三方库类型，但业务代码中滥用会让类型来源变得分散。

## 索引签名

```typescript
type Dictionary = {
  [key: string]: string
}

const messages: Dictionary = {
  hello: '你好',
  bye: '再见'
}
```

如果对象有固定字段和动态字段，注意值类型必须兼容：

```typescript
type UserMap = {
  total: number
  [key: string]: number
}
```

这里所有字符串键的值都必须是 `number`。

## excess property checking

```typescript
type User = {
  id: string
  name: string
}

const user: User = {
  id: '1',
  name: 'Ada',
  age: 18
}
```

对象字面量直接赋值时，多余属性会被检查。

但如果先赋给变量：

```typescript
const raw = {
  id: '1',
  name: 'Ada',
  age: 18
}

const user: User = raw
```

这通常可以通过，因为结构类型关注目标所需字段是否存在。

## 结构类型

TypeScript 是结构类型系统，不是名义类型系统。

```typescript
type User = {
  id: string
}

type Product = {
  id: string
}

const product: Product = { id: 'p1' }
const user: User = product
```

只要结构兼容，就能赋值。字段名字和类型比类型名字更重要。

如果确实需要区分业务身份，可以使用品牌类型。

