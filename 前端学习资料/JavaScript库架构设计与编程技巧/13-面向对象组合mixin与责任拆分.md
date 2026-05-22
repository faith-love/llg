# 面向对象组合 mixin 与责任拆分

面向对象在库设计中仍然有价值，特别是需要实例、生命周期、内部状态和多方法协作时。但库设计应优先使用组合，而不是深继承。继承层级越深，越难维护和扩展。

## class 适合什么

适合：

- 有实例状态。
- 有生命周期。
- 方法共享同一组内部资源。
- 需要隐藏私有实现。
- 使用者需要创建多个独立实例。

示例：

```typescript
class Client {
  private disposed = false

  request(config: RequestConfig) {
    if (this.disposed) {
      throw new Error('client has been disposed')
    }
  }

  dispose() {
    this.disposed = true
  }
}
```

## 组合优先

不要用继承表达所有变化：

```text
BaseClient
  -> RetryClient
    -> CachedRetryClient
      -> LoggedCachedRetryClient
```

更推荐组合：

```typescript
createClient({
  plugins: [retry(), cache(), logger()]
})
```

组合让能力可以自由排列和替换。

## 私有边界

库内部可以使用 `private` 或闭包保护状态：

```typescript
function createCounter() {
  let count = 0

  return {
    inc() {
      count += 1
    },
    get() {
      return count
    }
  }
}
```

闭包适合轻量实例，class 适合更明确的原型方法和生命周期。

## mixin

mixin 可以复用一组方法，但要谨慎：

```typescript
type Constructor<T = {}> = new (...args: any[]) => T

function WithLogger<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(message: string) {
      console.log(message)
    }
  }
}
```

mixin 风险：

- 方法冲突。
- 类型复杂。
- 初始化顺序难懂。
- 调试栈不直观。

如果插件机制能解决，优先插件而不是 mixin。

## 责任拆分

一个类不要承担太多职责：

```text
Client
  RequestPipeline
  PluginContainer
  CacheStore
  Logger
  Adapter
```

`Client` 可以是门面，真正逻辑拆到小对象里。

## 自检清单

- class 是否真的需要实例状态？
- 是否可以用组合替代继承？
- 生命周期是否清晰？
- private 状态是否避免外部篡改？
- mixin 是否引入方法冲突和类型复杂度？
- 单个类是否承担了太多职责？

## 知识点展开与对应练习

| 知识点 | 小点展开 | 对应练习 | 验收标准 |
| --- | --- | --- | --- |
| class 适用场景 | 有实例状态、生命周期和多方法协作时适合 class | 用 class 实现 `Client` | 包含 request、use、dispose，且每个实例状态隔离 |
| 闭包实例 | 轻量状态可以用闭包隐藏内部变量 | 用闭包实现 `createCounterStore` | 外部不能直接改内部 count，只能通过 API |
| 组合优先 | 能力通过插件和组合对象叠加，不靠深继承 | 把 `CachedRetryClient` 改成 `plugins: [cache(), retry()]` | cache 和 retry 可以独立启用、关闭和测试 |
| 私有状态 | private 字段或闭包避免外部破坏不变量 | 给 `Client` 增加私有 `disposed` 状态 | 外部不能直接修改 disposed |
| mixin 风险 | mixin 会带来冲突、初始化顺序和类型复杂度 | 实现一个 logger mixin，再写出它的问题 | 至少指出方法冲突、类型推断、调试困难 3 个风险 |
| 门面模式 | 对外门面简单，内部拆成多个协作者 | 把 Client 拆成 Pipeline、PluginContainer、AdapterRunner | Client 只协调，不直接写完所有逻辑 |
| 责任边界 | 一个类一个主要职责，避免巨型类 | 审查一个 200 行类并拆分责任 | 至少拆成 3 个模块，每个模块职责一句话说清 |
