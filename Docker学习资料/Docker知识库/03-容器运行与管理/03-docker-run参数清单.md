# docker run 参数清单

`docker run` 是 Docker 最重要也最容易写乱的命令。它同时承担创建容器、设置网络、挂载数据、注入配置、限制资源和启动进程的职责。

## 基础形式

```bash
docker run [选项] 镜像名[:标签] [命令] [参数]
```

示例：

```bash
docker run --rm alpine:3.20 echo hello
```

含义：基于 `alpine:3.20` 启动临时容器，执行 `echo hello`，退出后删除容器。

## 常用参数分类

| 类别 | 参数 | 说明 |
| --- | --- | --- |
| 运行方式 | `-d` | 后台运行 |
| 运行方式 | `-it` | 交互式终端，常用于 shell |
| 命名 | `--name` | 指定容器名 |
| 清理 | `--rm` | 容器退出后自动删除 |
| 端口 | `-p 主机端口:容器端口` | 发布端口 |
| 环境变量 | `-e KEY=value` | 注入环境变量 |
| 环境变量 | `--env-file .env` | 从文件注入环境变量 |
| 挂载 | `-v volume名:容器路径` | named volume |
| 挂载 | `-v 主机路径:容器路径` | bind mount |
| 网络 | `--network 网络名` | 加入指定网络 |
| 重启 | `--restart unless-stopped` | 设置重启策略 |
| 资源 | `--memory 512m` | 限制内存 |
| 资源 | `--cpus 1.5` | 限制 CPU |
| 用户 | `-u UID:GID` | 指定运行用户 |
| 工作目录 | `-w /app` | 设置容器内工作目录 |

## 后台服务模板

```bash
docker run -d \
  --name redis-dev \
  --restart unless-stopped \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7 \
  redis-server --appendonly yes
```

这个模板适合学习和开发环境。生产环境还要补充密码、网络隔离、持久化策略、监控和备份。

## 临时调试模板

```bash
docker run --rm -it \
  --network app-net \
  nicolaka/netshoot
```

调试容器用于在同一个 Docker 网络里执行 DNS、端口、路由和 HTTP 检查。不要把调试工具长期装进业务镜像。

## 环境变量模板

```bash
docker run -d \
  --name app \
  --env-file .env \
  -e SPRING_PROFILES_ACTIVE=prod \
  app:1.0.0
```

注意：

- `.env` 不应提交到公开仓库。
- 敏感信息不要写进 Dockerfile。
- 环境变量在 `docker inspect` 中可能可见，高安全场景应使用 Secret 管理。

## 常见错误

### 端口方向写反

正确：

```bash
docker run -p 8080:80 nginx
```

含义是宿主机 `8080` 访问容器 `80`。

### 容器启动后立刻退出

常见原因：

- 主进程执行完就退出，例如执行了 `echo`。
- 启动命令错误。
- 配置文件路径错误。
- 应用启动失败。

排查：

```bash
docker ps -a
docker logs 容器名
docker inspect 容器名
```

### 以为 EXPOSE 会自动发布端口

`EXPOSE` 只是镜像元数据，不等于 `-p`。外部要访问容器服务，仍需要发布端口或通过同网络的其他容器访问。

