# 继承、组合、mixin 与设计取舍

class 让继承变得容易，但容易不代表应该频繁继承。前端业务代码中，继承层级过深通常比重复几行逻辑更难维护。

## 继承适合表达稳定的 is-a 关系

```javascript
class AppError extends Error {}
class NetworkError extends AppError {}
```

这种关系比较稳定：

```text
NetworkError 是一种 AppError
AppError 是一种 Error
```

继承适合：

- 浏览器和平台要求，例如 `HTMLElement`。
- 错误类型层级，例如 `ValidationError extends Error`。
- SDK 或框架提供稳定基类。
- 抽象类和具体实现有明确契约。

## 继承不适合表达临时复用

不推荐：

```javascript
class FormWithRequestAndCacheAndPermission extends BaseForm {}
```

如果继承只是为了复用请求、缓存、权限、日志等横切能力，组合通常更清晰：

```javascript
class FormController {
  constructor({ request, cache, permission }) {
    this.request = request
    this.cache = cache
    this.permission = permission
  }
}
```

## 组合

组合是把能力作为对象传入或挂载，而不是从父类继承。

```javascript
class RequestClient {
  get(url) {}
}

class UserService {
  constructor(client) {
    this.client = client
  }

  getUser(id) {
    return this.client.get(`/users/${id}`)
  }
}
```

优点：

- 依赖更明确。
- 测试时容易替换。
- 不受单继承限制。
- 不容易产生脆弱的父子类耦合。

## mixin

mixin 是用函数生成子类：

```javascript
const Timestamped = (Base) =>
  class extends Base {
    createdAt = new Date()

    getCreatedAt() {
      return this.createdAt
    }
  }

class Model {}

class User extends Timestamped(Model) {}
```

mixin 适合给多个类添加相同能力，但要控制复杂度。

风险：

- 方法名冲突不明显。
- 多个 mixin 叠加后初始化顺序难读。
- 类型推导和调试栈可能变复杂。
- 隐式依赖会让类看起来比实际简单。

## trait 风格组合

很多时候可以用普通对象和函数组合：

```javascript
const canLog = {
  log(message) {
    console.log(`[${this.name}] ${message}`)
  }
}

class Service {
  name = 'service'
}

Object.assign(Service.prototype, canLog)
```

这种方式会直接修改原型，适合框架内部或受控工具，不建议业务代码滥用。

更清晰的是显式依赖：

```javascript
class Service {
  constructor(logger) {
    this.logger = logger
  }
}
```

## 继承层级不要太深

危险信号：

- 子类需要知道父类构造器的很多内部细节。
- 父类构造器调用可被子类覆盖的方法。
- 子类频繁覆盖父类方法，但又必须调用 `super`。
- 新需求需要插到继承链中间。
- 测试某个子类时必须初始化整条父类链。

如果出现这些信号，优先考虑组合、策略对象或模块函数。

## 设计 class 的公共 API

一个好的 class 应该有：

- 小而稳定的构造参数。
- 清晰的实例状态。
- 少量公共方法。
- 明确的生命周期。
- 必要的私有字段保护不变量。
- 少暴露可变内部对象。

不推荐：

```javascript
class Store {
  data = {}

  getData() {
    return this.data
  }
}
```

外部拿到 `data` 后可以随意改内部状态。

更稳妥：

```javascript
class Store {
  #data = {}

  getSnapshot() {
    return { ...this.#data }
  }

  update(patch) {
    this.#data = { ...this.#data, ...patch }
  }
}
```

## 决策清单

选择继承前先问：

1. 子类是否真的是父类的一种？
2. 父类 API 是否稳定？
3. 子类是否需要复用父类内部状态，而不仅是工具方法？
4. 未来是否可能出现多个方向的复用？
5. 组合是否能用更少耦合解决问题？
6. 测试子类时是否容易构造依赖？

如果答案不清晰，优先组合。

