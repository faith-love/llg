# 构建产物模块格式与 tree-shaking

库构建和应用构建不同。应用构建面向浏览器运行，库构建面向其他项目消费。库要考虑 ESM、CJS、类型声明、子路径导出、peer dependencies、tree-shaking、sideEffects 和兼容性。

## 常见产物

| 产物 | 用途 |
| --- | --- |
| ESM | 现代 bundler、tree-shaking |
| CJS | 老 Node 或老工具链 |
| UMD/IIFE | 浏览器 script 直引，越来越少 |
| `.d.ts` | TypeScript 类型 |
| CSS | 组件库样式 |

现代库通常优先 ESM，同时根据用户环境决定是否提供 CJS。

## package.json 关键字段

```json
{
  "name": "your-lib",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "sideEffects": false
}
```

`exports` 是正式入口声明。没有写进 `exports` 的路径，不应该承诺可被使用者引用。

## Tree-shaking 友好

要做到：

- 使用 ESM。
- 避免顶层副作用。
- 函数按需导出。
- 不把所有功能挂到一个巨大默认对象。
- 正确声明 `sideEffects`。

```typescript
// 推荐
export { createClient } from './createClient'
export { retryPlugin } from './plugins/retry'

// 不推荐
export default {
  createClient,
  retryPlugin,
  hugeFeature
}
```

## peerDependencies

如果库依赖 React、Vue 等宿主框架，通常放到 peerDependencies：

```json
{
  "peerDependencies": {
    "react": ">=18"
  }
}
```

否则可能把多份 React 打进消费者项目，导致上下文、hooks 或包体问题。

## external

库构建要把 peer 依赖排除：

```typescript
export default {
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react']
    }
  }
}
```

## Babel 和 TS

库构建常见分工：

```text
tsc 生成声明文件
Rollup/Vite 打包 ESM/CJS
Babel/SWC 处理语法兼容
```

不要用 Babel 替代类型检查和声明文件生成。

## 自检清单

- 是否输出 ESM 和类型声明？
- 是否真的需要 CJS？
- package exports 是否清晰？
- 是否避免顶层副作用？
- peer dependencies 是否正确 external？
- tree-shaking 是否通过示例项目验证？

## 知识点展开与对应练习

| 知识点 | 小点展开 | 对应练习 | 验收标准 |
| --- | --- | --- | --- |
| ESM | ESM 是现代 bundler tree-shaking 的基础 | 输出 `dist/index.js` ESM 产物 | 示例项目能 `import { createClient }` |
| CJS | 只有目标用户需要时才提供 CJS | 判断你的库是否需要 CJS | 写出需要或不需要的理由，不能只因为“别人都有” |
| exports | exports 决定正式可引用入口 | 配置 `.`、`./plugins/retry`、`./adapters/fetch` | 未声明路径无法被引用，声明路径都有 types |
| sideEffects | 无顶层副作用时可声明 false，CSS 或 polyfill 要例外 | 检查库入口副作用并配置 sideEffects | tree-shaking 不误删必要 CSS 或初始化代码 |
| peerDependencies | React/Vue 等宿主依赖不能打进库 | 为一个 React hooks 包配置 peerDependencies | 构建产物 external react |
| 子包拆分 | devtools、mock、adapter 等低频能力适合子路径 | 把 mock adapter 放到 `your-lib/adapters/mock` | 主入口不引入 mock 代码 |
| 构建验证 | 产物要用真实消费者项目验证 | 写一个 `examples/basic` 消费构建产物 | 能跑 ESM import、类型提示和 tree-shaking 检查 |
