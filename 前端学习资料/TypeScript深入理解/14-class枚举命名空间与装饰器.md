# class、枚举、命名空间、类型注解与装饰器

TypeScript 不只提供类型语法，也包含一些会影响运行时代码的语法。本章关注 class、enum、namespace、类型注解和装饰器的使用边界。尤其要注意：中文里常说的“TS 注解”可能指类型注解，也可能指装饰器，两者不是一回事。

## 类型注解不是运行时注解

TypeScript 类型注解是编译期信息：

```typescript
const name: string = 'Ada'

function add(a: number, b: number): number {
  return a + b
}
```

编译成 JavaScript 后，`: string`、`: number` 这些类型标注会消失：

```javascript
const name = 'Ada'

function add(a, b) {
  return a + b
}
```

所以类型注解的作用是：

- 帮编译器检查代码。
- 帮编辑器做提示、跳转和重构。
- 帮团队明确函数、对象、组件、接口的协作边界。

它不会：

- 在运行时自动校验数据。
- 自动阻止接口返回脏数据。
- 自动生成 Java 那种运行时注解元数据。
- 自动让浏览器知道某个参数是 `string`。

## 常见类型注解位置

变量：

```typescript
let count: number = 0
let status: 'idle' | 'loading' | 'success' = 'idle'
```

函数参数和返回值：

```typescript
function formatUser(id: string, name: string): string {
  return `${id}:${name}`
}
```

对象结构：

```typescript
type User = {
  id: string
  name: string
  age?: number
}

const user: User = {
  id: '1',
  name: 'Ada'
}
```

数组和元组：

```typescript
const users: User[] = []
const point: [x: number, y: number] = [10, 20]
```

函数类型：

```typescript
type ClickHandler = (event: MouseEvent) => void

const handleClick: ClickHandler = (event) => {
  console.log(event.type)
}
```

class 字段、构造器参数和方法：

```typescript
class UserService {
  private cache: Map<string, User> = new Map()

  constructor(private baseUrl: string) {}

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${id}`)
    return response.json()
  }
}
```

泛型：

```typescript
function identity<T>(value: T): T {
  return value
}

type ApiResponse<T> = {
  code: number
  data: T
}
```

## 什么时候应该写类型注解

建议显式写：

- 函数参数。
- 公共函数返回值。
- 组件 props。
- API 入参和返回值。
- class 公共字段和方法。
- 复杂对象模型。
- 泛型工具函数的边界。

可以依赖推断：

```typescript
const count = 0
const name = user.name.trim()
const enabled = Boolean(input)
```

局部变量能被 TypeScript 清楚推断时，不需要重复标注。类型注解应该服务边界，不应该把每一行代码都写满。

## TypeScript class

```typescript
class User {
  constructor(
    public id: string,
    private token: string
  ) {}
}
```

`public`、`private`、`protected` 主要是编译期访问控制。需要 JavaScript 运行时真私有时，使用 `#private`：

```typescript
class User {
  #token: string

  constructor(token: string) {
    this.#token = token
  }
}
```

## abstract

```typescript
abstract class Store {
  abstract get(key: string): unknown
}
```

`abstract` 是编译期约束，编译成 JavaScript 后不会自动阻止运行时实例化。需要运行时保护时，在构造器中检查 `new.target`。

## 参数属性

TypeScript 支持把构造器参数直接声明成实例属性：

```typescript
class User {
  constructor(
    public id: string,
    private token: string,
    readonly createdAt: Date
  ) {}
}
```

等价于：

```typescript
class User {
  public id: string
  private token: string
  readonly createdAt: Date

  constructor(id: string, token: string, createdAt: Date) {
    this.id = id
    this.token = token
    this.createdAt = createdAt
  }
}
```

参数属性适合简单值对象。构造参数很多时，优先考虑传入配置对象，让调用点更清楚。

## enum

```typescript
enum Direction {
  Up,
  Down
}
```

普通 `enum` 会生成运行时代码。

字符串 enum：

```typescript
enum Status {
  Success = 'success',
  Error = 'error'
}
```

## enum 的取舍

很多前端项目更偏向使用字面量联合和常量对象：

```typescript
const Status = {
  Success: 'success',
  Error: 'error'
} as const

type Status = (typeof Status)[keyof typeof Status]
```

优点：

- 更接近 JavaScript。
- tree-shaking 更直观。
- 和 JSON、接口字段更一致。

如果团队或后端协议大量使用 enum，也可以继续使用，但要知道它会产生运行时代码。

## const enum

```typescript
const enum Direction {
  Up,
  Down
}
```

`const enum` 会被内联，可能和 Babel、isolatedModules、第三方声明文件产生兼容问题。库代码中要谨慎导出 `const enum`。

## namespace

```typescript
namespace Utils {
  export function format() {}
}
```

