# preset-env polyfill 与运行时隔离

`@babel/preset-env` 是 Babel 兼容性配置的核心。它根据目标运行环境决定需要转换哪些语法。但语法转换和 API 兼容不是一回事：Babel 能把新语法改成旧语法，却不能凭空让旧浏览器拥有 `Promise`、`Map`、`Array.prototype.includes`。

## targets 和 Browserslist

targets 描述代码要运行在哪些环境：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.5%, not dead"
      }
    ]
  ]
}
```

团队通常把浏览器范围放到 Browserslist：

```text
> 0.5%
last 2 versions
not dead
not ie <= 11
```

构建、Autoprefixer、Babel 等工具可以共享这份目标环境。

## 语法转换和 API polyfill

语法转换：

```javascript
const value = user?.profile?.name
```

可以被 Babel 转成旧语法。

API polyfill：

```javascript
Promise.resolve()
Array.from(list)
```

需要 `core-js` 或运行环境本身支持。

| 类型 | Babel 能否只靠语法转换解决 |
| --- | --- |
| optional chaining | 能 |
| class fields | 能 |
| Promise | 不能，需要 polyfill |
| Map/Set | 不能，需要 polyfill |
| Array.prototype.includes | 不能，需要 polyfill |

## useBuiltIns

`preset-env` 常见 polyfill 策略：

| 配置 | 含义 |
| --- | --- |
| `false` | 不自动处理 polyfill |
| `entry` | 根据入口导入和 targets 裁剪 polyfill |
| `usage` | 按代码实际使用自动注入 polyfill |

应用项目可以选择 `entry` 或 `usage`，但要明确 core-js 版本。

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": "3.37"
      }
    ]
  ]
}
```

## helpers

Babel 转换某些语法时会生成 helper：

```javascript
function _classCallCheck(instance, Constructor) {
  // helper body
}
```

如果每个文件都内联 helper，产物会膨胀。`@babel/plugin-transform-runtime` 可以把 helper 引用到运行时包中。

## transform-runtime

它解决两类问题：

- 减少 helper 重复。
- 避免某些 polyfill 污染全局。

库项目尤其常用，因为库不应该随意污染消费者全局环境。

但要注意：`transform-runtime` 不是应用 polyfill 的完整替代品。应用仍然要根据浏览器 targets 处理全局 API 兼容。

## App 和 Library 策略

应用：

- 可以统一注入全局 polyfill。
- 以目标浏览器可运行为准。
- 关注首屏体积和兼容性。

库：

- 避免注入全局 polyfill。
- 使用 runtime helpers。
- 在文档里说明运行环境要求。
- 让消费者应用决定 polyfill。

## 常见问题

| 现象 | 排查 |
| --- | --- |
| 旧浏览器语法报错 | targets 是否覆盖该浏览器 |
| API 不存在 | 是否注入 polyfill |
| polyfill 打太多 | Browserslist 是否过宽，usage 是否误判 |
| 组件库污染全局 | 是否在库里使用 entry polyfill |
| helper 重复 | 是否启用 transform-runtime |

## 落地清单

- 是否有统一 Browserslist？
- 是否区分语法转换和 API polyfill？
- App 和 Library 是否采用不同 polyfill 策略？
- core-js 版本是否明确？
- 是否检查 helper 重复和产物体积？
- 是否在低版本浏览器或兼容环境做过验证？

