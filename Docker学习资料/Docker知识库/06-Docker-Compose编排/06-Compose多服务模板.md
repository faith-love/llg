# Compose 多服务模板

下面是一个适合本地开发的基础模板，包含前端、后端、Redis 和 MySQL 的典型写法。

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: demo-app
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      REDIS_HOST: redis
      MYSQL_HOST: mysql
    depends_on:
      redis:
        condition: service_started
      mysql:
        condition: service_started
    networks:
      - demo-net

  mysql:
    image: mysql:8
    container_name: demo-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: demo
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - demo-net

  redis:
    image: redis:7
    container_name: demo-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: ["redis-server", "--appendonly", "yes"]
    networks:
      - demo-net

volumes:
  mysql-data:
  redis-data:

networks:
  demo-net:
```

## 这个模板的思路

- 应用自己构建镜像。
- MySQL 和 Redis 用官方镜像。
- 数据写入 named volume。
- 服务通过网络名 `demo-net` 连接。
- 环境变量分开管理，便于切换开发和生产配置。

## 常见改造点

### 后端 Java 项目

- 把 `SPRING_PROFILES_ACTIVE` 改成 `docker` 或 `prod`。
- 把数据库地址写成服务名 `mysql`。
- 增加 JVM 参数，例如 `JAVA_TOOL_OPTIONS`。
- 增加健康检查接口。

### 前端静态站点

- 先用 Node 构建。
- 再用 Nginx 镜像托管静态文件。
- 如果需要代理 API，可以再加一个 Nginx 服务。

### MySQL

- 设置时区。
- 调整字符集。
- 配置备份目录或外部备份策略。
- 生产中不要只靠默认 root 账号。

## 启动和排障

```bash
docker compose up -d
docker compose ps
docker compose logs -f app
docker compose exec mysql mysql -uroot -p
```

如果应用启动失败，先看：

1. 容器状态。
2. 数据库是否就绪。
3. 环境变量是否注入正确。
4. 连接串是否用服务名。
5. 端口冲突和权限问题。

