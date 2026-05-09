# 04-图书馆 REST API

## 项目定位

图书馆 REST API 是 Java 后端入门最适合的完整项目之一。它能覆盖数据库、REST、Spring Boot、事务、参数校验、统一异常和登录鉴权。

这个项目要证明你不只是会写 CRUD，还能处理业务规则。

## 核心功能

- 用户注册和登录。
- 图书 CRUD。
- 图书分类。
- 借阅图书。
- 归还图书。
- 续借。
- 库存校验。
- 分页查询。
- 管理员和普通用户权限。

## 推荐表设计

```text
users
roles
books
book_categories
borrow_records
operation_logs
```

小白阶段控制在 6-8 张表以内，不要一开始过度设计。

## 核心接口

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/books
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
POST   /api/borrows
POST   /api/borrows/{id}/return
POST   /api/borrows/{id}/renew
```

## 关键业务规则

- ISBN 不能重复。
- 库存为 0 时不能借阅。
- 同一本书同一用户不能重复借阅未归还记录。
- 借阅和扣库存必须在同一个事务。
- 归还和恢复库存必须在同一个事务。
- 普通用户不能新增和删除图书。

## 容易出错的示例

### 错误示例：借阅不加事务

```text
新增借阅记录成功
扣减库存失败
```

### 为什么错

会出现借阅记录存在，但库存没有减少的数据不一致。

### 正确做法

把借阅流程放在一个 Service 方法事务里：

```text
校验用户和图书 -> 插入借阅记录 -> 扣减库存 -> 提交事务
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| REST API | 对外提供资源操作 | 前后端协作清楚 | URL 表资源，Method 表动作 | 重点是状态码 |
| 事务 | 保证借阅归还一致 | 防止一半成功 | Service 层加事务 | 难点是边界 |
| 权限 | 控制谁能做什么 | 防止越权操作 | 管理员和普通用户分开 | 重点是后端校验 |
| 统一异常 | 错误响应一致 | 前端更好处理 | code/message/details | 重点是不要全部 200 |

## 验收标准

- 借阅和归还有事务。
- 重复 ISBN 有唯一约束。
- 库存不足返回明确错误。
- 未登录访问返回 401。
- 无权限访问返回 403。
- 核心 Service 有测试。
- README 包含接口示例。

## 面试讲法

```text
这个项目重点是图书借阅业务。我把 Controller、Service、Mapper 分层，借阅和归还都放在 Service 事务里，避免库存和借阅记录不一致。权限上区分管理员和普通用户，错误响应统一返回 code 和 message，核心失败场景写了测试。
```
