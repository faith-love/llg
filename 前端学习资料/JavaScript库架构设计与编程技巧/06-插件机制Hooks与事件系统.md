# 插件机制 Hooks 与事件系统

插件机制让库在不修改核心代码的情况下扩展能力。它适合处理可选能力、生态能力和业务差异。但插件机制如果设计不好，会让执行顺序、副作用、错误归属和类型都变得混乱。

## 什么时候需要插件

适合插件化：

- 能力不是所有用户都需要。
- 扩展点有明确生命周期。
- 扩展逻辑可以和核心解耦。
- 第三方可以独立维护。
- 新能力不应该增加核心包体。

不适合插件化：

- 核心流程还没稳定。
- 扩展点没有边界。
- 插件需要随意读写内部状态。
- 插件之间强依赖顺序但没有机制表达。

## 插件基本结构

```typescript
type Plugin = {
  name: string
  setup(ctx: PluginContext): void
}

type PluginContext = {
  onRequest(fn: RequestHook): void
  onResponse(fn: ResponseHook): void
  onError(fn: ErrorHook): void
}
```

使用：

```typescript
createClient({
  plugins: [
    retryPlugin({ times: 2 }),
    loggerPlugin()
  ]
})
```

## Hook 类型

常见 hook：

| Hook | 语义 |
| --- | --- |
| `before` | 核心动作前，可修改输入 |
| `after` | 核心动作后，可读取结果 |
| `error` | 出错时处理或转换错误 |
| `resolve` | 解析配置或依赖 |
| `dispose` | 清理资源 |

Hook 要明确是否允许异步、是否允许修改数据、是否能中断流程。

## 事件系统

事件适合通知，不适合控制核心流程。

```typescript
emitter.on('request:start', (event) => {
  console.log(event.url)
})
```

事件设计要注意：

- 事件名稳定。
- payload 类型明确。
- 监听器错误如何处理。
- 是否支持 once/off。
- 是否会造成内存泄漏。

## 执行顺序

插件顺序必须可解释：

```text
plugins: [auth, retry, logger]
```

可以定义：

- 注册顺序执行。
- before 正序，after 逆序。
- 插件声明 `enforce: 'pre' | 'post'`。
- 插件声明依赖关系。

不要让顺序依赖只靠口头约定。

## 插件上下文要最小化

不要把内部所有对象都暴露给插件。

```typescript
// 不推荐
setup(internalEverything)

// 推荐
setup({
  hooks,
  logger,
  defineConfig,
  addAdapter
})
```

上下文越大，核心越难重构。

## 自检清单

- 插件解决的是可选能力还是核心能力？
- hook 是否定义了输入、输出、异步和错误语义？
- 插件顺序是否可预测？
- 插件能否清理副作用？
- 插件 API 是否版本化？
- 插件是否过度依赖内部状态？

## 知识点展开与对应练习

| 知识点 | 小点展开 | 对应练习 | 验收标准 |
| --- | --- | --- | --- |
| 插件准入 | 插件适合可选能力，不适合未稳定的核心流程 | 判断 retry、logger、auth、cache、core request 是否应做成插件 | 每个能力都说明进 core、plugin 还是不做 |
| 插件结构 | 插件至少要有 name 和 setup，复杂插件要有 options 和版本 | 实现 `loggerPlugin(options)` | 插件有 name，能在 request/response/error 阶段打印信息 |
| Hook 语义 | hook 要明确能否异步、能否修改输入、能否中断流程 | 设计 `onRequest`、`onResponse`、`onError` 类型 | 每个 hook 都写明输入、输出、是否允许抛错 |
| 事件系统 | 事件适合通知，不适合控制核心流程 | 实现一个 `Emitter`，支持 `on/off/once/emit` | listener 能取消，once 只触发一次，listener 抛错不影响其他 listener |
| 执行顺序 | 插件顺序要可预测，before/after 可以有正序和逆序规则 | 给 auth、retry、logger 设计执行顺序 | 能解释为什么 auth 在 request 前、logger 在 response 后 |
| 插件上下文 | context 暴露越少越好，只给插件必要能力 | 设计 `PluginContext` 最小接口 | 插件不能直接访问内部 cache Map，只能通过公开方法 |
| 清理机制 | 插件可能注册定时器、监听器、缓存，需要 dispose | 给插件 setup 返回 cleanup 函数 | client.dispose 后插件副作用全部清理 |
