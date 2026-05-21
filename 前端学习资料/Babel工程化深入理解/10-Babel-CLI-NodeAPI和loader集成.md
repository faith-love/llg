# Babel CLI、Node API 和 loader 集成

Babel 可以单独运行，也可以接入 Webpack、Rollup、Vite、Jest 等工具。不同接入方式决定它在构建链路中的位置。

## Babel CLI

安装：

```bash
npm install -D @babel/core @babel/cli @babel/preset-env
```

命令：

```bash
npx babel src --out-dir lib
```

适合：

- 编译库源码。
- 写简单构建脚本。
- 验证 Babel 配置。
- 调试某个文件的转换结果。

## Babel Node API

```javascript
import { transformSync } from '@babel/core'

const result = transformSync('const add = (a, b) => a + b', {
  presets: ['@babel/preset-env']
})

console.log(result.code)
```

适合：

- 自定义构建脚本。
- 写工具链。
- 在插件测试中验证转换。

## babel-loader

Webpack 中常用：

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

Webpack 负责找模块，`babel-loader` 负责把单个 JS/TS/JSX 模块交给 Babel 转换。

## Rollup Babel plugin

```javascript
import { babel } from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.ts', '.tsx']
    })
  ]
}
```

Rollup 负责打包和 tree-shaking，Babel plugin 负责 transform。

## Vite 中使用 Babel

Vite 默认大量使用 esbuild 做快速转译。只有当你需要 Babel 插件生态时，才引入 Babel。

常见场景：

- React Babel 插件。
- 特定语法提案。
- 自定义 AST 转换。
- 老项目迁移。

不要为了“项目应该有 Babel”而在 Vite 项目里强行加 Babel。能用 esbuild/SWC 快速完成的，就不一定需要 Babel。

## Jest 中使用 Babel

```javascript
module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
}
```

测试环境经常要把 ESM、JSX、TS 转成 Jest 能执行的形式。

## 调试转换结果

方法：

1. 用 Babel CLI 单独编译一个文件。
2. 开启 `preset-env debug`。
3. 查看 Webpack/Rollup/Vite 最终产物。
4. 对比 source map。
5. 暂时移除某个 plugin，看结果是否变化。

## 接入原则

- 打包器管依赖图，Babel 管单文件转换。
- loader/plugin 的 include/exclude 要精准。
- 测试环境和生产环境可以有不同 Babel 配置。
- Vite 项目先确认是否真的需要 Babel。
- 库项目要关注 helper 和模块格式。

