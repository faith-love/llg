# helpers、transform-runtime 与运行时隔离

Babel 转换某些语法时，会注入 helper 函数。项目大了以后，helper 重复和运行时污染就会成为问题。

## helper 是什么

例如 class 继承转换可能需要辅助函数：

```javascript
function _inherits(subClass, superClass) {
  // ...
}
```

如果每个文件都内联一份 helper，产物会膨胀。

## 默认内联 helper 的问题

```text
file-a.js -> 注入 _extends
file-b.js -> 注入 _extends
file-c.js -> 注入 _extends
```

同一个 helper 重复出现多次。

应用项目经过 bundler 和 minifier 后可能还能优化一部分，但库项目直接发布编译产物时问题更明显。

## transform-runtime

`@babel/plugin-transform-runtime` 会把 helper 引用改成从 `@babel/runtime` 导入：

```javascript
import _extends from '@babel/runtime/helpers/extends'
```

配置：

```json
{
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

项目还需要安装运行时依赖：

```bash
npm install @babel/runtime
```

库项目通常把 `@babel/runtime` 放在 dependencies，而不是 devDependencies。

## transform-runtime 能解决什么

- 复用 helper，减少重复代码。
- 避免某些转换污染全局。
- 让库产物更适合被别人消费。

## transform-runtime 不等于 preset-env

`preset-env` 负责根据目标环境决定语法转换和 polyfill 策略。

`transform-runtime` 负责复用 Babel helper 和运行时辅助代码。

它们关注点不同，常常一起出现。

## corejs 选项要谨慎

旧配置里可能看到：

```json
{
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 3
    }]
  ]
}
```

这会引入不污染全局的 polyfill 辅助能力，但策略和依赖关系更复杂。现代项目需要结合 Babel 当前版本和库发布目标谨慎选择。

## 应用项目 vs 库项目

应用项目：

- 可以用全局 polyfill。
- 重点是目标浏览器兼容和首屏体积。
- `preset-env` + `core-js` 常见。

库项目：

- 不应该随便污染全局。
- 重点是产物可被不同项目消费。
- 常用 `transform-runtime` 复用 helper。
- 尽量保留 ESM 给使用方 tree-shaking。

## 常见问题

### 找不到 @babel/runtime

报错：

```text
Cannot find module '@babel/runtime/helpers/extends'
```

原因通常是用了 `transform-runtime`，但没有安装 `@babel/runtime`，或库项目没有把它声明为生产依赖。

### helper 重复很多

检查：

1. 是否启用 `transform-runtime`。
2. 是否每个 package 都有独立 Babel 编译。
3. 是否 bundle 后又二次编译导致重复。
4. 是否发布了过度降级的产物。

