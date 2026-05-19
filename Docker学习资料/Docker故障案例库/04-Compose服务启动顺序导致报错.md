# Compose 服务启动顺序导致报错

## 现象

Compose 已经把所有容器拉起来，但应用仍然启动失败，日志里显示数据库连接失败或缓存连接失败。

## 原因

`depends_on` 只能保证启动顺序，不能保证数据库、Redis 这种服务已经可用。

## 排查

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f mysql
```

## 修复

- 给依赖服务加 `healthcheck`。
- 在应用里加重试和等待逻辑。
- 不要把“容器启动”误当成“服务就绪”。

## 长期修复

- 把依赖服务可用性写入部署检查。
- 关键依赖必须有健康检查。
- 启动脚本里预留等待和重试。

