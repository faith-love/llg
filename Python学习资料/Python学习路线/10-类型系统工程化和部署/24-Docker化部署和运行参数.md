# Docker化部署和运行参数

Docker能运行不代表适合部署。部署时要关注入口命令、环境变量、日志、健康检查、资源限制、用户权限、关闭信号和数据持久化。

## 入口命令

脚本项目：

```Dockerfile
CMD ["Python学习资料", "-m", "my_project"]
```

FastAPI 项目：

```Dockerfile
CMD ["uvicorn", "my_接口.主:app", "--host", "0.0.0.0", "--port", "8000"]
```

生产环境可能使用更完整的进程管理方式，但学习阶段先明确入口。

## 环境变量

运行时传入：

```powershell
Docker run --rm -e APP_ENV=prod my-接口:0.1.0
```

不要把生产配置写死进镜像。

## 端口映射

```powershell
Docker run --rm -p 8000:8000 my-接口:0.1.0
```

含义：

```text
宿主机端口:Docker端口
```

## 日志

Docker应用应把日志输出到 stdout/stderr，由运行平台收集。

不要只写Docker内部文件，否则Docker删除后日志可能丢失。

## 健康检查

Web 服务提供：

```text
GET /health
```

Docker构建文件 可设置 HEALTHCHECK，但具体部署平台也可能有自己的健康检查配置。

## 资源限制

部署时关注：

- CPU。
- 内存。
- 文件句柄。
- 请求超时。
- worker 数量。

无限制Docker可能影响宿主机其他服务。

## 非 root 用户

生产Docker尽量不要以 root 运行应用进程。

示例思路：

```Dockerfile
RUN add用户 --disabled-password app用户
USER app用户
```

实际命令随基础镜像而不同。

## 优雅关闭

Docker停止时应用会收到信号。应用应：

- 停止接收新请求。
- 处理完当前请求。
- 关闭连接。
- 刷新日志。

## 数据持久化

Docker文件系统通常是临时的。需要持久化的数据应使用：

- 数据库。
- 对象存储。
- volume。
- 外部文件服务。

不要把重要数据只写在Docker内部。

## 常见错误

### 配置构建时写死

导致同一镜像不能用于多个环境。

### 日志写内部文件

平台收集不到。

### Docker无健康检查

服务假死难发现。

### 重要数据写Docker本地

Docker重建后数据丢失。

## 练习

1. 为 FastAPI 项目写Docker启动命令。
2. 使用环境变量传配置。
3. 映射端口访问服务。
4. 增加 `/health` 接口。
5. 让日志输出到 stdout。
6. 说明哪些数据不能写Docker内部。
7. 设计Docker运行参数清单。
8. 增加非 root 用户运行说明。

## 验收标准

- 能设计Docker入口命令。
- 能通过环境变量配置Docker。
- 能配置端口、日志、健康检查。
- 能说明Docker数据持久化边界。
