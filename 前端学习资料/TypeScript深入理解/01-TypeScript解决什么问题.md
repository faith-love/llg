# TypeScript 解决什么问题

TypeScript 的核心价值不是“让代码看起来高级”，而是在中大型前端项目中减少低级错误、提高重构可靠性、让协作边界更清晰。

## JavaScript 的常见风险

```javascript
function renderUser(user) {
  return user.profile.name.toUpperCase()
}
```

这段代码可能因为很多原因运行时报错：

- `user` 是 `null`。
- `profile` 不存在。
- `name` 不是字符串。
- 后端字段名改了。
- 调用方传错对象。

TypeScript 可以把一部分问题提前到编译期：

```typescript
type User = {
  profile?: {
    name?: string
  }
}

function renderUser(user: User) {
  return user.profile?.name?.toUpperCase() ?? ''
}
```

## TypeScript 带来的收益

### 更早发现错误

```typescript
type User = {
  id: string
  name: string
}

function render(user: User) {
  return user.nickname
}
```

`nickname` 不存在，编辑器和编译器会直接提示。

### 更可靠的重构

字段改名、函数参数变更、返回值结构变更时，TypeScript 能帮你找到受影响的位置。

### 更好的编辑器提示

类型信息让自动补全、跳转定义、查找引用更准确。

### 更清晰的协作契约

```typescript
type CreateUserInput = {
  name: string
  email: string
}

function createUser(input: CreateUserInput) {}
```

调用方不需要猜参数结构。

### 更容易维护复杂状态

```typescript
type PageState =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string }
```

这种写法能让 UI 状态分支更清晰。

## TypeScript 解决不了什么

TypeScript 不会自动解决：

- 接口返回值运行时校验。
- 业务逻辑是否正确。
- 空数组是否符合业务预期。
- 日期字符串是否合法。
- 用户权限是否正确。
- 网络请求是否成功。
- 性能问题。

例如：

```typescript
const user = JSON.parse(localStorage.getItem('user')!) as User
```

这只是告诉 TypeScript “把它当 User”。如果 localStorage 里是坏数据，运行时仍然会出问题。

## TypeScript 的使用边界

适合重点加类型的地方：

- API 入参和返回值。
- 组件 props 和事件。
- 表单模型。
- 状态管理。
- 路由参数。
- 权限和业务状态枚举。
- 公共工具函数。
- SDK 和库的对外 API。

可以少写类型的地方：

- 非导出的简单局部变量。
- 能被清楚推断出的临时值。
- 一次性脚本。
- 测试中非常局部的 mock。

## 好的 TypeScript 代码是什么样

好的 TS 代码通常具备这些特征：

- 类型名贴近业务，不只是 `Data`、`Info`、`Obj`。
- 函数边界清晰，内部依赖推断。
- 不滥用 `any`。
- 对外部输入用 `unknown` 或运行时校验。
- 联合类型有明确判别字段。
- 工具类型为业务服务，而不是炫技。
- 类型和运行时结构一致。

