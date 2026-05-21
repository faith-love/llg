# class 不是传统类

JavaScript 的 `class` 是一种更严格、更清晰的对象创建语法，但它不是把 JavaScript 改造成了传统类语言。运行时仍然是：构造函数对象、原型对象、实例对象、原型链。

## class 的本质

```javascript
class User {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    return `Hi, ${this.name}`
  }
}
```

运行时可以观察到：

```javascript
console.log(typeof User) // 'function'
console.log(User.prototype.sayHi) // function
console.log(new User('Ada') instanceof User) // true
```

所以 class 不是一种独立于函数和对象之外的新实体。`User` 本身是一个函数对象，只是这个函数只能通过 `new` 调用。

## 和构造函数写法的对应关系

传统写法：

```javascript
function User(name) {
  this.name = name
}

User.prototype.sayHi = function () {
  return `Hi, ${this.name}`
}
```

class 写法：

```javascript
class User {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    return `Hi, ${this.name}`
  }
}
```

它们都创建了：

```text
User 函数对象
User.prototype 原型对象
通过 new User() 创建的实例对象
```

## class 不只是语法糖

说 `class` 是语法糖有一定道理，因为它简化了原型写法。但它又不只是普通语法糖，因为它带来了更严格的语义：

| 细节 | 构造函数写法 | class 写法 |
| --- | --- | --- |
| 是否能不加 `new` 调用 | 可以，除非手动检查 | 不可以，会抛 `TypeError` |
| 方法是否可枚举 | 手动赋值时默认可枚举 | class 方法默认不可枚举 |
| 代码是否严格模式 | 取决于外层 | class 体内部强制严格模式 |
| 继承父类构造 | 手动 `call` 和原型连接 | `extends` 和 `super` |
| 私有字段 | 只能约定或闭包模拟 | 支持 `#private` 真私有 |
| 字段初始化 | 通常写在构造器中 | 支持 class fields |
| 静态初始化 | 手动赋值 | 支持 static fields 和 static block |

## class 不能直接调用

```javascript
class User {}

User()
```

会抛错：

```text
TypeError: Class constructor User cannot be invoked without 'new'
```

这是 class 和普通函数构造器非常关键的区别。它避免了忘记 `new` 导致 `this` 指向错误或污染全局对象的问题。

## class 内部默认严格模式

```javascript
class User {
  sayHi() {
    console.log(this)
  }
}

const user = new User()
const fn = user.sayHi
fn() // undefined，不是 window
```

在浏览器普通脚本的非严格函数中，裸调用时 `this` 可能指向 `window`。class 方法内部是严格模式，裸调用时 `this` 是 `undefined`。

## 方法默认不可枚举

```javascript
class User {
  name = 'Ada'

  sayHi() {}
}

const user = new User()

console.log(Object.keys(user)) // ['name']
console.log(Object.keys(User.prototype)) // []
```

实例字段是实例自己的可枚举属性。class 方法在原型上，并且默认不可枚举。

## class 适合解决什么问题

适合：

- 需要多个实例共享一组行为。
- 需要明确表达领域对象，例如 `UserSession`、`HistoryStack`、`EventBus`、`CacheStore`。
- 需要封装内部状态，尤其是 `#private`。
- 需要继承浏览器或框架提供的基类，例如 `HTMLElement`、`Error`、某些 SDK 基类。
- 需要配合 TypeScript 的 `implements`、`abstract`、`override` 建立约束。

不一定适合：

- 只有一组纯函数工具。
- 只保存简单配置对象。
- 只为 React 业务组件复用逻辑，现代 React 更常用函数组件和 hooks。
- 需要灵活组合大量行为，组合和函数式封装往往比继承更清晰。

## 判断一个 class 写得是否合理

可以问这几个问题：

1. 它是否真的需要实例状态？
2. 普通方法是否需要共享在原型上？
3. 静态成员是否只是工具函数，能否放到模块函数里？
4. 继承是否表达了稳定的 `is-a` 关系？
5. 私有字段是否保护了真实不变量，而不是让测试和扩展更困难？
6. 对外 API 是否小而稳定，内部状态是否被清晰封装？

