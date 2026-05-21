# 访问器、getter/setter 与计算属性名

class 支持访问器属性和计算属性名。访问器看起来像字段，实际是方法调用；计算属性名让成员名称可以由表达式决定。

## getter

```javascript
class User {
  firstName = 'Ada'
  lastName = 'Lovelace'

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const user = new User()
console.log(user.fullName) // 'Ada Lovelace'
```

读取 `user.fullName` 时会调用 getter。

## setter

```javascript
class User {
  firstName = ''
  lastName = ''

  set fullName(value) {
    const [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
  }
}

const user = new User()
user.fullName = 'Ada Lovelace'
```

赋值 `user.fullName = ...` 时会调用 setter。

## 访问器在原型上

```javascript
class User {
  get name() {
    return 'Ada'
  }
}

console.log(Object.getOwnPropertyDescriptor(User.prototype, 'name'))
```

典型描述符：

```text
{
  get: [Function: get name],
  set: undefined,
  enumerable: false,
  configurable: true
}
```

访问器默认也不可枚举。

## 字段会遮蔽原型访问器

```javascript
class Base {
  get value() {
    return 'base getter'
  }
}

class Sub extends Base {
  value = 'own field'
}

console.log(new Sub().value) // 'own field'
```

子类字段在实例上定义自有属性，会遮蔽父类原型上的 getter。

## 构造器赋值会触发 setter

```javascript
class Base {
  set value(v) {
    console.log('setter', v)
  }
}

class Sub extends Base {
  constructor() {
    super()
    this.value = 1
  }
}

new Sub() // setter 1
```

但公共字段初始化不会触发父类 setter：

```javascript
class Sub extends Base {
  value = 1
}

new Sub() // 不打印 setter
```

这是 class fields 的 Define 语义。

## getter 不应该有明显副作用

不推荐：

```javascript
class Store {
  get data() {
    this.loadCount += 1
    return fetch('/api/data')
  }
}
```

getter 看起来像普通读取。调用者通常不会预期它发请求、修改状态或触发昂贵计算。

推荐：

```javascript
class Store {
  get cachedData() {
    return this.cache
  }

  async loadData() {
    this.cache = await fetch('/api/data').then((res) => res.json())
  }
}
```

## 计算属性名

```javascript
const methodName = 'save'

class Store {
  [methodName]() {
    return 'saved'
  }
}

console.log(new Store().save()) // 'saved'
```

计算属性名也可以用于 getter、setter、静态成员：

```javascript
const key = 'version'

class SDK {
  static [key] = '1.0.0'

  get ['displayName']() {
    return 'SDK'
  }
}
```

## Symbol 成员

```javascript
class List {
  items = [1, 2, 3]

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]()
  }
}

console.log([...new List()]) // [1, 2, 3]
```

Symbol 成员常用于实现语言协议，例如迭代器、字符串标签、类型转换。

```javascript
class Money {
  constructor(value) {
    this.value = value
  }

  [Symbol.toPrimitive]() {
    return this.value
  }
}

console.log(Number(new Money(10))) // 10
```

## 访问器设计建议

适合 getter：

- 从已有状态派生出的轻量值。
- 兼容属性读取语义的计算值。
- 不改变对象状态。

适合 setter：

- 对赋值进行校验或归一化。
- 维护多个内部字段的一致性。

不适合访问器：

- 异步逻辑。
- 重副作用。
- 复杂业务流程。
- 会让调用者误以为只是普通字段读写的操作。

