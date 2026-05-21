# Webpack 打包完整流程

Webpack 是模块打包器。它从入口文件开始，递归分析依赖，使用 loader 转换模块，用 plugin 参与构建生命周期，最终输出一个或多个 bundle。

## 总流程

```text
读取配置
  -> 确定 entry
  -> 从 entry 开始解析模块
  -> 对匹配文件执行 loader
  -> 解析 import/require，继续收集依赖
  -> 构建 module graph
  -> 根据入口、动态导入和优化规则生成 chunk graph
  -> tree-shaking 和优化
  -> 生成 runtime 和 bundle
  -> emit 输出 assets
```

## entry

```javascript
module.exports = {
  entry: './src/main.tsx'
}
```

entry 是依赖图起点。Webpack 从这里开始找所有被 import/require 的模块。

多入口：

```javascript
module.exports = {
  entry: {
    app: './src/app.ts',
    admin: './src/admin.ts'
  }
}
```

## resolve

Webpack 遇到：

```javascript
import Button from '@/components/Button'
```

需要 resolve 成真实文件路径。

配置：

```javascript
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

resolve 解决“模块在哪里”。

## loader

loader 负责把不同类型文件转换成 Webpack 能处理的模块。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

`babel-loader` 做 JS/TS/JSX 转换。

`css-loader` 解析 CSS import/url。

`style-loader` 把 CSS 注入页面。

## loader 执行顺序

多个 loader 从右到左执行：

```javascript
use: ['style-loader', 'css-loader', 'postcss-loader']
```

执行顺序：

```text
postcss-loader -> css-loader -> style-loader
```

## plugin

plugin 参与 Webpack 构建生命周期。

常见 plugin：

- `HtmlWebpackPlugin` 生成 HTML。
- `MiniCssExtractPlugin` 抽离 CSS。
- `DefinePlugin` 注入编译期常量。
- `CopyWebpackPlugin` 复制静态资源。

loader 处理单个模块，plugin 处理构建流程级任务。

## module graph

Webpack 会为每个模块建立关系：

```text
main.tsx
  -> App.tsx
    -> Button.tsx
    -> style.css
  -> request.ts
```

这个依赖图决定哪些模块会进入构建。

## chunk graph

chunk 是最终输出的代码块。

同步 import 通常进入当前 chunk。

动态 import 会产生异步 chunk：

```javascript
const Admin = import('./Admin')
```

Webpack 根据入口、动态导入和 splitChunks 配置生成 chunk graph。

## runtime

Webpack bundle 中通常会有 runtime 代码，用于：

- 模块加载。
- 模块缓存。
- 异步 chunk 加载。
- publicPath 处理。
- HMR。

这部分不是你的业务代码，但运行时必须存在。

## optimization

生产构建会做：

- tree-shaking。
- splitChunks。
- runtimeChunk。
- minimize。
- module ids 和 chunk ids 优化。
- sideEffects 标记处理。

## emit

最后输出：

```text
dist/
  index.html
  static/js/app.8f3a.js
  static/js/vendor.9aa2.js
  static/css/app.12ab.css
  assets/logo.a1b2.svg
```

文件名通常带 hash，用于长期缓存。

## Babel 在 Webpack 中的位置

```text
Webpack 读取模块 -> 命中 babel-loader -> Babel 转换单文件 -> Webpack 继续分析转换后的依赖
```

Babel 不知道整个 chunk 怎么分。Webpack 不关心 Babel 内部如何改 AST。两者通过 loader 串起来。