`namespace` 是 TS 早期组织代码的方式。现代前端项目更推荐 ES Modules：

```typescript
export function format() {}
```

除非维护老项目或声明全局类型，否则不要新写大量 namespace。

## 装饰器

装饰器是 `@xxx` 形式的语法，用来修饰 class 或 class 成员。它不是普通类型注解，而是会影响编译输出和运行时行为的元编程能力。

```typescript
@Controller('/users')
class UserController {
  @Get('/:id')
  getUser() {}
}
```

装饰器常见于：

- Angular。
- NestJS。
- MobX。
- class-validator / class-transformer。
- 老式 Vue class 写法。
- 组件库、ORM、依赖注入容器。

但装饰器不是 TypeScript 日常业务代码的必需品。没有框架要求时，不要为了“像 Java 注解”而主动引入。

## 新版标准装饰器和 legacy decorators

TypeScript 现在需要区分两套装饰器语义：

| 维度 | 新版标准装饰器 | legacy decorators |
| --- | --- | --- |
| 常见版本 | TypeScript 5.0+ 支持 | TypeScript 早期长期支持 |
| 配置 | 不依赖 `experimentalDecorators` 的新语义 | 需要 `experimentalDecorators: true` |
| 函数签名 | `(value, context)` | 通常是 `(target, key, descriptor)` |
| 参数装饰器 | 不支持 | 支持 |
| `emitDecoratorMetadata` | 不兼容 | 可配合使用 |
| 常见框架 | 新代码、未来标准方向 | Angular、NestJS、class-validator 等大量历史生态 |

最容易踩坑的是：网上很多教程、Angular/NestJS 示例属于 legacy decorators；而 TypeScript 5.0 release note 里讲的是新版标准装饰器。两套函数签名不同，不能直接混用。

## 新版方法装饰器

新版装饰器接收两个参数：

```typescript
function loggedMethod<This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name)

  function replacement(this: This, ...args: Args): Return {
    console.log(`enter ${methodName}`)
    const result = originalMethod.call(this, ...args)
    console.log(`exit ${methodName}`)
    return result
  }

  return replacement
}

class UserService {
  @loggedMethod
  getUser(id: string) {
    return { id, name: 'Ada' }
  }
}
```

重点：

- `originalMethod` 是被装饰的方法。
- `context.name` 是成员名。
- 返回一个新函数可以替换原方法。
- 类型参数 `This`、`Args`、`Return` 用来保留 `this`、参数和返回值类型。

这类装饰器适合做日志、计时、埋点、权限检查等横切逻辑。但要谨慎，不要让方法真实行为变得难以从源码看出来。

## 新版字段装饰器

字段装饰器可以返回一个初始化函数：

```typescript
function trim(value: undefined, context: ClassFieldDecoratorContext) {
  return function (initialValue: string) {
    return initialValue.trim()
  }
}

class User {
  @trim
  name = ' Ada '
}

const user = new User()
console.log(user.name) // 'Ada'
```

字段装饰器重点不是拿到字段当前值，而是介入字段初始化过程。它适合做标准化、注册、懒初始化等逻辑，但过度使用会让字段赋值不透明。

## 新版类装饰器

类装饰器可以观察或替换 class：

```typescript
function registered<T extends new (...args: any[]) => object>(
  value: T,
  context: ClassDecoratorContext
) {
  console.log(`register ${String(context.name)}`)
  return value
}

@registered
class UserService {}
```

如果返回一个新 class，就会替换原 class。这个能力很强，也很容易让继承、静态成员、实例判断和调试变复杂。业务代码里要慎用替换类的写法。

## 装饰器工厂

装饰器工厂是返回装饰器的函数，适合传配置：

```typescript
function route(path: string) {
  return function (
    value: Function,
    context: ClassDecoratorContext
  ) {
    console.log(`route ${path} -> ${String(context.name)}`)
  }
}

@route('/users')
class UserController {}
```

框架中的 `@Controller('/users')`、`@Get('/:id')`、`@Column({ type: 'text' })` 通常都是装饰器工厂。

## legacy 方法装饰器

legacy decorators 的方法装饰器通常长这样：

```typescript
function LogMethod(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value

  descriptor.value = function (...args: unknown[]) {
    console.log(`call ${String(propertyKey)}`)
    return original.apply(this, args)
  }
}

class UserService {
  @LogMethod
  getUser(id: string) {
    return { id }
  }
}
```

legacy 参数含义：

| 参数 | 含义 |
| --- | --- |
| `target` | 实例方法时是 `Class.prototype`，静态方法时是 class 构造函数 |
| `propertyKey` | 被装饰的成员名 |
| `descriptor` | 属性描述符，可以替换 `descriptor.value` |

这个签名和新版 `(value, context)` 完全不同。

