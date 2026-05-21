# source map、缓存与构建模式

source map、缓存和构建模式决定了开发体验、线上排障能力和构建性能。

## source map 是什么

生产代码被转换、打包、压缩后，错误位置可能变成：

```text
main.8f3a.js:1:20394
```

source map 用来把这个位置映射回源码：

```text
src/pages/UserPage.tsx:42:10
```

## 开发环境 source map

开发环境优先：

- 快速生成。
- 映射准确。
- 支持断点调试。

Webpack 可能使用 `eval-source-map`、`cheap-module-source-map` 等策略。

Vite 开发模式通常依赖快速 transform 和浏览器调试能力。

## 生产环境 source map

生产环境要权衡：

- 是否暴露源码。
- 是否上传错误监控平台。
- 构建时间。
- 产物体积。
- 安全策略。

常见策略：

```text
生成 source map -> 上传 Sentry 等平台 -> 不公开 .map 文件
```

## Babel source map

Babel 转换单文件时可以生成 source map。打包器会把多个阶段的 source map 串起来。

链路可能是：

```text
TS/JSX 源码
  -> Babel source map
  -> bundler source map
  -> minifier source map
  -> 最终 source map
```

如果中间某个工具没有正确传递 source map，最终映射可能不准。

## 缓存类型

### Babel 缓存

`babel-loader`：

```javascript
{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true
  }
}
```

避免重复转换未变化文件。

### 打包器文件系统缓存

Webpack 5：

```javascript
module.exports = {
  cache: {
    type: 'filesystem'
  }
}
```

### 依赖预构建缓存

Vite 会缓存预构建依赖。依赖变更、配置变更时可能需要清理缓存。

## 浏览器缓存

生产文件名常带 hash：

```text
main.8f3a1.js
vendor.12bb9.js
```

内容不变，hash 不变，可以长期缓存。

HTML 不应该长期强缓存，因为它要引用最新资源文件名。

## mode

Webpack：

```javascript
mode: 'development'
mode: 'production'
```

生产模式通常自动启用压缩、优化和环境变量。

Vite：

```bash
vite --mode staging
vite build --mode production
```

mode 会影响环境变量加载。

## DefinePlugin 和环境变量

编译期常量替换：

```javascript
new webpack.DefinePlugin({
  __DEV__: JSON.stringify(false)
})
```

代码：

```javascript
if (__DEV__) {
  console.log('debug')
}
```

生产压缩时可能删除这个分支。

## 常见问题

### 线上报错映射不准

排查：

1. Babel 是否生成 source map。
2. bundler 是否接收上游 source map。
3. minifier 是否保留 source map。
4. 上传的 map 是否和线上文件 hash 对应。

### 改了配置没生效

排查：

1. Babel loader cache。
2. Vite 依赖预构建缓存。
3. Webpack filesystem cache。
4. node_modules 缓存。
5. 浏览器缓存。

