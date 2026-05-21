# this 绑定、方法丢失与箭头字段

`this` 是前端使用 class 时最常见的问题来源。class 方法里的 `this` 不是定义时永久绑定的，而是由调用方式决定。

## 方法调用时 this 指向调用者

```javascript
class User {
  name = 'Ada'

  sayHi() {
    return this.name
  }
}

const user = new User()
console.log(user.sayHi()) // 'Ada'
```

调用形式是 `user.sayHi()`，所以 `this` 是 `user`。

## 方法引用会丢失 this

```javascript
const fn = user.sayHi
fn()
```

class 方法内部是严格模式，裸调用时 `this` 是 `undefined`，所以通常会抛：

```text
TypeError: Cannot read properties of undefined
```

这不是 class 特有问题，而是 JavaScript 方法调用规则。

## 常见丢失场景

```javascript
button.addEventListener('click', user.sayHi)
```

```javascript
setTimeout(user.sayHi, 1000)
```

```javascript
const { sayHi } = user
sayHi()
```

```javascript
items.map(user.format)
```

这些写法都把方法拿出来当普通函数传递，原本的接收者丢了。

## bind

```javascript
const fn = user.sayHi.bind(user)
fn()
```

在构造器中绑定：

```javascript
class User {
  constructor(name) {
    this.name = name
    this.sayHi = this.sayHi.bind(this)
  }

  sayHi() {
    return this.name
  }
}
```

优点：

- 方法主体仍然在原型上。
- 对外传递时 this 稳定。

代价：

- 每个实例都会创建一个绑定后的函数。
- 构造器里要显式维护。

## 箭头字段

```javascript
class User {
  name = 'Ada'

  sayHi = () => {
    return this.name
  }
}
```

箭头函数没有自己的 `this`，会捕获字段初始化时的 `this`，也就是当前实例。

传递时不会丢：

```javascript
const fn = user.sayHi
console.log(fn()) // 'Ada'
```

代价：

- `sayHi` 变成每个实例自己的属性。
- 不在 `User.prototype` 上。
- 每个实例创建一份函数，内存更多。
- 子类用 `super.sayHi()` 调不到这个箭头字段，因为它不是原型方法。

验证：

```javascript
class User {
  sayHi = () => 'hi'
}

const a = new User()
const b = new User()

console.log(a.sayHi === b.sayHi) // false
console.log(Object.hasOwn(a, 'sayHi')) // true
```

## 原型方法 vs 箭头字段

| 写法 | 位置 | this 是否自动绑定 | 是否可被 super 调用 | 每个实例是否创建新函数 |
| --- | --- | --- | --- | --- |
| `method() {}` | 原型 | 否 | 是 | 否 |
| `method = () => {}` | 实例 | 是 | 否 | 是 |
| 构造器里 `bind` | 实例覆盖原型方法 | 是 | 原型方法仍存在，但实例用绑定函数 | 是 |

## 事件处理中的选择

React class 组件旧写法：

```javascript
class Button {
  constructor() {
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.track(event)
  }
}
```

class fields 写法：

```javascript
class Button {
  handleClick = (event) => {
    this.track(event)
  }
}
```

现代代码中，如果大量实例、方法需要继承、或非常关注内存，优先用原型方法。若是 UI 事件处理器、实例数量有限、需要稳定传递回调，可以接受箭头字段。

## super 和箭头字段的冲突

```javascript
class Base {
  handle = () => {
    return 'base'
  }
}

class Sub extends Base {
  handle() {
    return super.handle()
  }
}
```

`super.handle()` 找的是 `Base.prototype.handle`，但 `handle` 是实例字段，不在原型上，所以找不到。

如果需要继承和重写，使用原型方法：

```javascript
class Base {
  handle() {
    return 'base'
  }
}

class Sub extends Base {
  handle() {
    return `sub -> ${super.handle()}`
  }
}
```

## 判断 this 问题的办法

遇到 `Cannot read properties of undefined`：

1. 看报错行是不是 class 方法里访问了 `this.xxx`。
2. 看这个方法是不是被当作回调传出去了。
3. 看调用点有没有保留 `obj.method()` 形式。
4. 需要稳定回调时，使用 `bind`、箭头包装或箭头字段。
5. 需要继承重写时，避免把核心方法写成箭头字段。

