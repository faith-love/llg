# Compose 环境变量与 profiles

Compose 中环境变量来源很多，容易出现“明明写了但没生效”的问题。

## 三种常见来源

| 来源 | 用途 |
| --- | --- |
| `.env` | Compose 文件变量替换 |
| `environment` | 注入到容器环境变量 |
| `env_file` | 从文件批量注入容器环境变量 |

## .env 示例

`.env`：

```text
APP_PORT=8080
APP_IMAGE=demo-app:1.0.0
```

`compose.yaml`：

```yaml
services:
  app:
    image: ${APP_IMAGE}
    ports:
      - "${APP_PORT}:8080"
```

这里 `.env` 是给 Compose 解析文件时使用。

## env_file 示例

```yaml
services:
  app:
    env_file:
      - app.env
```

`app.env`：

```text
SPRING_PROFILES_ACTIVE=docker
REDIS_HOST=redis
```

这些变量会进入容器。

## profiles

profiles 用于控制某些服务是否启动。

```yaml
services:
  app:
    image: demo-app:1.0.0

  adminer:
    image: adminer
    profiles:
      - debug
```

默认启动不会启动 `adminer`：

```bash
docker compose up -d
```

带 profile 启动：

```bash
docker compose --profile debug up -d
```

## 注意事项

- `.env` 不等于自动注入容器，除非 compose 文件引用或使用 `env_file`。
- 敏感配置不要提交到仓库。
- 提供 `.env.example` 说明必填变量。
- 生产环境变量由部署平台或服务器环境统一管理。

