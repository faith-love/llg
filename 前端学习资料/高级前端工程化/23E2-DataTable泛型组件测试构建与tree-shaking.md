# DataTable 泛型、组件测试、构建与 tree-shaking

这一页拆 `DataTable`。它是练习组件库泛型 API 的好例子：组件不知道业务 row 长什么样，但要让业务代码获得类型推断。

## 步骤一：定义泛型列

`packages/ui/src/data-table/DataTable.tsx`：

```typescript
import type { ReactNode } from 'react'

export type DataTableColumn<TRow> = {
  key: string
  title: string
  align?: 'left' | 'right' | 'center'
  render: (row: TRow) => ReactNode
}

export type DataTableProps<TRow> = {
  rows: TRow[]
  columns: Array<DataTableColumn<TRow>>
  getRowKey: (row: TRow, index: number) => string
  emptyText?: string
}
```

类型说明：

- `TRow` 由 `rows` 自动推断。
- `render(row)` 中的 row 会拥有业务类型。
- `getRowKey` 强制消费者提供稳定 key，避免默认 index 带来的更新问题。

## 步骤二：实现组件

```typescript
export function DataTable<TRow>({
  rows,
  columns,
  getRowKey,
  emptyText = 'No data'
}: DataTableProps<TRow>) {
  if (rows.length === 0) {
    return <div role="status">{emptyText}</div>
  }

  return (
    <table className="acme-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={`is-${column.align ?? 'left'}`}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={getRowKey(row, rowIndex)}>
            {columns.map((column) => (
              <td key={column.key} className={`is-${column.align ?? 'left'}`}>
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

代码说明：

- 空状态用 `role="status"`，方便测试和辅助技术识别。
- `align` 是列配置，不让页面到处写 className。
- `getRowKey` 是必填，逼迫业务思考稳定标识。

## 步骤三：业务侧获得类型推断

`apps/admin/src/pages/users/UsersPage.tsx`：

```typescript
type User = {
  id: string
  name: string
  status: 'active' | 'disabled'
}

const users: User[] = [
  { id: 'u1', name: 'Ada', status: 'active' }
]

export function UsersPage() {
  return (
    <DataTable
      rows={users}
      getRowKey={(row) => row.id}
      columns={[
        { key: 'name', title: 'Name', render: (row) => row.name },
        { key: 'status', title: 'Status', render: (row) => row.status }
      ]}
    />
  )
}
```

这里没有显式写 `<DataTable<User>>`，因为 TypeScript 可以从 `rows={users}` 推断 `TRow = User`。

## 步骤四：组件测试

`packages/ui/src/data-table/DataTable.test.tsx`：

```typescript
import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'

test('renders table rows', () => {
  render(
    <DataTable
      rows={[{ id: 'u1', name: 'Ada' }]}
      getRowKey={(row) => row.id}
      columns={[{ key: 'name', title: 'Name', render: (row) => row.name }]}
    />
  )

  expect(screen.getByText('Ada')).toBeTruthy()
})

test('renders empty state', () => {
  render(
    <DataTable
      rows={[]}
      getRowKey={(row: { id: string }) => row.id}
      columns={[{ key: 'name', title: 'Name', render: (row) => row.id }]}
      emptyText="No users"
    />
  )

  expect(screen.getByRole('status')).toHaveTextContent('No users')
})
```

## 步骤五：构建与 tree-shaking

`packages/ui/package.json`：

```json
{
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

说明：

- 如果写 `sideEffects: false`，CSS import 可能被误删。
- 如果组件入口导入 CSS，应该把 CSS 标记为有副作用。
- JS 组件仍然可以被 tree-shaking，CSS 不能随便丢。

## 练习

1. 把 `getRowKey` 改成必填。
2. 给 `DataTableColumn` 增加 `align`。
3. 写空状态测试。
4. 修改 `sideEffects`，解释为什么 CSS 是副作用。

## 验收

- `DataTable` 能推断 row 类型。
- 组件测试覆盖有数据和空状态。
- package.json 正确处理 CSS side effects。
- 消费者不用 deep import 就能拿到组件和类型。
