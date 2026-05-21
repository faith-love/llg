# preset-env、targets 与 Browserslist

`@babel/preset-env` 的目标是：根据你的目标环境，自动决定需要哪些语法转换和 polyfill 策略。

## 为什么需要 targets

同一段代码：

```javascript
const user = users.find((item) => item.id === id)
```

如果目标是现代 Chrome，可能不需要转换箭头函数。

如果目标是旧浏览器，就可能需要转换语法，并补 API。

所以 Babel 不应该盲目把所有现代语法都降到很老，而应该根据目标环境做最少必要转换。

## targets 写法

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "chrome": "90",
        "safari": "14"
      }
    }]
  ]
}
```

也可以使用 Browserslist：

```text
> 0.5%
last 2 versions
not dead
```

Browserslist 可以写在：

- `package.json` 的 `browserslist` 字段。
- `.browserslistrc` 文件。
- Babel 配置的 `targets`。

## useBuiltIns

`preset-env` 可以和 `core-js` 配合注入 polyfill。

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

`usage` 表示根据代码中使用到的 API 自动注入需要的 polyfill 引用。

## modules

```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }]
  ]
}
```

`modules: false` 表示保留 ESM import/export。

应用项目交给 Webpack/Rollup/Vite 打包时，通常希望保留 ESM，让 bundler 做更好的 tree-shaking。

如果测试环境或 Node 环境需要 CommonJS，可以在 test env 单独转换。

## bugfixes

`bugfixes` 用于启用更精细的浏览器 bug 修复转换：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "bugfixes": true
    }]
  ]
}
```

它的目标不是无脑降级，而是针对特定环境的实现问题做更小的修复。

## debug

```json
{
  "presets": [
    ["@babel/preset-env", {
      "debug": true
    }]
  ]
}
```

开启后 Babel 会输出启用了哪些转换和 polyfill。排查兼容性时非常有用。

## 常见误区

### 误区一：不写 targets

不明确目标环境，会导致转换策略不稳定，团队也不知道产物要兼容到哪里。

### 误区二：为了保险兼容太老

兼容很老的浏览器会显著增加产物体积和运行时代码。要根据真实用户和业务要求决定。

### 误区三：把语法转换和 API polyfill 混为一谈

`const`、箭头函数是语法转换。

`Promise`、`Array.from`、`Object.assign` 是 API，需要 polyfill。

### 误区四：提前转 CommonJS

在前端应用打包中，过早把 ESM 转成 CommonJS 可能影响 tree-shaking。

