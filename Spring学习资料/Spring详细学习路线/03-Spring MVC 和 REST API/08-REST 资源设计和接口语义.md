# 08-REST 资源设计和接口语义

## 资源而不是动作

REST 设计的核心不是“用英文路径”，而是围绕资源建模。

图书模块可以建模为：

- `books`
- `borrow-records`
- `users`

而不是：

- `getBookList`
- `saveBook`
- `changeBookStatus`

## 路径设计

优先保持：

- 名词化。
- 复数化。
- 层次清楚。

例如：

- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `PATCH /books/{id}/status`
- `GET /users/{userId}/borrow-records`

## 接口语义

要能回答：

- 这是查询还是修改。
- 这是整体替换还是局部变更。
- 这是幂等还是非幂等操作。

这会直接影响前端调用、重试策略和接口文档清晰度。

## 删除接口

删除不一定都是物理删除。

如果业务要保留历史数据，可以是逻辑删除，但接口语义仍然可以是删除语义。

## 本节通过标准

- 能按资源而不是动作命名接口。
- 能解释 `PUT` 和 `PATCH` 的差异。
- 能设计出路径层次清楚的资源关系。


