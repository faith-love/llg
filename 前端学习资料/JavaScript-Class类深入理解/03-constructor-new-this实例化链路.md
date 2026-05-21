# constructor、new、this 与实例化链路

`constructor` 是 class 中最特殊的方法。它不是放在原型上的普通方法，而是 class 构造函数本身的初始化逻辑。理解 `new` 的执行过程，才能理解 `this`、字段初始化和继承。

## new 做了什么

执行：

```javascript
const user = new User('Ada')
```

大致步骤是：

1. 创建一个新对象。
2. 把新对象的 `[[Prototype]]` 指向 `User.prototype`。
3. 执行 `User` 的构造逻辑。
4. 在构造逻辑中把 `this` 绑定到新对象。
5. 初始化实例字段。
6. 如果构造器没有显式返回对象，则返回这个新对象。

可以粗略类比为：

```javascript
function fakeNew(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype)
  const result = Constructor.apply(instance, args)
  return result !== null && typeof result === 'object' ? result : instance
}
```

但这个类比不适用于真正的 class，因为 class 构造器不能用 `apply` 裸调用。它只是帮助理解普通构造函数的 `new` 过程。

## constructor 可以省略

```javascript
class User {}

const user = new User()
```

如果没有继承，默认构造器等价于：

```javascript
class User {
  constructor() {}
}
```

如果有继承：

```javascript
class Admin extends User {}
```

默认构造器等价于：

```javascript
class Admin extends User {
  constructor(...args) {
    super(...args)
  }
}
```

## constructor 中的 this

```javascript
class User {
  constructor(name) {
    this.name = name
  }
}
```

`this` 指向当前正在创建的实例。

不要把构造参数直接保存在闭包里再让方法读取，除非你有明确的封装目的。普通实例状态应该放在实例上或私有字段里。

## 外部变量和 this 实例属性

先看外部变量：

```javascript
let sharedName = 'Ada'

class User {
  constructor() {
    console.log(sharedName)
  }

  getName() {
    return sharedName
  }
}

const user1 = new User()
const user2 = new User()
```

`sharedName` 不属于 `user1`，也不属于 `user2`。它属于 class 外层的词法作用域：

```javascript
console.log(user1.sharedName) // undefined
console.log(Object.hasOwn(user1, 'sharedName')) // false
```

如果修改外部变量，所有读取这个外部变量的方法都会看到新值：

```javascript
sharedName = 'Grace'

console.log(user1.getName()) // 'Grace'
console.log(user2.getName()) // 'Grace'
```

再看 `this` 实例属性：

```javascript
class User {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

const user1 = new User('Ada')
const user2 = new User('Grace')

console.log(user1.name) // 'Ada'
console.log(user2.name) // 'Grace'
```

`this.name` 会挂到当前正在创建的实例上。每个实例都有自己的 `name`：

```javascript
console.log(Object.hasOwn(user1, 'name')) // true
console.log(Object.hasOwn(user2, 'name')) // true
```

所以两者的核心区别是：

| 写法 | 数据放在哪里 | 多个实例是否共享 | 外部能否通过实例访问 | 典型用途 |
| --- | --- | --- | --- | --- |
| `let name = 'Ada'` | class 外层作用域 | 是，同一个变量 | 不能用 `user.name` 访问 | 模块级配置、闭包状态、所有实例共享的计数 |
| `this.name = 'Ada'` | 当前实例对象 | 否，每个实例一份 | 可以用 `user.name` 访问 | 用户名、组件状态、请求实例配置 |

外部变量适合表达“这个模块或这个类共享的一份状态”：

```javascript
let nextId = 1

class User {
  constructor(name) {
    this.id = nextId++
    this.name = name
  }
}

console.log(new User('Ada').id) // 1
console.log(new User('Grace').id) // 2
```

`this` 属性适合表达“每个实例自己的状态”：

```javascript
class User {
  constructor(name) {
    this.name = name
  }
}
```

不要把本该属于每个实例的数据放到外部变量里：

```javascript
let name

class User {
  constructor(inputName) {
    name = inputName
  }

  getName() {
    return name
  }
}

const user1 = new User('Ada')
const user2 = new User('Grace')

console.log(user1.getName()) // 'Grace'
console.log(user2.getName()) // 'Grace'
```

这里 `user2` 把外部变量覆盖了，导致 `user1` 读到的也变成 `'Grace'`。如果数据属于实例，就应该写成 `this.name` 或 `#name`。

## constructor 可以返回对象

基础类构造器可以返回一个对象来替换默认实例：

```javascript
class User {
  constructor() {
    return { type: 'custom object' }
  }
}

console.log(new User()) // { type: 'custom object' }
```

但这会破坏实例和原型方法的关系：

```javascript
class User {
  constructor() {
    return {}
  }

  sayHi() {
    return 'hi'
  }
}

const user = new User()
console.log(user instanceof User) // false
console.log(typeof user.sayHi) // 'undefined'
```

业务代码里极少应该这么做。除非你在写非常底层的工厂或代理逻辑，否则不要在构造器中返回另一个对象。

## constructor 返回基本类型会被忽略

```javascript
class User {
  constructor() {
    return 1
  }
}

console.log(new User() instanceof User) // true
```

基础类构造器返回基本类型会被忽略，仍然返回默认实例。

派生类构造器规则更严格：返回值必须是对象或 `undefined`，返回基本类型会抛错。

## new.target

`new.target` 表示当前被 `new` 直接调用的构造函数：

```javascript
class Base {
  constructor() {
    console.log(new.target.name)
  }
}

class Sub extends Base {}

new Base() // 'Base'
new Sub() // 'Sub'
```

可以用它模拟运行时抽象类：

```javascript
class AbstractStore {
  constructor() {
    if (new.target === AbstractStore) {
      throw new TypeError('AbstractStore cannot be instantiated directly')
    }
  }
}
```

TypeScript 的 `abstract` 只在编译期限制。发布成 JavaScript 后，如果需要运行时保护，仍然要自己检查 `new.target`。

## 实例化顺序总览

基础类：

```javascript
class Base {
  field = console.log('field')

  constructor() {
    console.log('constructor')
  }
}

new Base()
```

输出顺序：

```text
field
constructor
```

派生类：

```javascript
class Base {
  constructor() {
    console.log('base constructor')
  }
}

class Sub extends Base {
  field = console.log('sub field')

  constructor() {
    console.log('before super')
    super()
    console.log('after super')
  }
}

new Sub()
```

输出顺序：

```text
before super
base constructor
sub field
after super
```

派生类必须先调用 `super()`，实例字段会在 `super()` 返回后初始化，然后继续执行子类构造器后面的语句。
