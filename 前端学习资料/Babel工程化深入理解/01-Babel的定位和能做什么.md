# Babel 的定位和能做什么

Babel 是 JavaScript 编译器。它最核心的能力是把一种 JavaScript 语法形态转换成另一种 JavaScript 语法形态。

## Babel 可以做什么

### 语法降级

把较新的语法转成旧环境能理解的语法：

```javascript
const list = [1, 2, 3]
const doubled = list.map((item) => item * 2)
```

可能被转换成：

```javascript
var list = [1, 2, 3]
var doubled = list.map(function (item) {
  return item * 2
})
```

### JSX 转换

```javascript
const element = <Button disabled>Save</Button>
```

可以转换成 React runtime 调用。

### TypeScript 语法擦除

```typescript
function add(a: number, b: number): number {
  return a + b
}
```

Babel 可以移除类型标注，输出 JavaScript：

```javascript
function add(a, b) {
  return a + b
}
```

但 Babel 不做 TypeScript 类型检查。

### 插件化代码改写

例如：

- 删除调试代码。
- 注入埋点。
- 转换 import。
- 编译 class properties。
- 处理 decorators。
- 做框架专用语法转换。

## Babel 不能直接做什么

Babel 默认不负责：

- 打包多个模块成一个或多个 bundle。
- 分析 CSS、图片、字体资源。
- 生成 HTML。
- 计算 chunk hash。
- 管理开发服务器。
- 做完整 TypeScript 类型检查。
- 自动校验接口数据。
- 自动优化所有运行时性能问题。

这些通常交给 bundler、TypeScript、测试工具、运行时校验库。

## Babel 在构建链路中的位置

Webpack 中：

```text
webpack entry -> module graph -> babel-loader 转换 JS/TS/JSX -> chunk -> output
```

Rollup 中：

```text
rollup input -> plugin resolve/load/transform -> babel plugin 转换 -> tree-shaking -> output
```

Vite 中：

```text
dev: 原生 ESM + esbuild 快速转译 + 插件
build: 构建工具编排 -> transform -> bundle -> output
```

Babel 通常出现在“对单个模块做 transform”的位置。

## Babel 和 TypeScript 的关系

两种常见方案：

```text
tsc 做类型检查，Babel 做转译
```

或：

```text
tsc 同时做类型检查和编译输出
```

现代 React/Vite/Webpack 项目常见第一种：Babel 或 esbuild/SWC 负责快转译，`tsc --noEmit` 负责类型检查。

## Babel 和 polyfill 的关系

Babel 能转换语法，但 API 兼容是另一回事。

语法：

```javascript
const fn = () => {}
```

可以被 Babel 转换。

API：

```javascript
Promise.resolve()
Array.from()
```

旧环境没有这些 API 时，需要 polyfill，例如 `core-js`。Babel 可以根据配置帮你注入 polyfill 引用，但 polyfill 本身不是 Babel 内置魔法。

## 一句话判断

如果问题是“这段新语法旧浏览器解析不了”，优先看 Babel。

如果问题是“这个方法旧浏览器没有”，优先看 polyfill。

如果问题是“多个文件怎么合成产物”，优先看 bundler。

如果问题是“类型为什么没报错”，优先看 TypeScript 类型检查。
