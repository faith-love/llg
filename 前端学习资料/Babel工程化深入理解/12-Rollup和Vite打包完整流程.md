# Rollup 和 Vite 打包完整流程

Rollup 以 ESM 为核心，擅长 tree-shaking 和库构建。Vite 在开发阶段强调快速启动和原生 ESM，生产构建则会进入打包流程。

## Rollup 总流程

```text
input
  -> resolveId 解析模块
  -> load 读取模块内容
  -> transform 转换模块
  -> parse 成模块 AST
  -> 建立模块依赖图
  -> tree-shaking 标记副作用和使用关系
  -> render chunk
  -> generate output
```

Rollup 插件通过一系列 hook 参与流程。

## Rollup 插件常见 hook

| hook | 作用 |
| --- | --- |
| `resolveId` | 把 import 路径解析成模块 id |
| `load` | 读取或生成模块内容 |
| `transform` | 转换单个模块代码 |
| `moduleParsed` | 模块解析后处理 |
| `renderChunk` | chunk 生成阶段处理 |
| `generateBundle` | 输出 bundle 前处理 |

Babel 通常接在 `transform` 阶段。

## Rollup 为什么 tree-shaking 强

Rollup 以 ES Modules 静态结构为基础：

```javascript
import { add } from './math'
export { add }
```

ESM 的 import/export 是静态的，Rollup 能更准确判断哪些导出被使用。

如果代码提前被转换成 CommonJS：

```javascript
const math = require('./math')
```

静态分析会困难很多。

## Vite 开发模式

Vite 开发模式大致是：

```text
启动 dev server
  -> 依赖预构建
  -> 浏览器请求源码模块
  -> 按需 transform 单个模块
  -> 通过原生 ESM 返回给浏览器
  -> 文件变更时 HMR
```

它不需要一开始把整个应用打成一个 bundle，所以启动快。

## 依赖预构建

Vite 会对 node_modules 依赖做预构建，常见目的：

- 把 CommonJS 依赖转成 ESM。
- 合并依赖内部大量小模块，减少浏览器请求数量。
- 提升开发服务器性能。

这一步通常由高性能工具完成，不一定经过 Babel。

## Vite 生产构建

生产构建大致是：

```text
读取入口
  -> 执行插件 transform
  -> 建立依赖图
  -> tree-shaking
  -> code splitting
  -> CSS 和资源处理
  -> 压缩
  -> 输出 dist
```

Vite 的生产构建底层依赖具体版本和配置，核心思想仍然是把模块图优化成适合生产部署的静态资源。

## Babel 在 Vite 中的位置

Vite 默认不一定需要 Babel。需要 Babel 的情况：

- 使用特定 Babel 插件。
- React 项目需要某些 Babel 插件能力。
- 旧项目依赖 Babel 宏或自定义转换。
- 需要处理特殊 decorators 或 proposal 语法。

如果只是普通 TS/JSX 转译，Vite 默认工具链可能已经足够。

## Rollup/Vite 和 Webpack 的差异

| 维度 | Webpack | Rollup/Vite |
| --- | --- | --- |
| 核心模型 | 一切皆模块，loader/plugin 体系强 | ESM 静态分析和插件 hook |
| 开发模式 | 常围绕 bundle/HMR | Vite 开发时按需 ESM |
| 库构建 | 可以，但配置相对重 | Rollup 很常见 |
| 应用构建 | 很成熟 | Vite 更轻更快 |
| Babel 接入 | babel-loader | Babel plugin 或框架插件 |

选择工具时看项目生态、性能、插件需求和团队经验，不要只看流行度。

