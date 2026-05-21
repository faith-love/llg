# Babel 编译产物与兼容性

理解 class 的编译产物，可以帮你排查旧浏览器兼容、Babel loose 模式、TypeScript 编译目标和线上行为不一致问题。

## class 基础转译思路

源码：

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

转译后大致会变成：

```javascript
function User(name) {
  if (!(this instanceof User)) {
    throw new TypeError('Cannot call a class as a function')
  }

  this.name = name
}

Object.defineProperty(User.prototype, 'sayHi', {
  value: function sayHi() {
    return 'Hi, ' + this.name
  },
  enumerable: false,
  configurable: true,
  writable: true
})
```

重点：

- class 构造器不能裸调用，需要运行时检查模拟。
- 方法通过 `Object.defineProperty` 定义为不可枚举。
- 原型方法仍然共享。

不同工具版本的具体输出会不同，这里只看核心思路。

## 继承转译思路

源码：

```javascript
class Sub extends Base {}
```

转译时要做两件事：

```javascript
Object.setPrototypeOf(Sub.prototype, Base.prototype)
Object.setPrototypeOf(Sub, Base)
```

第一句建立实例方法继承。

第二句建立静态成员继承。

旧环境没有 `Object.setPrototypeOf` 时，工具链会使用 `__proto__` 或 helper 函数兜底。

## class fields 的 loose 差异

源码：

```javascript
class User {
  name = 'Ada'
}
```

符合标准的 Define 语义接近：

```javascript
Object.defineProperty(this, 'name', {
  value: 'Ada',
  enumerable: true,
  configurable: true,
  writable: true
})
```

loose 或旧编译模式可能接近：

```javascript
this.name = 'Ada'
```

差异主要体现在：

- 是否触发父类原型上的 setter。
- 和不可写属性、访问器属性冲突时行为不同。
- 字段初始化与继承覆盖的边界问题。

遇到“本地和线上 class fields 行为不同”，优先查 Babel、TypeScript、构建目标和 loose 配置。

## private 字段转译

源码：

```javascript
class User {
  #token = 'secret'

  getToken() {
    return this.#token
  }
}
```

旧环境中常被转译成 WeakMap 或 helper：

```javascript
const _token = new WeakMap()

class User {
  constructor() {
    _token.set(this, 'secret')
  }

  getToken() {
    return _token.get(this)
  }
}
```

这种转译会增加运行时代码和 helper，可能影响包体积与性能。现代目标环境如果已支持原生私有字段，可以减少转译。

## static block 转译

源码：

```javascript
class Registry {
  static items = new Map()

  static {
    Registry.items.set('default', true)
  }
}
```

转译通常会把静态初始化移动到 class 定义之后执行：

```javascript
class Registry {}
Registry.items = new Map()
Registry.items.set('default', true)
```

要注意静态初始化的执行时机：模块导入并执行到 class 定义时就会发生。

## source map 与调试

class 代码转译后，浏览器实际运行的是编译产物。调试时：

1. 优先打开 source map，定位回源码。
2. 如果行为和源码不一致，查看编译产物。
3. 检查字段初始化是否被转成赋值。
4. 检查私有字段是否被转成 WeakMap。
5. 检查继承 helper 是否正确处理内置类。

## 兼容性策略

项目里不要孤立看 class 语法支持，要整体看：

- 浏览器目标。
- Node.js 目标。
- TypeScript `target`。
- Babel preset-env 配置。
- 是否开启 loose。
- 是否转译 private fields 和 static block。
- 测试环境和生产环境是否使用同一套编译配置。

## 排查配置问题的提问

当 class 行为异常时，问这些问题：

1. 这段代码最终被哪些工具编译？
2. 生产环境和测试环境的编译目标是否一致？
3. class fields 是 Define 语义还是赋值语义？
4. 是否继承了内置类，例如 `Error`、`Array`、`HTMLElement`？
5. 是否使用了 decorators、private fields、static block 等较新的语法？
6. 报错发生在源码，还是编译 helper？

