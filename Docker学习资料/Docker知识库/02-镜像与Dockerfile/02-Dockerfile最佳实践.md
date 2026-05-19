# Dockerfile 最佳实践

Dockerfile 的质量直接影响构建速度、镜像体积、安全性和生产可维护性。下面按真实项目最常见的问题整理。

## 一、基础镜像要可控

不建议：

```dockerfile
FROM openjdk:latest
```

建议：

```dockerfile
FROM eclipse-temurin:17-jre
```

原因：

- `latest` 会变化，生产复现困难。
- 明确 JDK/JRE 主版本，升级可控。
- 运行阶段通常不需要完整构建工具链。

## 二、先复制依赖描述文件，再复制源码

Node 示例：

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

这样做的好处是：只有源码变化时，不会每次都重新安装依赖；只有 `package.json` 或锁文件变化时，依赖层才失效。

## 三、使用多阶段构建

Java 示例：

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建阶段可以包含 Maven、Node、编译器等工具；运行阶段只保留运行应用需要的文件。这样能减少镜像体积，也减少攻击面。

## 四、不要把敏感信息写进镜像

错误做法：

```dockerfile
ENV DB_PASSWORD=prod_password
COPY id_rsa /root/.ssh/id_rsa
```

正确方向：

- 密码通过环境变量、Secret 管理、配置中心或部署平台注入。
- 私钥不要进入镜像。
- `.env` 加入 `.dockerignore`。
- 构建日志也不要输出敏感信息。

## 五、用非 root 用户运行

示例：

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app
COPY target/app.jar app.jar
USER app
ENTRYPOINT ["java", "-jar", "app.jar"]
```

如果应用确实需要写目录，要先创建目录并调整权限，而不是为了省事用 root 跑所有服务。

## 六、把启动命令设计清楚

常见选择：

- `CMD`：给镜像提供默认命令，运行时可以覆盖。
- `ENTRYPOINT`：固定入口，适合命令行工具或统一启动脚本。
- `ENTRYPOINT + CMD`：固定程序，参数可覆盖。

示例：

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=prod"]
```

运行时可以覆盖默认参数：

```bash
docker run app:1.0.0 --spring.profiles.active=test
```

## 七、让日志进入标准输出

容器平台最容易采集的是 stdout 和 stderr。应用应优先把日志打到控制台，再由 Docker、Compose、日志代理或平台采集。

不建议让容器内日志无限写入默认可写层。必须写文件时，应挂载日志目录并配置轮转。

## 八、镜像体积优化清单

- 使用更小的运行时基础镜像，但不要牺牲排障能力到不可维护。
- 多阶段构建，只把产物复制到运行镜像。
- 合理使用 `.dockerignore`。
- 合并安装和清理命令，避免缓存文件留在上一层。
- 不复制测试数据、源码历史、构建缓存和本地依赖。
- 定期检查镜像大小：`docker images`、`docker history 镜像名`。

## 九、上线前检查

- 是否固定基础镜像标签。
- 是否使用非 root 用户。
- 是否没有把密码、Token、私钥打进镜像。
- 是否声明并文档化端口。
- 是否能用环境变量覆盖运行配置。
- 是否有健康检查或至少有外部健康检查路径。
- 是否能在干净机器上从零构建成功。
- 是否有镜像版本、构建提交和回滚标签。

