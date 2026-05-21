# polyfill、core-js 与 regenerator

Babel 的语法转换和 polyfill 是两件事。语法能被转换，API 缺失则需要补运行时实现。

## 语法转换 vs API polyfill

语法转换：

```javascript
const add = (a, b) => a + b
```

可以转成：

```javascript
var add = function add(a, b) {
  return a + b
}
```

API polyfill：

```javascript
Array.from(document.querySelectorAll('div'))
Promise.resolve()
```

如果旧环境没有 `Array.from` 或 `Promise`，需要引入实现。

## core-js

`core-js` 提供大量 ECMAScript API 的 polyfill，例如：

- `Promise`
- `Array.from`
- `Array.prototype.includes`
- `Object.assign`
- `Map`
- `Set`
- `String.prototype.startsWith`

Babel 可以通过 `preset-env` 自动插入对应 core-js 引用。

## useBuiltIns: entry

入口文件手动写：

```javascript
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

Babel 根据 targets 把它替换成更具体的 polyfill 引用。

配置：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": "3.37"
    }]
  ]
}
```

特点：

- 入口集中管理。
- 可能引入较多 polyfill。
- 适合应用项目。

## useBuiltIns: usage

代码里不用手动 import，Babel 按使用情况注入：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": "3.37"
    }]
  ]
}
```

如果代码用了：

```javascript
Array.from(list)
```

Babel 会根据 targets 自动插入需要的 polyfill 引用。

特点：

- 按需注入。
- 依赖静态分析。
- 第三方依赖里的 API 是否被处理取决于构建配置是否转译该依赖。

## regenerator

旧环境不支持 generator 或 async/await 时，Babel 可能需要 regenerator runtime。

```javascript
async function load() {
  const res = await fetch('/api')
  return res.json()
}
```

如果目标环境不支持 async/await，转换后会依赖运行时代码。

## 全局污染问题

core-js polyfill 通常会修改全局对象或内置原型：

```javascript
Array.prototype.includes
window.Promise
```

应用项目可以接受，因为它控制运行环境。

库项目要谨慎，因为修改全局可能影响使用方。库项目更常考虑 `@babel/plugin-transform-runtime` 和 `core-js-pure` 等策略。

## polyfill 策略选择

| 场景 | 推荐 |
| --- | --- |
| 应用项目，需要兼容旧浏览器 | `preset-env` + `useBuiltIns` + `core-js` |
| 库项目，不想污染使用方全局 | `transform-runtime`，谨慎处理 polyfill |
| 只支持现代浏览器 | 尽量少 polyfill |
| 旧项目迁移 | 先明确 Browserslist，再逐步收敛 |

## 排查 API 缺失

运行时报：

```text
Promise is not defined
Object.assign is not a function
```

排查：

1. 目标环境是否真的支持这个 API。
2. `preset-env` 是否配置 `useBuiltIns`。
3. 是否安装了正确版本的 `core-js`。
4. `corejs` 配置版本是否和依赖版本一致。
5. 出问题代码是否来自未被 Babel 处理的第三方依赖。

