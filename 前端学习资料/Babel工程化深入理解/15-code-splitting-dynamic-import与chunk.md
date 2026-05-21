# code splitting、dynamic import 与 chunk

code splitting 是把代码拆成多个 chunk，让浏览器按需加载。它解决的是“不要一次把所有代码都发给用户”。

## 为什么分包

单个大 bundle 的问题：

- 首屏下载慢。
- 解析执行慢。
- 缓存粒度差。
- 后台页面代码也被首屏加载。

分包后：

```text
main.js 首屏加载
vendor.js 公共依赖缓存
admin.js 进入后台时再加载
```

## dynamic import

```javascript
const AdminPage = () => import('./pages/AdminPage')
```

打包器看到 `import()` 会生成异步 chunk。

运行时触发时，浏览器再请求对应 JS 文件。

## 路由级分包

React：

```typescript
const AdminPage = lazy(() => import('./pages/AdminPage'))
```

Vue：

```typescript
const AdminPage = () => import('./pages/AdminPage.vue')
```

这是最常见、收益最明确的分包方式。

## vendor chunk

第三方依赖可能被拆到 vendor：

```text
vendor-react.js
vendor-chart.js
main.js
```

好处：

- 第三方依赖变化少，缓存更稳定。
- 主业务代码变化不会让所有依赖缓存失效。

风险：

- vendor 过大。
- 拆太碎导致请求过多。
- 公共 chunk 策略不合理导致重复代码。

## Webpack splitChunks

Webpack 可通过 `optimization.splitChunks` 控制公共依赖抽取：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

真实项目会按框架、图表库、编辑器、地图等大依赖拆分。

## Rollup manualChunks

Rollup/Vite 可配置 `manualChunks`：

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  }
}
```

不要盲目手动拆所有依赖。先分析产物，再做策略。

## 运行时加载

异步 chunk 加载需要 runtime 知道：

- chunk 文件名。
- public path。
- 加载成功回调。
- 加载失败处理。

如果部署路径错了，会出现：

```text
Loading chunk failed
```

或 JS 404。

## 预加载和预取

可以用：

- preload：当前页面很快需要。
- prefetch：未来可能需要，浏览器空闲时加载。

不要滥用。预加载太多会抢首屏资源。

## 分包原则

- 先按路由拆。
- 大型低频功能单独拆，如图表、编辑器、地图。
- 公共依赖缓存稳定时再抽 vendor。
- 用分析工具看真实体积。
- 关注 gzip/brotli 后体积，而不只看原始体积。
- 分包不是越碎越好。

