# tree-shaking、sideEffects 与模块格式

tree-shaking 是删除未使用代码的过程。它依赖静态分析，不是魔法。

## 基本例子

```javascript
// math.js
export function add(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

只使用：

```javascript
import { add } from './math'

console.log(add(1, 2))
```

理想情况下，`multiply` 可以从生产产物中删除。

## 为什么 ESM 更利于 tree-shaking

ESM 是静态结构：

```javascript
import { add } from './math'
export { add }
```

打包器能在编译期知道导入和导出关系。

CommonJS 更动态：

```javascript
const name = getName()
const mod = require(name)
```

这类写法难以静态分析。

## Babel modules 配置影响 tree-shaking

如果 Babel 太早把 ESM 转成 CommonJS：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": "commonjs"
    }]
  ]
}
```

打包器 tree-shaking 可能变差。

前端应用构建通常推荐：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }]
  ]
}
```

让 bundler 处理模块。

## sideEffects

`package.json`：

```json
{
  "sideEffects": false
}
```

表示模块没有副作用，未使用代码可以更大胆删除。

如果有 CSS 或副作用文件：

```json
{
  "sideEffects": [
    "*.css",
    "./src/polyfills.ts"
  ]
}
```

## 什么是副作用

有副作用：

```javascript
console.log('init')
window.app = {}
import './style.css'
Array.prototype.foo = function () {}
```

无副作用或较纯：

```javascript
export function add(a, b) {
  return a + b
}
```

## tree-shaking 失败原因

常见原因：

- 使用 CommonJS。
- Babel 把 ESM 转成 CommonJS。
- 依赖包没有 ESM 产物。
- 代码有顶层副作用。
- `sideEffects` 配置不准确。
- 动态访问对象属性。
- 重新导出方式过于复杂。
- minifier 没有开启。

## barrel file 风险

```javascript
export * from './Button'
export * from './Modal'
export * from './Table'
```

如果这些模块有副作用，或者构建工具分析不充分，可能导致引入过多代码。

组件库要特别关注入口设计。

## pure 标注

```javascript
const value = /*#__PURE__*/ createExpensiveObject()
```

minifier 可以根据 pure 标注删除未使用调用。

但不要乱标。被标注的调用如果有副作用，删除后会改变行为。

## 检查方法

- 使用 bundle analyzer 看产物。
- 打开生产 bundle 搜索未使用函数名。
- 检查依赖包 `module`、`exports`、`sideEffects`。
- 确认 Babel 是否保留 ESM。
- 确认生产构建开启 minify。

