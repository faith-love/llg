# plugin、preset 与执行顺序

Babel 配置里最常见的是 `plugins` 和 `presets`。理解它们的执行顺序，对排查“为什么转换结果不对”很重要。

## plugin

plugin 是一个具体转换能力：

```json
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```

它只负责某一类转换，例如箭头函数、class properties、decorators、runtime helper 等。

## preset

preset 是一组 plugin 的集合：

```json
{
  "presets": ["@babel/preset-env"]
}
```

常见 preset：

| preset | 作用 |
| --- | --- |
| `@babel/preset-env` | 按目标环境转换现代 JS |
| `@babel/preset-react` | 转换 JSX 和 React runtime |
| `@babel/preset-typescript` | 移除 TypeScript 类型语法 |

## 执行顺序

总体规则：

```text
plugins 从前到后执行
presets 从后到前执行
```

例如：

```json
{
  "plugins": ["plugin-a", "plugin-b"],
  "presets": ["preset-a", "preset-b"]
}
```

顺序大致是：

```text
plugin-a -> plugin-b -> preset-b -> preset-a
```

实际内部还涉及 visitor 合并和 pass 机制，但先记住这个规则足够解决大多数配置问题。

## 为什么顺序重要

decorators 和 class fields 就是典型例子。某些语法必须先被正确解析和转换，否则后续插件拿到的 AST 形态不对。

另一个例子是 import 转换和 tree-shaking。如果太早把 ESM 转成 CommonJS，后续 bundler 的 tree-shaking 可能变差。

## preset 配置

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, not dead",
      "modules": false
    }]
  ]
}
```

preset 可以带选项。

`modules: false` 表示尽量保留 ESM，让 bundler 继续做 tree-shaking。

## overrides

不同文件使用不同配置：

```json
{
  "overrides": [
    {
      "test": "./src/legacy/**/*.js",
      "presets": [
        ["@babel/preset-env", { "targets": "ie 11" }]
      ]
    }
  ]
}
```

适合 monorepo、兼容旧目录、测试代码和源码使用不同配置。

## env

按环境切换配置：

```json
{
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    }
  }
}
```

测试环境可能需要 CommonJS，生产构建可能要保留 ESM。

## 配置原则

- 能用 preset 解决的，不要手动堆很多 transform plugin。
- 应用项目优先用 `preset-env` 按 targets 决定转换。
- 库项目不要随便把模块转成 CommonJS，保留 ESM 有利于使用方 tree-shaking。
- 装饰器、class fields 这类语法要确认插件版本和语义。
- 配置变复杂时，用注释说明原因，不要留下谜题。

