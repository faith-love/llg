# TypeScript 中的 class

TypeScript 给 class 加了类型系统、访问修饰符、抽象类、接口实现、参数属性和初始化检查。但要记住：TypeScript 的大多数修饰符是编译期约束，不等于 JavaScript 运行时语义。

## public、private、protected

```typescript
class User {
  public name: string
  private token: string
  protected role: string

  constructor(name: string, token: string) {
    this.name = name
    this.token = token
    this.role = 'member'
  }
}
```

含义：

- `public`：默认值，类内外都能访问。
- `private`：只允许当前类内部访问。
- `protected`：当前类和子类内部可访问。

这些是 TypeScript 类型检查规则。编译成 JavaScript 后，普通 `private token` 通常仍然是普通属性。

## TS private vs JS #private

TypeScript `private`：

```typescript
class User {
  private token = 'secret'
}
```

JavaScript `#private`：

```typescript
class User {
  #token = 'secret'
}
```

区别：

| 能力 | TS `private` | JS `#private` |
| --- | --- | --- |
| 编译期限制 | 是 | 是 |
| 运行时真私有 | 否 | 是 |
| 能否通过字符串属性访问 | 编译后通常可以 | 不可以 |
| 子类能否访问 | 不可以 | 不可以 |
| 是否影响结构类型兼容 | 是 | 是，且有运行时品牌 |

如果你需要运行时保护，用 `#private`。如果只需要类型层面的封装，TS `private` 更容易和现有工具链、测试、序列化配合。

## readonly

```typescript
class User {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
```

`readonly` 限制 TypeScript 代码里重新赋值：

```typescript
const user = new User('1')
user.id = '2' // 类型错误
```

它不是深度不可变，也不是运行时冻结。

## 参数属性

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

参数属性适合简单值对象，但构造参数很多时会降低可读性。

## strictPropertyInitialization

```typescript
class User {
  name: string
}
```

开启严格属性初始化时会报错，因为 `name` 没有明确初始化。

修复方式：

```typescript
class User {
  name = ''
}
```

或：

```typescript
class User {
  constructor(public name: string) {}
}
```

或使用明确赋值断言：

```typescript
class User {
  name!: string
}
```

`!` 只是告诉 TypeScript “我会负责初始化”，运行时不会帮你赋值。不要滥用。

## implements

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    return null
  }
}
```

`implements` 检查实例侧结构，不检查静态侧。

```typescript
interface HasCreate {
  create(): unknown
}

class User implements HasCreate {
  static create() {
    return new User()
  }
}
```

这不能通过，因为 `implements` 要求实例上有 `create`，不是构造函数上有。

## abstract

```typescript
abstract class Store {
  abstract get(key: string): unknown

  has(key: string) {
    return this.get(key) !== undefined
  }
}

class MemoryStore extends Store {
  get(key: string) {
    return undefined
  }
}
```

`abstract` 不能直接实例化，但这是编译期限制。发布成 JavaScript 后，如果外部绕过类型系统，运行时仍可能调用。需要运行时保护时使用 `new.target` 检查。

## override

```typescript
class Base {
  save() {}
}

class User extends Base {
  override save() {}
}
```

`override` 能防止你以为自己覆盖了父类方法，实际父类没有这个方法或名字写错。

建议开启 `noImplicitOverride`，让覆盖关系更明确。

## this 类型

```typescript
class QueryBuilder {
  where(): this {
    return this
  }

  limit(): this {
    return this
  }
}

class UserQueryBuilder extends QueryBuilder {
  byName(): this {
    return this
  }
}

new UserQueryBuilder().where().byName().limit()
```

返回 `this` 类型能让链式调用保留子类类型。

## useDefineForClassFields

TypeScript 的 class fields 编译行为曾经和 JavaScript 标准存在差异。现代项目通常应使用符合标准的 Define 语义。

关键差异：

```typescript
class Base {
  set value(v: number) {
    console.log('setter', v)
  }
}

class Sub extends Base {
  value = 1
}
```

标准语义下，字段定义不会触发父类 setter。旧的赋值语义可能会触发 setter。

如果你在升级 TypeScript、Babel 或构建配置后发现字段覆盖、setter、继承行为变化，要重点检查这一类问题。

## declare 字段

```typescript
class User {
  declare name: string
}
```

`declare` 表示只给类型系统声明，不生成运行时代码。它适合告诉 TypeScript 某个字段会由外部框架、装饰器或反序列化过程提供。

不要用 `declare` 掩盖真实初始化问题。运行时没有这个属性时，读取仍然是 `undefined`。