## legacy 属性装饰器

```typescript
function Field(target: object, propertyKey: string | symbol) {
  console.log(target, propertyKey)
}

class User {
  @Field
  name!: string
}
```

legacy 属性装饰器拿不到实例属性的初始值，因为它执行时实例还没创建。它通常用于登记元数据，而不是直接改字段值。

## 参数装饰器

legacy decorators 支持参数装饰器：

```typescript
function Inject(token: unknown) {
  return function (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    console.log(token, propertyKey, parameterIndex)
  }
}

class UserController {
  constructor(@Inject('UserService') private service: unknown) {}
}
```

新版标准装饰器不支持参数装饰器。这就是 NestJS、Angular 等生态还需要 legacy decorators 的重要原因之一。

## emitDecoratorMetadata 和 reflect-metadata

`emitDecoratorMetadata` 是 TypeScript legacy decorators 生态中常见的配置：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

再配合：

```typescript
import 'reflect-metadata'
```

TypeScript 会在编译产物里生成类似这些 metadata：

```text
design:type
design:paramtypes
design:returntype
```

框架可以用这些信息做依赖注入、校验、序列化等事情。

但要理解几个限制：

- 这些 metadata 不是 JavaScript 标准的一部分。
- 它主要服务 legacy decorators。
- 新版标准装饰器不兼容 `emitDecoratorMetadata`。
- 泛型、联合类型、接口等复杂 TS 类型在运行时不会完整保留。
- `Array<User>` 这类类型在 metadata 里通常只能得到 `Array`，拿不到 `User`。

所以不要以为 `emitDecoratorMetadata` 能把 TypeScript 类型系统完整带到运行时。它只是发出一部分设计期类型信息。

## 装饰器执行时机

装饰器在 class 定义阶段执行，不是在每次实例化时才执行：

```typescript
function log(value: Function, context: ClassDecoratorContext) {
  console.log('decorator run')
}

@log
class User {}

new User()
new User()
```

`decorator run` 只会在 class 被定义时执行一次。

字段装饰器返回的初始化函数，才会在实例字段初始化时参与每个实例的初始化。

## 装饰器适合做什么

适合：

- 框架路由注册。
- 依赖注入。
- ORM 字段映射。
- 表单或 DTO 校验元数据。
- 方法日志、计时、权限检查。
- class 成员注册和元数据收集。

不适合：

- 普通业务流程控制。
- 简单函数复用。
- 为了减少一两行代码而隐藏逻辑。
- 团队不熟悉、工具链不稳定的项目。
- 需要很强可读性的核心业务逻辑。

## React、Vue、Angular、NestJS 中的差异

React 现代业务代码通常不需要装饰器。旧项目可能见到：

```typescript
@observer
class UserList extends React.Component {}
```

这是 MobX 或历史写法，不是 React 本身要求。

Vue 旧 class 风格可能见到：

```typescript
@Component
class UserPage extends Vue {}
```

现代 Vue 更推荐组合式 API 和 `<script setup>`。

Angular 和 NestJS 大量使用装饰器：

```typescript
@Component({
  selector: 'app-user',
  template: '<div></div>'
})
class UserComponent {}
```

```typescript
@Controller('/users')
class UserController {}
```

这类框架通常有明确的编译器、运行时和 metadata 约定。学习时要看框架文档，不要只按 TypeScript 语法本身推断。

## 排查装饰器问题

遇到装饰器报错，先问：

1. 当前项目用的是新版标准装饰器，还是 legacy decorators？
2. `experimentalDecorators` 是否开启？
3. 是否依赖 `emitDecoratorMetadata`？
4. 是否导入了 `reflect-metadata`？
5. 装饰器函数签名是 `(value, context)` 还是 `(target, key, descriptor)`？
6. 是否用了参数装饰器？
7. Babel、SWC、tsc 是否重复处理装饰器？
8. 框架版本是否支持当前 TypeScript 版本？

如果你看到类似：

```typescript
function deco(target: any, key: string, descriptor: PropertyDescriptor) {}
```

大概率是 legacy decorators。

如果你看到：

```typescript
function deco(value: unknown, context: ClassMethodDecoratorContext) {}
```

大概率是新版标准装饰器。

## 使用建议

- class 的访问修饰符可以用，但要区分编译期和运行时。
- enum 在业务中可以被字面量联合替代时，优先考虑字面量联合。
- namespace 主要用于老项目和声明文件。
- 类型注解优先写在函数、组件、API、class 等边界上，局部变量能推断就让 TS 推断。
- 装饰器不要脱离框架随意使用，配置成本和语义变化都较高。
- 新项目如果只是写普通前端业务，不建议主动引入装饰器。
- 如果项目依赖 Angular、NestJS、class-validator 等生态，优先遵循框架要求的 legacy decorators 配置。
