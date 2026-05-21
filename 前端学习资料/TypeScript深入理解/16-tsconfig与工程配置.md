# tsconfig 与工程配置

`tsconfig.json` 决定 TypeScript 如何检查项目。很多类型问题不是代码本身导致，而是配置和构建工具不一致。

## 基础结构

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  },
  "include": ["src"]
}
```

`compilerOptions` 控制编译和类型检查。

`include` 控制哪些文件进入项目。

## strict

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict` 会开启一组严格检查，是新项目推荐基线。

重要子项包括：

- `strictNullChecks`
- `noImplicitAny`
- `strictFunctionTypes`
- `strictPropertyInitialization`
- `noImplicitThis`

旧项目迁移可以分阶段开启。

## target

`target` 决定输出 JavaScript 使用的语法级别。

```json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
```

它会影响：

- async/await 是否转译。
- class fields 输出。
- 新语法保留程度。
- lib 默认选择。

实际项目还要结合 Babel、SWC、Vite、浏览器兼容目标。

## lib

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

`lib` 决定可用的内置类型，比如 DOM、Promise、Map、Set。

如果 Node 项目里没有 DOM，就不要加 DOM。

## module 和 moduleResolution

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

前端项目要让 TypeScript 的模块解析和打包工具一致。

## jsx

React 项目：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

老 React 项目可能使用 `react`。

## noEmit

很多前端项目只让 TS 做类型检查，实际转译交给 Vite、Babel、SWC：

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

构建库项目时，则可能需要 `declaration` 和输出声明文件。

## declaration

库项目：

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

用于生成 `.d.ts`，让使用方获得类型。

## skipLibCheck

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

跳过依赖包声明文件检查，能加快速度，也能避开第三方类型冲突。但它可能掩盖库类型问题。

应用项目常开启，库项目要谨慎。

## isolatedModules

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

要求每个文件能被独立转译。使用 Babel、SWC、Vite 时常见。它会限制某些 TS 语法，比如 `const enum`。

## include 和 exclude

```json
{
  "include": ["src", "env.d.ts"],
  "exclude": ["dist", "node_modules"]
}
```

如果类型文件不生效，先看是否被 include 包含。

## 配置原则

- 新项目默认开启 `strict`。
- 应用项目通常 `noEmit: true`，让打包工具负责输出。
- 路径别名要和 Vite/Webpack/Jest/Vitest 保持一致。
- 不要复制一份不理解的 tsconfig。
- 迁移旧项目时分阶段开启严格项，并记录债务。

