# static 静态成员与静态块

`static` 成员属于 class 构造函数对象本身，不属于实例。它常用于类级别工厂、注册表、常量、缓存和工具方法。

## 静态方法

```javascript
class User {
  static fromJSON(json) {
    const data = JSON.parse(json)
    return new User(data.name)
  }

  constructor(name) {
    this.name = name
  }
}

const user = User.fromJSON('{"name":"Ada"}')
```

`fromJSON` 在 `User` 上，不在实例上：

```javascript
console.log(typeof User.fromJSON) // 'function'
console.log(typeof user.fromJSON) // 'undefined'
```

## 静态字段

```javascript
class User {
  static defaultRole = 'member'
}

console.log(User.defaultRole) // 'member'
```

静态字段也是属性：

```javascript
console.log(Object.hasOwn(User, 'defaultRole')) // true
```

对比实例字段：

```javascript
class User {
  name = 'Ada'
  static age = 18
}

const user = new User()

console.log(user.name) // 'Ada'
console.log(User.age) // 18
console.log(user.age) // undefined
console.log(User.name) // 'User'
```

`name` 属于每个实例，`age` 属于 `User` 这个构造函数对象。这里的 `User.name` 是函数对象自带的类名属性，不是实例字段 `name`。

## 静态成员和实例成员可以同名

```javascript
class User {
  static nameLabel = 'User Class'
  nameLabel = 'User Instance'
}

const user = new User()

console.log(User.nameLabel) // 'User Class'
console.log(user.nameLabel) // 'User Instance'
```

它们位于不同对象上，不冲突。

同名字段也一样可以同时存在：

```javascript
class User {
  age = 16
  static age = 18
}

const user = new User()

console.log(user.age) // 16
console.log(User.age) // 18
```

这里不是重复定义同一个变量，而是在两个对象上定义了两个同名属性：

```text
user.age  -> 实例对象 user 自己的属性
User.age  -> 构造函数对象 User 自己的属性
```

所以 `static age` 不会覆盖 `age`，`age` 也不会覆盖 `static age`。

## 外部变量、静态字段和实例字段同名

class 外层变量也可以和静态字段、实例字段同名：

```javascript
let age = 20

class User {
  age = 16
  static age = 18

  getOuterAge() {
    return age
  }
}

const user = new User()

console.log(age) // 20
console.log(User.age) // 18
console.log(user.age) // 16
console.log(user.getOuterAge()) // 20
```

这三个 `age` 在三个不同位置：

| 写法 | 位置 | 访问方式 |
| --- | --- | --- |
| `let age = 20` | class 外层词法作用域 | `age` |
| `static age = 18` | 构造函数对象 `User` | `User.age` |
| `age = 16` | 每个实例对象 | `user.age` |

真正会覆盖的是“同一个位置上的同名属性”：

```javascript
class User {
  age = 16
  age = 17

  static count = 1
  static count = 2
}

const user = new User()

console.log(user.age) // 17
console.log(User.count) // 2
```

两个实例字段同名，后面的实例字段覆盖前面的实例字段。两个静态字段同名，后面的静态字段覆盖前面的静态字段。

## static this

静态方法里的 `this` 通常指调用该方法的构造函数：

```javascript
class Model {
  static create() {
    return new this()
  }
}

class User extends Model {}

const user = User.create()
console.log(user instanceof User) // true
```

这让静态工厂可以被子类复用。

## 静态继承

```javascript
class Base {
  static version = 1

  static getVersion() {
    return this.version
  }
}

class Sub extends Base {}

console.log(Sub.version) // 1
console.log(Sub.getVersion()) // 1
```

`extends` 会让：

```text
Object.getPrototypeOf(Sub) === Base
```

所以子类构造函数能通过静态原型链访问父类静态成员。

## 静态块

静态块用于 class 定义时执行一次初始化逻辑：

```javascript
class Registry {
  static items = new Map()

  static {
    Registry.items.set('default', { enabled: true })
  }
}
```

静态块特点：

- 在 class 定义求值时执行。
- 每个 class 执行一次。
- 可以访问私有静态成员。
- 可以使用多个静态块。
- 静态字段和静态块按源码顺序执行。

## 静态执行顺序

```javascript
class Demo {
  static a = console.log('a')

  static {
    console.log('block 1')
  }

  static b = console.log('b')

  static {
    console.log('block 2')
  }
}
```

输出：

```text
a
block 1
b
block 2
```

静态成员初始化发生在 class 定义阶段，不需要 `new Demo()`。

## 静态块适合什么

适合：

- 初始化注册表。
- 根据环境构造类级别缓存。
- 初始化私有静态字段。
- 对多个静态字段做一次性校验。

不适合：

- 发网络请求。
- 读写全局状态太多。
- 做和模块导入强耦合的复杂副作用。
- 让 class 定义本身变得昂贵或不可预测。

如果逻辑复杂，更推荐显式初始化方法：

```javascript
class SDK {
  static initialized = false

  static init(config) {
    this.initialized = true
    this.config = config
  }
}
```

## 静态成员和模块函数的取舍

不是所有工具方法都应该写成 static：

```javascript
class DateUtil {
  static format(date) {}
  static parse(input) {}
}
```

很多时候模块函数更简单：

```javascript
export function formatDate(date) {}
export function parseDate(input) {}
```

优先考虑模块函数，除非这些静态方法和 class 的实例、私有状态、继承关系或工厂语义强相关。
