# DNS 服务名与宿主机访问

Docker 网络排障时，先分清访问目标：是另一个容器、宿主机，还是外部服务。

## 容器访问容器

同一个用户自定义网络或同一个 Compose 项目中，优先用服务名访问。

```yaml
services:
  app:
    environment:
      REDIS_HOST: redis
  redis:
    image: redis:7
```

应用中写：

```text
redis:6379
```

不要写容器 IP，因为容器重建后 IP 可能变化。

## 容器访问自己

容器内的 `127.0.0.1` 和 `localhost` 只代表容器自己。

如果应用容器中写：

```text
mysql://127.0.0.1:3306/demo
```

那它会找应用容器自己内部的 MySQL，而不是另一个 MySQL 容器。

## 容器访问宿主机

Docker Desktop 环境通常可以使用：

```text
host.docker.internal
```

Linux 上是否支持要看 Docker 版本和配置，也可以通过网桥网关地址或显式添加 host 记录处理。

示例：

```bash
docker run --add-host=host.docker.internal:host-gateway app:1.0.0
```

## 排查 DNS

```bash
docker exec -it app sh
getent hosts redis
ping redis
nc -vz redis 6379
```

精简镜像可能没有 `ping`、`nc`、`curl`，可以使用临时调试容器。

## 设计建议

- 容器间访问用服务名。
- 容器访问宿主机要显式说明，不要混用 localhost。
- 生产环境尽量减少容器访问宿主机服务，能容器化或托管化的依赖要有清晰网络边界。

