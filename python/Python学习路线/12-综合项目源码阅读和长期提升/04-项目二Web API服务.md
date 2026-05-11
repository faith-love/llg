# 项目二：Web API服务

Web API 服务适合展示后端开发能力：HTTP、FastAPI、数据库、参数校验、认证授权、测试、文档、日志、部署和安全边界。

## 项目目标

实现一个完整 API 服务，例如：

- 图书管理。
- 任务管理。
- 个人知识库。
- 文件元数据管理。
- 小型库存系统。

推荐选择业务规则清晰、范围可控的题目。

## 必备功能

MVP：

- 创建资源。
- 查询列表。
- 查询详情。
- 更新资源。
- 删除资源。
- 分页。
- 参数校验。
- 错误响应。

进阶：

- API Key 或 Bearer Token。
- 角色权限。
- 文件上传。
- 导出 CSV。
- 审计日志。
- Docker 部署。

## 技术覆盖

覆盖：

- FastAPI。
- Pydantic。
- SQLAlchemy。
- Alembic。
- pytest。
- TestClient。
- OpenAPI。
- logging。
- Docker。
- CI。

## 推荐结构

```text
api_service/
  README.md
  pyproject.toml
  src/
    api_service/
      main.py
      settings.py
      routers/
      schemas/
      services/
      repositories/
      db/
  tests/
```

## API 示例

```text
GET /api/v1/books
POST /api/v1/books
GET /api/v1/books/{book_id}
PATCH /api/v1/books/{book_id}
DELETE /api/v1/books/{book_id}
```

## 错误响应

统一结构：

```json
{
  "error": {
    "code": "BOOK_NOT_FOUND",
    "message": "图书不存在"
  }
}
```

## 测试要求

至少覆盖：

- 创建成功。
- 参数错误。
- 查询不存在。
- 分页边界。
- 更新成功。
- 删除成功。
- 认证失败。
- 权限不足。
- 错误响应结构。

## 部署要求

至少提供：

- `.env.example`。
- Dockerfile。
- 健康检查接口。
- 启动命令。
- 日志说明。

## 常见错误

### 只有 CRUD 没有质量

必须加测试、文档、错误和安全。

### 路由函数过重

业务逻辑拆到 service。

### 数据库迁移缺失

表结构变化要可追踪。

### 认证只做样子

受保护资源必须真正校验权限。

## 验收标准

- API 能本地运行。
- `/docs` 可查看。
- CRUD 完整。
- 测试通过。
- 错误响应统一。
- 有认证或权限示例。
- 能容器化运行。
