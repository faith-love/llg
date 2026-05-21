# Babel 处理 TypeScript、JSX 和 React

Babel 常用于前端项目中处理 TypeScript 和 JSX。但要注意：Babel 处理 TypeScript 主要是移除类型语法，不负责类型检查。

## Babel 处理 TypeScript

配置：

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

输入：

```typescript
type User = {
  id: string
}

function getUser(id: string): User {
  return { id }
}
```

输出接近：

```javascript
function getUser(id) {
  return { id }
}
```

类型消失。

## 不做类型检查

下面代码有类型错误：

```typescript
const age: number = '18'
```

Babel 可能仍然能把它转成 JavaScript：

```javascript
const age = '18'
```

所以项目里需要单独跑：

```bash
tsc --noEmit
```

或使用框架/插件在构建中做类型检查。

## Babel 处理 JSX

配置：

```json
{
  "presets": ["@babel/preset-react"]
}
```

输入：

```javascript
const element = <button disabled>Save</button>
```

React 17+ automatic runtime 可能输出：

```javascript
import { jsx as _jsx } from 'react/jsx-runtime'

const element = _jsx('button', {
  disabled: true,
  children: 'Save'
})
```

classic runtime 可能输出：

```javascript
const element = React.createElement('button', { disabled: true }, 'Save')
```

## React runtime 配置

```json
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

automatic runtime 不需要每个 JSX 文件显式 `import React from 'react'`。

## TypeScript + React 常见组合

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ]
}
```

注意 preset 执行顺序是从后往前。配置顺序要跟工具链要求匹配。

## Babel 和 tsc 的选择

用 Babel 编译 TS 的优点：

- 转译快。
- 插件生态丰富。
- 和 JSX、proposal 语法处理统一。
- 适合 Webpack/Vite/Rollup pipeline。

不足：

- 不做类型检查。
- 不生成 `.d.ts`。
- 某些 TS 特有语法支持有限或语义不同。

库项目如果需要发布类型声明，仍然需要 `tsc` 或其他声明生成工具。

## 装饰器和 class fields

TypeScript、Babel、框架对 decorators 的语义要求可能不同。遇到装饰器时必须确认：

- 使用新版标准装饰器还是 legacy decorators。
- Babel 和 TypeScript 是否都在处理装饰器。
- 插件顺序是否正确。
- 框架是否依赖 metadata。

不要随便复制装饰器配置，尤其是 Angular、NestJS、MobX、class-validator 这类生态。
