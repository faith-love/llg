# React、Vue 与前端业务类型实践

前端业务使用 TypeScript，重点不是写复杂工具类型，而是把组件边界、状态模型、请求数据、事件和表单类型设计清楚。

## React props

```typescript
type UserCardProps = {
  user: {
    id: string
    name: string
  }
  selected?: boolean
  onSelect: (id: string) => void
}

function UserCard(props: UserCardProps) {
  return null
}
```

props 是组件最重要的协作边界，建议显式定义。

## React children

```typescript
import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  children: ReactNode
}
```

`ReactNode` 表示可渲染内容。

## React 事件

```typescript
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value)
}
```

按钮事件：

```typescript
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {}
```

## useState

能推断时不必标注：

```typescript
const [count, setCount] = useState(0)
```

初始值为空时要标注：

```typescript
const [user, setUser] = useState<User | null>(null)
```

列表：

```typescript
const [users, setUsers] = useState<User[]>([])
```

## useRef

DOM ref：

```typescript
const inputRef = useRef<HTMLInputElement | null>(null)
```

使用时处理空值：

```typescript
inputRef.current?.focus()
```

## 可辨识联合建模请求状态

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
```

比多个布尔值更稳：

```typescript
type BadState = {
  loading: boolean
  error?: Error
  data?: User[]
}
```

多个布尔值容易出现不可能状态，例如 loading 和 error 同时为 true。

## API 类型

```typescript
type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}
```

注意：`request<T>` 只是把返回值标成 `T`，不做运行时校验。可信度取决于后端契约和边界校验。

## 表单类型

```typescript
type LoginForm = {
  username: string
  password: string
  remember: boolean
}
```

表单草稿可以用：

```typescript
type LoginFormDraft = Partial<LoginForm>
```

但提交前应该转换成完整类型：

```typescript
function submit(input: LoginForm) {}
```

## Vue props

Vue 组合式 API 常见写法：

```typescript
type Props = {
  userId: string
  disabled?: boolean
}

const props = defineProps<Props>()
```

事件：

```typescript
const emit = defineEmits<{
  select: [id: string]
  close: []
}>()
```

## 业务类型组织

推荐按边界组织：

```text
src/
  types/
    api.ts
    user.ts
  services/
    user-service.ts
  components/
    UserCard.tsx
```

不要把所有类型堆到一个巨大的 `types.ts`。类型应该跟业务模块靠近，公共类型再抽到共享目录。

## 实践原则

- props、事件、API、状态模型要明确类型。
- 局部变量能推断就不写。
- 外部数据不要只靠泛型相信。
- 表单草稿和提交模型要区分。
- 组件公共 API 要稳定，内部类型可以跟随实现变化。

