# 08-Docker 和 Docker Compose

## Docker 解决什么问题

Docker 把应用和运行环境打包，减少“我电脑可以，你电脑不行”的问题。

对 Java 后端小白来说，先用 Docker 解决依赖环境：

- MySQL。
- Redis。
- RabbitMQ 或其他中间件。
- 后端应用镜像。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `docker ps` | 查看运行中的容器 |
| `docker logs` | 查看容器日志 |
| `docker stop` | 停止容器 |
| `docker compose up -d` | 后台启动一组服务 |
| `docker compose down` | 停止并删除服务 |

## Dockerfile 示例

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/book-api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Compose 示例

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: book
    ports:
      - "3306:3306"
```

## 数据持久化

数据库容器如果不挂载卷，删除容器后数据可能丢失。

```yaml
volumes:
  mysql-data:
```

小白阶段先记住：数据库容器要考虑数据卷，应用容器通常可以重新构建。

## 容易出错的示例

### 错误示例：应用容器连接 `localhost`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/book
```

### 为什么错

在容器内部，`localhost` 指的是应用容器自己，不是 MySQL 容器。

### 正确做法

使用 Compose 服务名：

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/book
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 镜像 | 应用运行模板 | 一次构建多处运行 | 版本固定 | 重点是不要用漂移标签 |
| 容器 | 镜像运行实例 | 隔离环境 | 用日志排查 | 难点是网络和卷 |
| Compose | 编排多个服务 | 一条命令启动依赖 | 服务名互联 | 重点是环境变量 |
| 数据卷 | 保存容器数据 | 防止删除容器丢数据 | 数据库挂载卷 | 重点是备份和清理 |

## 本节练习

- 用 Compose 启动 MySQL。
- 编写后端应用 Dockerfile。
- 让应用容器连接 MySQL 容器。
- 查看应用容器日志。

## 本节通过标准

- 能解释镜像和容器区别。
- 能用 Compose 启动依赖。
- 能处理容器间连接地址问题。
- 能查看容器日志定位启动失败。
