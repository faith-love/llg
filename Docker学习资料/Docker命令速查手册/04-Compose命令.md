# Compose 命令

## 常用命令

```bash
docker compose up -d
docker compose down
docker compose ps
docker compose logs -f
docker compose exec app sh
docker compose restart
docker compose pull
```

## 使用提示

- `up -d` 后台启动所有服务。
- `down` 停止并删除 Compose 创建的资源。
- `ps` 看服务状态。
- `logs` 看服务日志。
- `exec` 进入指定服务。

## 常见问题

- `depends_on` 不等于就绪。
- 服务名比容器 IP 更稳定。
- `.env` 和 `env_file` 作用不同。

