# Babel 配置文件和 monorepo

Babel 配置文件有多种形式。配置文件位置会影响哪些文件被编译、如何在 monorepo 中生效。

## 常见配置文件

项目级：

```javascript
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env']
}
```

文件相对配置：

```json
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

也可以写在 `package.json`：

```json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```

## babel.config.js

`babel.config.js` 是项目范围配置，适合：

- 应用项目。
- monorepo 根目录统一配置。
- 需要编译多个 package。
- 需要让 Babel 处理 node_modules 或外部目录中特定代码。

## .babelrc

`.babelrc` 更偏文件目录范围，适合：

- 单个 package 自己有独立 Babel 配置。
- npm 包源码目录局部配置。

在 monorepo 中，`.babelrc` 是否生效经常受 Babel root、cwd、babelrcRoots 等配置影响。

## envName

Babel 会根据环境加载不同配置：

```javascript
module.exports = function (api) {
  const isTest = api.env('test')

  return {
    presets: [
      ['@babel/preset-env', {
        targets: isTest ? { node: 'current' } : '> 0.5%, not dead'
      }]
    ]
  }
}
```

`api.cache` 也很重要，避免配置函数每次重复计算。

## overrides

```javascript
module.exports = {
  overrides: [
    {
      test: './src/legacy',
      presets: [
        ['@babel/preset-env', { targets: 'ie 11' }]
      ]
    },
    {
      test: './src/**/*.test.ts',
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  ]
}
```

适合不同目录或文件类型使用不同转换策略。

## ignore 和 only

```javascript
module.exports = {
  ignore: ['**/*.test.js'],
  only: ['src']
}
```

用于控制 Babel 处理范围。范围过大，构建会慢；范围过小，可能漏编译。

## monorepo 常见问题

### 子包配置不生效

排查：

1. Babel 的 cwd 是哪里。
2. 是否使用 `babel.config.js`。
3. 是否需要 `babelrcRoots`。
4. 构建工具 loader include/exclude 是否包含子包。

### 子包源码没有被转译

常见于 workspace 直接引用源码：

```text
packages/app -> packages/ui/src/Button.tsx
```

如果 bundler exclude 了外部目录，`packages/ui` 可能没有经过 Babel。

### node_modules 里的现代语法报错

很多项目默认不编译 `node_modules`。如果某个依赖发布了现代语法，而目标环境不支持，需要把该依赖加入转译白名单。

## 配置原则

- 应用项目优先使用根级 `babel.config.js`。
- monorepo 要明确 root 和需要编译的 package。
- 不要让 Babel 扫整个仓库。
- 不要盲目排除所有外部 workspace 源码。
- 测试、构建、开发要明确 env 差异。

