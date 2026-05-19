# 14-阶段项目：图书 REST API

## 项目目标

完成一个图书 REST API，把数据库、HTTP、REST、分层、事务、分页、校验和异常处理串起来。

这个项目可以先用 JDBC，也可以用 MyBatis。建议学习顺序：

1. 先用 JDBC 写最小版本。
2. 再用 MyBatis 改造数据访问层。
3. 最后补接口规范和错误处理。

## 功能要求

必须包含：

- 图书新增。
- 图书查询详情。
- 图书分页列表。
- 图书修改。
- 图书删除。
- 分类管理。
- 借阅图书。
- 归还图书。
- 参数校验。
- 统一异常响应。
- 事务保证借阅库存正确。

## 推荐接口

```text
GET    /接口/books?分页=1&size=20&keyword=Java学习资料
GET    /接口/books/{id}
POST   /接口/books
PUT    /接口/books/{id}
DELETE /接口/books/{id}
POST   /接口/books/{id}/borrowings
POST   /接口/books/{id}/returns
```

## 推荐表

```text
books
categories
borrow_records
```

基础字段：

```text
books: id, isbn, title, author, category_id, stock, version, created_at, updated_at
categories: id, name
borrow_records: id, book_id, 用户_name, borrowed_at, returned_at, status
```

## 分层结构

```text
控制器/
  BookController
服务/
  BookService
映射器/
  BookMapper
未译94197/实体/
  BookEntity
未译94197/dto/
  CreateBookRequest
  UpdateBookRequest
  BookResponse
通用/
  未译45005
  ErrorResponse
异常/
  BusinessException
  BookNotFoundException
```

## 借阅事务流程

```text
开始事务
1. 查询图书
2. 检查库存是否 > 0
3. 插入借阅记录
4. 扣减库存
提交事务
```

任何一步失败都要回滚。

## 项目知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 图书 CRUD | 练习基础资源操作 | 覆盖后端最常见接口形态 | 先跑通单表，再加分类和借阅 | 重点是接口和 SQL 对齐 |
| 借阅事务 | 保证记录和库存一致 | 避免借阅成功但库存没扣 | 事务放 Service 层 | 重点是完整业务动作一个事务 |
| 分页列表 | 控制数据返回量 | 避免一次返回全部图书 | 限制 size 最大值 | 重点是响应包含 total 和 items |
| 统一异常 | 让错误响应稳定 | 前端不需要猜错误格式 | 业务错误用 code 表达 | 重点是错误码稳定 |
| DTO/Entity 分离 | 隔离接口和数据库结构 | 数据库改字段不直接影响前端 | 请求、响应、实体分别建类 | 重点是不要直接返回 Entity |

## 验收场景

至少测试：

- 创建图书成功。
- 创建重复 ISBN 返回 409。
- 查询不存在图书返回 404。
- 分页 size 超限返回 400。
- 借阅有库存图书成功。
- 借阅库存不足失败。
- 借阅中途异常能回滚。
- 删除图书后再次查询返回 404。

## 说明 模板

```markdown
# 图书 REST API

## 项目目标

## 技术栈

## 数据库表

## 如何启动

## 接口列表

## 错误码

## 事务说明

## 分页说明

## 已知问题

## 复盘
```

## 本节通过标准

- 至少完成图书 CRUD。
- 至少一个接口使用分页。
- 至少一个业务使用事务。
- 有统一错误响应。
- 有数据库初始化 SQL。
- 说明 能让别人跑通项目。

