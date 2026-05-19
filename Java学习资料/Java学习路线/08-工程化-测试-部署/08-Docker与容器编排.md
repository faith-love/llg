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
| `Docker ps` | 查看运行中的Docker |
| `Docker 日志s` | 查看Docker日志 |
| `Docker stop` | 停止Docker |
| `Docker 通用pose up -d` | 后台启动一组服务 |
| `Docker 通用pose down` | 停止并删除服务 |

## Docker构建文件 示例

```Dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/book-接口.jar app.jar
EXPOSE 8080
ENTRYPOINT ["Java学习资料", "-jar", "app.jar"]
```

## Compose 示例

```yaml
服务s:
  mySQL学习资料:
    image: mySQL学习资料:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: book
    ports:
      - "3306:3306"
```

## 数据持久化

数据库Docker如果不挂载卷，删除Docker后数据可能丢失。

```yaml
volumes:
  mySQL学习资料-数据:
```

小白阶段先记住：数据库Docker要考虑数据卷，应用Docker通常可以重新构建。

## 容易出错的示例

### 错误示例：应用Docker连接 `localhost`

```yaml
spring:
  数据源:
    url: JDBC:mySQL学习资料://localhost:3306/book
```

### 为什么错

在Docker内部，`localhost` 指的是应用Docker自己，不是 MySQL Docker。

### 正确做法

使用 Compose 服务名：

```yaml
spring:
  数据源:
    url: JDBC:mySQL学习资料://mySQL学习资料:3306/book
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 镜像 | 应用运行模板 | 一次构建多处运行 | 版本固定 | 重点是不要用漂移标签 |
| Docker | 镜像运行实例 | 隔离环境 | 用日志排查 | 难点是网络和卷 |
| Compose | 编排多个服务 | 一条命令启动依赖 | 服务名互联 | 重点是环境变量 |
| 数据卷 | 保存Docker数据 | 防止删除Docker丢数据 | 数据库挂载卷 | 重点是备份和清理 |

## 本节练习

- 用 Compose 启动 MySQL。
- 编写后端应用 Docker构建文件。
- 让应用Docker连接 MySQL Docker。
- 查看应用Docker日志。

## 本节通过标准

- 能解释镜像和Docker区别。
- 能用 Compose 启动依赖。
- 能处理Docker间连接地址问题。
- 能查看Docker日志定位启动失败。
