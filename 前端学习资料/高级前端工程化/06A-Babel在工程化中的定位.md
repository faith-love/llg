# Babel 在工程化中的定位

Babel 是 JavaScript 编译器，它在前端工程化里负责“理解代码并改写代码”。它不是打包器，不负责从入口递归收集所有模块，也不负责决定最终 chunk 如何拆分。理解这个边界，是排查构建问题的第一步。

## Babel 解决什么

Babel 主要解决三类问题：

| 问题 | 说明 | 例子 |
| --- | --- | --- |
| 语法转换 | 把新语法转成目标环境能运行的语法 | class fields、optional chaining、decorators |
| 语法扩展 | 把非 JS 标准语法转成 JS | JSX、TypeScript 类型擦除 |
| 代码改写 | 通过插件对 AST 做结构化修改 | 自动埋点、按需引入、宏、语法实验 |

它的主流程是：

```text
source code -> parse -> AST -> transform -> AST -> generate -> output code + sourcemap
```

## Babel 不解决什么

| 不负责的事 | 通常由谁负责 |
| --- | --- |
| 从入口构建完整依赖图 | Webpack、Rollup、Vite、Rspack |
| 决定 chunk 如何拆分 | bundler |
| 加载 CSS、图片、字体 | bundler loader 或插件 |
| 类型检查 | TypeScript Compiler |
| 压缩和 mangle | Terser、esbuild、SWC |
| 开发服务器和 HMR | Vite、Webpack Dev Server |
| 真实运行时 API 兼容 | core-js、regenerator、浏览器 polyfill |

所以看到“低版本浏览器报 `Promise is not defined`”，不要只改 Babel 语法插件。`Promise` 是运行时 API，需要 polyfill。

## Babel 在构建链路中的位置

典型应用构建：

```text
入口文件
  -> bundler 解析模块
  -> 对 JS/TS/JSX 文件调用 Babel 或 SWC
  -> bundler 继续收集依赖
  -> tree-shaking
  -> code splitting
  -> minify
  -> emit assets
```

Webpack 中通常通过 `babel-loader` 接入。Rollup 中通过 Babel plugin 接入。Vite 开发阶段常用 esbuild 转换，生产构建走 Rollup，React 插件可能在特定场景使用 Babel。

## Babel 和 SWC/esbuild 的关系

| 工具 | 优势 | 局限 |
| --- | --- | --- |
| Babel | 插件生态成熟，AST 改写灵活，兼容大量语法实验 | 性能相对慢 |
| SWC | Rust 实现，转换速度快，适合替换常规 Babel 转换 | Babel 插件不能直接复用 |
| esbuild | 速度极快，适合 dev transform、预构建和压缩 | 复杂 AST 插件生态弱 |

工程选型时不要只看速度。如果项目依赖大量 Babel 插件，例如自动按需引入、宏、旧装饰器转换、埋点插件，迁移到 SWC/esbuild 需要评估插件替代方案。

## App 和 Library 的 Babel 策略

应用项目：

- 根据实际浏览器 targets 转换语法。
- 根据策略注入 polyfill。
- 输出给浏览器直接运行的产物。
- 更关注首屏体积和兼容性。

库项目：

- 不应该把过多 polyfill 打进库。
- 通常保留较现代的 ESM 产物。
- 把 React/Vue 等框架声明为 peer dependency。
- 输出类型声明和多模块格式。

库项目如果直接注入全局 polyfill，会污染消费者环境。更推荐让应用决定 polyfill 策略。

## 工程化判断题

遇到构建问题时先判断属于哪层：

| 现象 | 更可能属于 |
| --- | --- |
| 语法在旧浏览器报错 | Babel targets 或语法插件 |
| API 不存在 | polyfill 策略 |
| 类型错误 | TypeScript |
| import 解析失败 | bundler resolve |
| 产物拆包不合理 | bundler chunk 策略 |
| 代码压缩后行为异常 | minifier 配置 |
| sourcemap 行号对不上 | Babel、bundler、minifier sourcemap 串联 |

## 落地清单

- 是否知道项目里哪些文件经过 Babel？
- 是否知道 Babel 配置由哪个文件生效？
- 是否区分语法转换和 API polyfill？
- 是否知道开发构建和生产构建使用的 transformer 是否一致？
- 是否知道 App 和 Library 的 Babel 策略不同？
- 是否能从报错判断问题属于 Babel、bundler、TS、minifier 还是运行时？

