# 根项目、workspace 包发现与脚本设计

这一页专门拆 `pnpm workspace` 的底层动作：根项目负责组织，workspace 负责发现包，根脚本负责把任务分发给每个包。

## 步骤一：根 package.json 只做编排

根目录的 `package.json`：

```json
{
  "name": "acme-frontend-platform",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "turbo dev --parallel",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "build": "turbo build",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

代码说明：

- `private: true` 防止误发布根项目。
- `packageManager` 固定包管理器和版本，减少不同机器的安装差异。
- 根脚本不直接写 `vite build`，而是交给 `turbo` 分发。
- `check` 是本地提交前的一键验证命令。

根项目不要放 React、Vite、业务依赖。根项目是调度层，不是运行时代码。

## 步骤二：workspace 包发现

`pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*
```

代码说明：

- `apps/*` 放可运行应用。
- `packages/*` 放可复用库和配置包。
- `tooling/*` 放生成器、脚本、Babel 插件等工程工具。

如果某个目录没有 `package.json`，pnpm 不会把它当作 workspace package。目录存在不等于包存在。

## 步骤三：创建最小 package

`packages/shared/package.json`：

```json
{
  "name": "@acme/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --passWithNoTests",
    "build": "tsc --emitDeclarationOnly"
  }
}
```

字段说明：

- `name` 是其他包 import 时使用的包名。
- `exports` 是 public API 边界，外部只能从这里进。
- `types` 指向类型入口。
- `import` 指向 ESM 入口。
- `scripts` 必须统一，否则 turbo 无法稳定调度同名任务。

## 步骤四：用 pnpm 命令观察包发现结果

```bash
pnpm list --depth -1
pnpm --filter @acme/shared typecheck
pnpm --filter ./packages/shared typecheck
```

命令说明：

- `pnpm list --depth -1` 看当前 workspace 识别到了哪些包。
- `--filter @acme/shared` 按包名过滤。
- `--filter ./packages/shared` 按路径过滤。

如果 filter 找不到包，优先检查：

1. 目录是否匹配 `pnpm-workspace.yaml`。
2. 目录下是否有 `package.json`。
3. `package.json` 里的 `name` 是否正确。

## 步骤五：根脚本和包脚本的关系

根目录执行：

```bash
pnpm typecheck
```

实际流程：

```text
root package.json scripts.typecheck
  -> turbo typecheck
    -> 找到所有有 typecheck 脚本的 workspace package
    -> 按依赖图决定执行顺序
    -> 收集每个包的执行结果
```

所以每个包必须有一致的脚本名。不要有的包叫 `check-types`，有的包叫 `typecheck`，否则根任务无法统一。

## 练习

1. 新建 `packages/shared`、`packages/ui`、`apps/admin`、`apps/portal`。
2. 每个包都写 `package.json` 和 `typecheck` 脚本。
3. 运行 `pnpm list --depth -1`，确认四个包都被发现。
4. 分别用包名和路径执行 `pnpm --filter`。

## 验收

- 能解释 workspace 如何发现 package。
- 能解释根脚本为什么只做编排。
- 能用 `--filter` 精确运行某一个包。
- 能定位“包没有被 pnpm 发现”的常见原因。
