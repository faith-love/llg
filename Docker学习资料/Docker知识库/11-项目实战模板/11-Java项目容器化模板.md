# Java 项目容器化模板

这是一个适合 Spring Boot 或普通 Java API 的通用模板。

## Dockerfile

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd -r -u 1001 appuser
COPY --from=build /src/target/*.jar /app/app.jar
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

## Compose 示例

```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SERVER_PORT: 8080
      REDIS_HOST: redis
      MYSQL_HOST: mysql
    depends_on:
      - redis
      - mysql
    networks:
      - app-net

  redis:
    image: redis:7
    networks:
      - app-net

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: demo
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-net

volumes:
  mysql-data:

networks:
  app-net:
```

## 常见改造点

- JVM 参数通过 `JAVA_TOOL_OPTIONS` 或启动参数注入。
- 日志改成控制台输出。
- 配置文件按 `docker`、`prod`、`test` 分环境管理。
- 数据库连接不要写 `localhost`。
- 端口不要和宿主机其他服务冲突。

## 验收清单

- `docker compose up -d` 能启动。
- `docker logs` 没有明显启动错误。
- `/health` 或等价接口可访问。
- 数据库、缓存、文件写入正常。
- 重启容器后数据仍在。
- 回滚到旧标签可成功恢复。

