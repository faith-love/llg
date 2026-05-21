# private 字段、方法与访问器

`#private` 是 JavaScript class 中真正的私有成员。它不是命名约定，不是下划线，也不是 Symbol，而是语言层面的私有槽和品牌检查。

## 私有字段

```javascript
class Counter {
  #count = 0

  inc() {
    this.#count += 1
  }

  getCount() {
    return this.#count
  }
}

const counter = new Counter()
counter.inc()
console.log(counter.getCount()) // 1
```

类外不能访问：

```javascript
counter.#count
```

这是语法错误，不是运行时返回 `undefined`。

## 私有字段不是普通属性

```javascript
class User {
  #token = 'secret'
  name = 'Ada'
}

const user = new User()

console.log(Object.keys(user)) // ['name']
console.log(Reflect.ownKeys(user)) // ['name']
console.log(user['#token']) // undefined
```

`#token` 不在普通属性键集合里。它不是字符串属性，也不是 Symbol 属性。

## 私有品牌检查

一个对象只有经过对应 class 初始化，才拥有该 class 的私有品牌。

```javascript
class User {
  #token = 'secret'

  readTokenFrom(obj) {
    return obj.#token
  }
}

const user = new User()
console.log(user.readTokenFrom(user)) // 'secret'
console.log(user.readTokenFrom({})) // TypeError
```

访问没有私有品牌的对象会抛 `TypeError`。

## 使用 #x in obj 检查品牌

```javascript
class User {
  #token

  static hasTokenSlot(obj) {
    return #token in obj
  }
}

console.log(User.hasTokenSlot(new User())) // true
console.log(User.hasTokenSlot({})) // false
```

这不是检查普通属性，而是检查对象是否拥有该私有字段的品牌。

## 私有方法

```javascript
class Parser {
  parse(input) {
    return this.#trim(input)
  }

  #trim(input) {
    return input.trim()
  }
}
```

私有方法适合放内部算法步骤，避免暴露成公共 API。

## 私有访问器

```javascript
class User {
  #firstName = 'Ada'
  #lastName = 'Lovelace'

  get #fullName() {
    return `${this.#firstName} ${this.#lastName}`
  }

  displayName() {
    return this.#fullName
  }
}
```

私有访问器也只能在类体内部访问。

## 静态私有成员

```javascript
class Config {
  static #env = 'prod'

  static getEnv() {
    return Config.#env
  }
}
```

静态私有成员属于构造函数对象，不属于实例。

更利于继承的写法要谨慎。静态私有字段不会自动变成每个子类独立一份：

```javascript
class Base {
  static #value = 1

  static getValue() {
    return this.#value
  }
}

class Sub extends Base {}

Sub.getValue() // TypeError
```

原因是 `#value` 私有品牌在 `Base` 构造函数对象上，不在 `Sub` 上。静态私有成员和继承组合时要特别小心。

## 私有字段和 WeakMap 的区别

早期常用 WeakMap 模拟私有状态：

```javascript
const state = new WeakMap()

class User {
  constructor(token) {
    state.set(this, { token })
  }

  getToken() {
    return state.get(this).token
  }
}
```

`#private` 的优点：

- 语法更直接。
- 引擎可以做更明确的优化。
- 类外无法通过闭包外泄访问。
- 访问不存在的私有字段会明确报错。

WeakMap 的优点：

- 可以跨多个 helper 函数共享内部状态。
- 可以在不使用 class fields 的环境中兼容旧代码。
- 可以把私有状态定义在模块级别，对多个类协作开放。

现代代码优先使用 `#private`，兼容旧环境或需要特殊共享时再考虑 WeakMap。

## 不要滥用私有

适合私有化：

- 不变量必须被保护，例如连接状态、缓存内部结构、解析游标。
- 暴露后会让外部形成错误依赖。
- 修改内部实现时不希望影响调用方。

不适合私有化：

- 只是为了“看起来更封装”。
- 测试和扩展确实需要读取的业务状态。
- 需要被子类访问的状态，这种情况可以考虑受保护约定、组合对象或 TypeScript `protected`。

