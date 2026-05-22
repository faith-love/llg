# 子集一：基础仓库与 workspace

这一节目标是把 monorepo 的基础跑起来：根项目、pnpm workspace、两个应用、两个共享包、workspace 本地引用。

## 步骤一：初始化根项目

```bash
mkdir acme-frontend-platform
cd acme-frontend-platform
pnpm init
```

根 `package.json`：

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
    "affected:build": "turbo build --filter=...[HEAD^1]"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 步骤二：配置 workspace

`pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*
```

## 步骤三：创建基础目录

```bash
mkdir -p apps/admin/src apps/portal/src
mkdir -p packages/shared/src packages/ui/src
mkdir -p packages/config-ts packages/config-eslint
```

Windows PowerShell 可以用：

```powershell
New-Item -ItemType Directory -Force apps/admin/src, apps/portal/src, packages/shared/src, packages/ui/src, packages/config-ts, packages/config-eslint
```

## 步骤四：创建 shared 包

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
    "lint": "echo lint shared",
    "typecheck": "tsc --noEmit",
    "test": "echo test shared",
    "build": "tsc --emitDeclarationOnly"
  }
}
```

`packages/shared/src/index.ts`：

```typescript
export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E }

export function formatDate(input: Date) {
  return input.toISOString().slice(0, 10)
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
```

## 步骤五：创建 ui 包

`packages/ui/package.json`：

```json
{
  "name": "@acme/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "@acme/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  },
  "scripts": {
    "lint": "echo lint ui",
    "typecheck": "tsc --noEmit",
    "test": "echo test ui",
    "build": "tsc --emitDeclarationOnly"
  }
}
```

`packages/ui/src/index.ts`：

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export type ButtonProps = {
  variant?: ButtonVariant
  disabled?: boolean
  children: string
}

export function getButtonClassName(props: Pick<ButtonProps, 'variant' | 'disabled'>) {
  const variant = props.variant ?? 'primary'
  return ['acme-button', `acme-button--${variant}`, props.disabled ? 'is-disabled' : '']
    .filter(Boolean)
    .join(' ')
}
```

## 步骤六：创建应用 package

`apps/admin/package.json`：

```json
{
  "name": "admin",
  "private": true,
  "type": "module",
  "dependencies": {
    "@acme/shared": "workspace:*",
    "@acme/ui": "workspace:*",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "lint": "echo lint admin",
    "typecheck": "tsc --noEmit",
    "test": "echo test admin",
    "build": "vite build"
  }
}
```

`apps/portal/package.json` 和 `admin` 类似，只把 `name` 改成 `portal`。

## 步骤七：根 tsconfig

根 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx"
  }
}
```

应用 `apps/admin/tsconfig.json`：

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src", "vite.config.ts"]
}
```

## 步骤八：安装和验证

```bash
pnpm install
pnpm --filter @acme/shared typecheck
pnpm --filter @acme/ui typecheck
```

## 验收标准

- 根目录存在 `pnpm-workspace.yaml`。
- `pnpm install` 能识别所有 workspace package。
- `apps/admin` 通过 `workspace:*` 引用 `@acme/ui` 和 `@acme/shared`。
- `@acme/ui` 没有把 React 放进 `dependencies`。
- `@acme/shared` 不依赖 React。

