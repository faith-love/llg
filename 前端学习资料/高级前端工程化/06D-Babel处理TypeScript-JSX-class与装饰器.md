# Babel 处理 TypeScript JSX class 与装饰器

Babel 经常同时处理 TypeScript、JSX、class fields 和 decorators。这里最容易混淆的是：Babel 可以擦除 TypeScript 类型并转换语法，但它不做完整类型检查。工程上通常需要 Babel 和 TypeScript Compiler 分工合作。

## Babel 和 tsc 分工

| 能力 | Babel | tsc |
| --- | --- | --- |
| TS 类型擦除 | 支持 | 支持 |
| 类型检查 | 不支持 | 支持 |
| 声明文件生成 | 不适合 | 支持 |
| JSX 转换 | 支持 | 支持 |
| Babel 插件生态 | 支持 | 不支持 |
| project references | 不负责 | 支持 |

常见组合：

```text
Babel/SWC/esbuild 负责快速转译
tsc --noEmit 负责类型检查
tsc --emitDeclarationOnly 负责库类型声明
```

## TypeScript 转换边界

Babel 处理 TS 时会删除类型：

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

输出接近：

```javascript
function add(a, b) {
  return a + b
}
```

这意味着类型错误不会被 Babel 发现，必须在 CI 中单独跑 `typecheck`。

## JSX 转换

JSX 可以转成不同运行时：

```typescript
const node = <Button type="primary" />
```

经典运行时会转成类似：

```javascript
React.createElement(Button, { type: 'primary' })
```

自动运行时会引入 `jsx` helper。React 17+ 项目通常使用自动运行时，但要保证 Babel、TypeScript、React 插件配置一致。

## class fields

class fields 的转换会影响初始化顺序和输出形态。

```typescript
class User {
  name = 'Ada'

  getName = () => this.name
}
```

箭头字段会变成实例属性，每个实例一份。原型方法则共享一份。组件中用箭头字段绑定 `this` 很方便，但大量实例会增加内存成本。

## decorators

装饰器最需要关注版本和顺序。

风险点：

- legacy decorators 和标准 decorators 语义不同。
- class fields 与 decorators 插件顺序敏感。
- TypeScript 的 `experimentalDecorators` 和 Babel 配置要对齐。
- 框架或老项目可能依赖旧语义。

工程上要明确：

```text
项目使用 legacy decorators 还是标准 decorators？
Babel 和 tsconfig 是否一致？
迁移是否会影响 MobX、Nest、Angular 或内部框架？
```

## React Fast Refresh

React 项目中 Babel 还可能负责开发期能力，例如 Fast Refresh。开发模式和生产模式插件不同：

| 模式 | 特点 |
| --- | --- |
| development | 保留调试信息、启用 refresh、sourcemap 更友好 |
| production | 删除开发代码、压缩、优化 JSX 输出 |

不要把开发插件带进生产构建。

## 落地清单

- CI 是否单独跑 `tsc --noEmit`？
- 库项目是否生成 `.d.ts`？
- Babel、tsconfig、React JSX runtime 是否一致？
- class fields 输出是否符合预期？
- decorators 使用 legacy 还是标准语义是否明确？
- 开发插件和生产插件是否分离？

