# design token、组件 API、样式与导出策略

这一页拆组件库的核心：先定 token，再设计组件 API，再决定 public export。组件库不是把页面组件搬到 packages，而是把稳定、跨业务复用的交互沉淀出来。

## 步骤一：设计 token

`packages/ui/src/tokens/index.ts`：

```typescript
export const colors = {
  primary: '#2563eb',
  danger: '#dc2626',
  success: '#16a34a',
  border: '#d4d4d8',
  text: '#18181b',
  muted: '#71717a',
  surface: '#ffffff'
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px'
} as const

export const radius = {
  sm: '4px',
  md: '6px'
} as const
```

代码说明：

- `as const` 保留字面量类型，消费者可以获得更精确的类型。
- token 是设计约束，不是随手变量。
- token 文件不依赖 React，可以被文档、脚本、样式生成器复用。

## 步骤二：Button API 设计

`packages/ui/src/button/Button.tsx`：

```typescript
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'sm' | 'md'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'acme-button--primary',
  secondary: 'acme-button--secondary',
  danger: 'acme-button--danger'
}

const sizeClassName: Record<ButtonSize, string> = {
  sm: 'acme-button--sm',
  md: 'acme-button--md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={['acme-button', variantClassName[variant], sizeClassName[size], className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

API 解释：

- `variant` 表达语义，不暴露颜色值。
- `size` 控制尺寸，不让业务页面手写高度。
- `loading` 会自动禁用按钮，减少重复逻辑。
- 继承 `ButtonHTMLAttributes`，保留原生 button 能力。

## 步骤三：样式文件

`packages/ui/src/button/button.css`：

```css
.acme-button {
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.acme-button--sm {
  padding: 4px 8px;
}

.acme-button--md {
  padding: 8px 12px;
}

.acme-button--primary {
  background: #2563eb;
  color: #ffffff;
}

.acme-button--secondary {
  background: #ffffff;
  border-color: #d4d4d8;
  color: #18181b;
}

.acme-button--danger {
  background: #dc2626;
  color: #ffffff;
}

.acme-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
```

样式可以先用普通 CSS。重点是组件 className 稳定，后续再替换 CSS Modules、vanilla-extract 或 Tailwind 都不影响组件 API。

## 步骤四：导出策略

`packages/ui/src/button/index.ts`：

```typescript
import './button.css'

export { Button } from './Button'
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button'
```

`packages/ui/src/index.ts`：

```typescript
export { Button } from './button'
export type { ButtonProps, ButtonSize, ButtonVariant } from './button'

export { colors, radius, spacing } from './tokens'
```

解释：

- 每个组件目录有自己的 `index.ts`。
- 根 `index.ts` 只聚合 public API。
- 不从根入口导出测试工具、内部 className map。

## 练习

1. 给 `Button` 增加 `size` 和 `loading`。
2. 写出对应 CSS。
3. 保持业务使用方式不变：`import { Button } from '@acme/ui'`。
4. 不允许业务 import `button.css`，样式由组件入口负责。

## 验收

- token 无 React 依赖。
- Button API 表达语义而不是暴露样式细节。
- 样式由组件入口导入。
- 根入口只暴露 public API。
