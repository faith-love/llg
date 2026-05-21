# extends、继承、super 与派生类构造

`extends` 是 class 中最复杂的部分。它不只是让实例能访问父类方法，还会建立子类构造函数和父类构造函数之间的静态继承链。

## extends 建立两条链

```javascript
class Base {
  static type = 'base'

  baseMethod() {
    return 'base'
  }
}

class Sub extends Base {}
```

两条链：

```javascript
console.log(Object.getPrototypeOf(Sub) === Base) // true
console.log(Object.getPrototypeOf(Sub.prototype) === Base.prototype) // true
```

第一条让 `Sub` 能访问 `Base` 的静态成员。

第二条让 `new Sub()` 能访问 `Base.prototype` 上的方法。

## super() 做什么

在派生类构造器中，必须先调用 `super()` 才能使用 `this`：

```javascript
class Base {
  constructor(name) {
    this.name = name
  }
}

class User extends Base {
  constructor(name, role) {
    super(name)
    this.role = role
  }
}
```

`super(name)` 调用父类构造器，并完成派生类实例的基础初始化。

错误写法：

```javascript
class User extends Base {
  constructor(name) {
    this.name = name
    super(name)
  }
}
```

会抛：

```text
ReferenceError: Must call super constructor before accessing 'this'
```

## 为什么派生类不能先用 this

派生类实例的创建由父类构造器参与完成。调用 `super()` 前，`this` 还没有被绑定到当前构造过程。

这和普通子类手动调用父类构造函数不同。class 的派生构造器有更严格的初始化规则。

## 继承里外部变量和 this 的区别

外部变量不需要 `super()` 就能访问，因为它不依赖当前实例：

```javascript
let defaultRole = 'member'

class Base {
  constructor() {
    console.log(defaultRole)
  }
}

class User extends Base {
  constructor(name) {
    console.log(defaultRole) // 可以访问外部变量
    super()
    this.name = name // 必须在 super() 之后
  }
}
```

但 `this.name` 是在给当前实例写属性。派生类里只要碰 `this`，就必须先 `super()`。

外部变量通常被所有实例共享：

```javascript
let role = 'member'

class User extends Base {
  getRole() {
    return role
  }
}

const user1 = new User()
const user2 = new User()

role = 'admin'

console.log(user1.getRole()) // 'admin'
console.log(user2.getRole()) // 'admin'
```

`this` 属性属于每个实例：

```javascript
class User extends Base {
  constructor(name, role) {
    super()
    this.name = name
    this.role = role
  }
}

const user1 = new User('Ada', 'member')
const user2 = new User('Grace', 'admin')

console.log(user1.role) // 'member'
console.log(user2.role) // 'admin'
```

一句话：外部变量是词法作用域里的共享数据；`this.xxx` 是当前实例上的数据。继承只改变 `this` 的初始化规则，不改变外部变量的作用域规则。

## 同名的外部变量、static 字段和实例字段

外部变量、静态字段、实例字段即使同名，也可以同时存在，因为它们不在同一个位置：

```javascript
let role = 'outer'

class User extends Base {
  role = 'instance'
  static role = 'static'

  constructor() {
    super()
    console.log(role) // 'outer'
    console.log(this.role) // 'instance'
    console.log(User.role) // 'static'
  }
}

const user = new User()

console.log(role) // 'outer'
console.log(user.role) // 'instance'
console.log(User.role) // 'static'
```

判断规则：

| 表达式 | 查找位置 |
| --- | --- |
| `role` | 当前词法作用域，然后逐级向外找 |
| `this.role` | 当前实例对象，以及实例原型链 |
| `User.role` | `User` 构造函数对象，以及静态继承链 |

所以它们不是同一个变量。只有在同一个对象上写同名属性时，才会发生覆盖。

## super() 只能调用一次

```javascript
class Sub extends Base {
  constructor() {
    super()
    super()
  }
}
```

重复调用 `super()` 会抛错。一个实例不能被初始化两次。

## super.method()

```javascript
class Base {
  save() {
    return 'base save'
  }
}

class User extends Base {
  save() {
    return `user -> ${super.save()}`
  }
}

console.log(new User().save()) // 'user -> base save'
```

`super.save()` 会从父类原型上找 `save`，并以当前实例作为 `this` 调用。

```javascript
class Base {
  save() {
    return this.name
  }
}

class User extends Base {
  name = 'Ada'

  save() {
    return super.save()
  }
}

console.log(new User().save()) // 'Ada'
```

方法来自父类，但 `this` 仍然是子类实例。

## 静态方法中的 super

```javascript
class Base {
  static create() {
    return new this()
  }
}

class User extends Base {
  static createNamed(name) {
    const user = super.create()
    user.name = name
    return user
  }
}
```

静态方法里的 `super` 指向父类构造函数对象。

## 字段覆盖父类构造器设置的值

```javascript
class Base {
  constructor() {
    this.name = 'from base'
  }
}

class User extends Base {
  name = 'from field'
}

console.log(new User().name) // 'from field'
```

顺序是：

1. 子类调用 `super()`。
2. 父类构造器设置 `this.name = 'from base'`。
3. 子类实例字段初始化，设置 `name = 'from field'`。

字段会覆盖父类构造器里写的同名属性。

## 父类构造器调用可覆盖方法的风险

```javascript
class Base {
  constructor() {
    this.init()
  }

  init() {}
}

class User extends Base {
  name = 'Ada'

  init() {
    console.log(this.name)
  }
}

new User() // undefined
```

父类构造器调用 `this.init()` 时，动态分派到了子类方法。但此时子类字段还没有初始化，所以 `this.name` 是 `undefined`。

实践建议：父类构造器里不要调用可能被子类覆盖的方法。改成显式初始化：

```javascript
const user = new User()
user.init()
```

或者让父类构造器只处理父类自己的状态。

## 继承内置类

class 可以继承内置类：

```javascript
class AppError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}
```

继承 `Error` 时通常要设置 `name`，并在 TypeScript 或转译到旧环境时特别注意原型链兼容性。

也可以继承 DOM 类：

```javascript
class MyButton extends HTMLElement {
  connectedCallback() {
    this.textContent = 'Click'
  }
}

customElements.define('my-button', MyButton)
```

这种场景下必须使用 class，因为自定义元素要求构造器和原型链符合浏览器规范。
