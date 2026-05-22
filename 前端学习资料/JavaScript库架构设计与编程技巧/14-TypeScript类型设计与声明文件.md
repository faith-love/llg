# TypeScript 类型设计与声明文件

对现代 JS 库来说，类型是 API 的一部分。好的类型能让使用者少查文档、少写断言、少传错参数；坏的类型会把复杂度转移给使用者，甚至让库看起来不可靠。

## 类型设计目标

- public API 类型稳定。
- 常用场景自动推断。
- 错误用法尽早报错。
- 高级场景可以显式泛型。
- 不把内部类型暴露给使用者。
- `.d.ts` 和实际运行时行为一致。

## Options 类型

```typescript
type ClientOptions = {
  baseURL?: string
  timeout?: number
  retry?: number | RetryOptions
  headers?: Record<string, string>
}
```

Options 类型要表达默认值和可选项。复杂配置可以拆小：

```typescript
type RetryOptions = {
  times: number
  delay?: (attempt: number) => number
}
```

## 泛型推断

请求 API 常用泛型：

```typescript
const user = await client.get<User>('/user/1')
```

也可以让 schema 推断类型：

```typescript
const user = await client.get('/user/1', {
  schema: userSchema
})
```

高级库设计要尽量让用户少写泛型，但在无法推断时允许显式指定。

## 联合类型表达状态

```typescript
type AsyncResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
```

这种类型比多个可选字段更安全：

```typescript
// 不推荐
type BadResult<T> = {
  loading?: boolean
  data?: T
  error?: Error
}
```

## 类型导出策略

应该导出：

- public options。
- public result。
- public error。
- plugin API 类型。
- adapter API 类型。

不应该导出：

- 内部归一化类型。
- 内部缓存结构。
- 内部临时上下文。

如果插件作者需要某些内部类型，说明它们已经变成扩展契约，要正式设计。

## 声明文件

库项目要生成 `.d.ts`：

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

同时在 `package.json` 中声明类型入口：

```json
{
  "types": "./dist/index.d.ts"
}
```

## 类型测试

类型也要测试。可以写：

```typescript
const result = client.get<User>('/users/1')

// 期望 result 是 Promise<User>
```

也可以用专门工具做 type test，确保版本升级后类型推断不退化。

## 自检清单

- public API 类型是否稳定？
- 常用场景是否能自动推断？
- 是否导出了插件和 adapter 所需类型？
- 是否误暴露内部类型？
- `.d.ts` 是否随构建产出？
- 类型测试是否覆盖关键 API？

## 知识点展开与对应练习

| 知识点 | 小点展开 | 对应练习 | 验收标准 |
| --- | --- | --- | --- |
| Options 类型 | 配置类型要表达可选项、默认值和扩展点 | 设计 `ClientOptions` 和 `RetryOptions` | 类型能限制 timeout 为 number，retry 可传 number 或对象 |
| 泛型推断 | 常用场景尽量自动推断，高级场景允许显式泛型 | 实现 `client.get<T>()` 类型 | `await client.get<User>()` 推断为 `User` |
| 联合状态 | 用 discriminated union 表达互斥状态 | 设计 `AsyncResult<T>` | switch status 时 TS 能收窄 data/error |
| 插件类型 | 插件 API 类型是生态契约 | 设计 `Plugin<Ctx>` 和 `PluginContext` | 插件能拿到受控 ctx，不能访问内部私有字段 |
| Adapter 类型 | adapter 是运行时边界，类型要稳定 | 设计 `Adapter` 输入输出 | fetchAdapter 和 mockAdapter 都能实现同一接口 |
| 声明文件 | `.d.ts` 必须和 public API 一致 | 配置 `tsc --emitDeclarationOnly` | dist 中存在 index.d.ts，示例项目能识别类型 |
| 类型测试 | 类型推断退化也是 breaking change | 写 5 个 type test | 覆盖 get 泛型、插件 options、错误类型、子路径导出、Result 收窄 |
| 内部类型 | 不误导使用者依赖内部实现类型 | 列出 public types 和 internal types | internal types 不从主入口导出 |
