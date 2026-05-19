# MySQL 与 Redis 开发环境模板

这个模板用于本地开发联调，不是直接生产配置。

## compose.yaml

```yaml
services:
  mysql:
    image: mysql:8
    container_name: demo-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: demo
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7
    container_name: demo-redis
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  mysql-data:
  redis-data:
```

## 启动

```bash
docker compose up -d
docker compose ps
docker compose logs -f mysql
```

## 连接信息

本机开发工具连接：

- MySQL：`127.0.0.1:3306`
- Redis：`127.0.0.1:6379`

其他容器连接：

- MySQL 主机名：`mysql`
- Redis 主机名：`redis`

## 注意事项

- 生产环境不要使用示例密码。
- 生产不要把数据库直接暴露公网。
- 删除容器不会删除 volume。
- 删除 volume 会删除数据。

