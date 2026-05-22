# Babel 与 Webpack Rollup Vite 集成

Babel 很少单独存在，通常嵌入 Webpack、Rollup、Vite、Jest、Storybook 或组件库构建中。高级工程化要知道 Babel 配置在哪里生效、哪些文件经过转换、缓存如何配置、为什么同一段代码在不同工具里表现不同。

## Webpack 中的 Babel

Webpack 通常用 `babel-loader`：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  }
}
```

关键点：

- `include/exclude` 决定哪些文件经过 Babel。
- `cacheDirectory` 影响二次构建速度。
- loader 顺序会影响 TS、JSX、CSS-in-JS 等处理。
- node_modules 默认不转译，遇到未转译依赖要单独 include。

## Rollup 中的 Babel

Rollup 更常用于库构建。Babel 通常只处理项目源码：

```javascript
import babel from '@rollup/plugin-babel'

export default {
  plugins: [
    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.ts', '.tsx']
    })
  ]
}
```

库构建要关注：

- `babelHelpers` 用 `runtime` 还是 `bundled`。
- external 是否排除 peer dependencies。
- 是否保留 ESM 以便 tree-shaking。
- 是否输出类型声明。

## Vite 中的 Babel

Vite 开发阶段主要依赖 esbuild 快速转译。React 插件内部可能使用 Babel 做 Fast Refresh 或特殊插件支持。

常见场景：

- 项目需要 Babel 插件，如 styled-components、emotion、macros。
- 需要 React Fast Refresh。
- 需要兼容特殊语法或实验插件。
- 生产构建由 Rollup 接管，仍要确认插件是否在 build 阶段生效。

不要默认认为 Vite 项目所有 JS 都经过 Babel。

## Babel 配置文件选择

| 文件 | 适合场景 |
| --- | --- |
| `.babelrc` | 单包项目或包内局部配置 |
| `babel.config.js` | monorepo 或需要全局配置 |
| loader options | 针对某个构建工具局部覆盖 |
| overrides | 按目录、文件类型使用不同配置 |

monorepo 中更推荐根部 `babel.config.js`，因为 `.babelrc` 的查找边界容易导致子包配置不生效。

## 测试环境中的 Babel

Jest/Vitest/Storybook 可能有自己的转换链路。常见问题：

- 应用构建能过，测试环境不认识 ESM。
- 测试不处理某些 node_modules。
- JSX runtime 配置不一致。
- Babel 配置只在 Webpack 生效，测试没读到。

工程上要让构建、测试、Storybook 共享关键转换配置，或者明确它们的差异。

## 缓存

Babel 缓存输入要考虑：

- 源码内容。
- Babel 配置。
- browserslist。
- env name。
- 插件版本。
- lockfile。

如果缓存 key 没包含配置变化，可能出现“改了配置但产物没变”的假象。

## 落地清单

- 是否知道 Webpack/Rollup/Vite 中 Babel 的接入点？
- node_modules 中未转译依赖是否有处理策略？
- monorepo 使用 `.babelrc` 还是 `babel.config.js` 是否明确？
- 测试、Storybook、构建的 Babel 配置是否一致或有说明？
- Babel 缓存是否会随配置和目标浏览器变化失效？
- 库构建是否正确处理 helpers、external 和 peer dependencies？

