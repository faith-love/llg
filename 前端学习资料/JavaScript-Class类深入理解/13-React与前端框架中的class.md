# React 与前端框架中的 class

现代前端业务通常更偏函数组件和组合式 API，但 class 仍然经常出现在旧 React 项目、组件库、SDK、状态管理工具、Web Components 和错误边界中。理解 class 能帮助你维护旧代码，也能读懂框架内部抽象。

## React class 组件基本结构

```javascript
class Counter extends React.Component {
  state = {
    count: 0
  }

  render() {
    return React.createElement('button', null, this.state.count)
  }
}
```

关键点：

- `Counter` 继承 `React.Component`。
- `state` 是实例字段。
- `render` 是原型方法。
- React 创建组件实例，并按生命周期调用实例方法。

## 事件处理 this

老写法：

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 })
  }
}
```

class fields 写法：

```javascript
class Counter extends React.Component {
  state = { count: 0 }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }
}
```

第二种写法解决了事件回调传递时 `this` 丢失的问题，但 `handleClick` 会变成每个实例自己的函数。

## props 和 super(props)

```javascript
class UserCard extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }
}
```

在构造器里需要访问 `this.props` 时，应调用 `super(props)`。如果构造器里不访问 `this.props`，很多项目也会保持传入 `props` 的写法以减少误解。

现代代码能不用构造器就不用：

```javascript
class UserCard extends React.Component {
  state = {
    collapsed: false
  }
}
```

## 生命周期方法是原型方法

```javascript
class Page extends React.Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {}
}
```

这些方法由 React 调用。它们不需要你手动绑定，因为 React 以实例方法形式调用它们。

事件处理函数不同，它们经常被你传给 DOM 或子组件，所以容易丢失 `this`。

## setState 不要直接依赖旧 state

不稳妥：

```javascript
this.setState({
  count: this.state.count + 1
})
```

更稳妥：

```javascript
this.setState((prevState) => ({
  count: prevState.count + 1
}))
```

这是 React 状态更新语义，不是 class 语法本身，但 class 组件中非常常见。

## Error Boundary

很多项目仍用 class 写错误边界：

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', null, 'Something went wrong')
    }

    return this.props.children
  }
}
```

这里同时出现了：

- 静态生命周期方法。
- 实例状态字段。
- 实例生命周期方法。
- `render` 原型方法。

## Vue、Angular 和装饰器风格

一些框架或历史项目会出现 class + decorator 风格：

```typescript
@Component
class UserStore {
  users: User[] = []

  async load() {}
}
```

或者：

```typescript
class UserComponent {
  title = 'Users'
}
```

要注意：

- 装饰器经常依赖 TypeScript 或 Babel 转译。
- 装饰器改变的是类、字段或方法的元信息和初始化方式。
- 不同版本工具链的装饰器语义可能不同。
- 调试时要看编译产物或框架文档，而不是只看源码表面。

## TypeScript 注解和装饰器的边界

在 class 风格框架代码里，容易把“类型注解”和“装饰器”混在一起：

```typescript
@Controller('/users')
class UserController {
  constructor(private service: UserService) {}

  @Get('/:id')
  getUser(id: string): Promise<User> {
    return this.service.getUser(id)
  }
}
```

这里分两类看：

| 代码 | 类型 | 运行时是否保留 |
| --- | --- | --- |
| `private service: UserService` | TypeScript 类型注解和参数属性 | `private` 访问控制和 `UserService` 类型主要是编译期信息 |
| `id: string` | TypeScript 类型注解 | 编译后消失 |
| `Promise<User>` | TypeScript 返回值注解 | 编译后消失 |
| `@Controller('/users')` | 装饰器 | 会参与编译输出和运行时框架注册 |
| `@Get('/:id')` | 装饰器 | 会参与编译输出和运行时路由注册 |

一句话：类型注解用于编译期检查，装饰器用于给 class 或成员附加运行时行为或元数据。

装饰器还有两套语义要区分：

- TypeScript 5+ 的新版标准装饰器：函数签名通常是 `(value, context)`。
- TypeScript 早期的 legacy decorators：函数签名通常是 `(target, key, descriptor)`，Angular、NestJS、class-validator 等生态中很常见。

如果你在读框架源码或旧项目，先确认项目的 `tsconfig` 是否开启了 `experimentalDecorators` 和 `emitDecoratorMetadata`。详细规则见 [TypeScript 的 class、类型注解与装饰器](../TypeScript深入理解/14-class枚举命名空间与装饰器.md)。

## Web Components

Web Components 是现代前端中 class 非常自然的使用场景：

```javascript
class UserCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<span>User</span>'
  }
}

customElements.define('user-card', UserCard)
```

浏览器要求自定义元素继承 `HTMLElement`，并通过 `customElements.define` 注册。

常见生命周期：

- `connectedCallback`
- `disconnectedCallback`
- `attributeChangedCallback`
- `adoptedCallback`

## 前端工程里的 class 常见用途

适合用 class：

- SDK 客户端：`new APIClient(config)`。
- 状态机：`new StateMachine(definition)`。
- 缓存容器：`new LRUCache(options)`。
- 命令模式：`class UndoCommand`。
- Web Components。
- 错误类型：`class RequestError extends Error`。

不一定适合用 class：

- 纯 UI 业务组件的新代码。
- 无状态工具函数。
- 简单数据映射。
- 只为了模拟命名空间的 static 工具类。
