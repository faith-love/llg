# volume、bind mount、tmpfs 选择

挂载方式选错，会直接导致数据丢失、权限混乱或生产迁移困难。

## 选择规则

| 场景 | 推荐方式 | 原因 |
| --- | --- | --- |
| MySQL 数据目录 | named volume | Docker 管理路径，适合长期持久化 |
| Redis AOF/RDB | named volume | 容器重建后数据仍保留 |
| 应用上传文件 | bind mount 或 named volume | 取决于是否要固定宿主机路径 |
| Nginx 配置 | bind mount 只读 | 配置可被宿主机直接管理 |
| 开发源码热更新 | bind mount | 本地编辑，容器内立即生效 |
| 临时缓存 | tmpfs | 不落盘，容器停止即清理 |

## named volume

```bash
docker volume create app-data
docker run -v app-data:/data app:1.0.0
```

适合：

- 数据由容器服务长期管理。
- 不关心宿主机具体路径。
- 需要 Docker 统一查看、备份和迁移。

## bind mount

```bash
docker run -v /opt/app/config:/app/config:ro app:1.0.0
```

适合：

- 配置文件外置。
- 开发环境源码热更新。
- 生产目录已有标准规划。

风险：

- 宿主机路径不存在可能被自动创建为空目录。
- 权限由宿主机文件系统决定。
- Windows、macOS、Linux 文件挂载行为有差异。

## tmpfs

```bash
docker run --tmpfs /tmp app:1.0.0
```

适合：

- 临时文件。
- 不希望写入磁盘的短期敏感数据。
- 可丢弃缓存。

不适合：

- 数据库。
- 上传文件。
- 需要重启保留的数据。

## 生产决策

生产环境先把目录分成三类：

- 配置：只读挂载。
- 数据：持久化挂载并备份。
- 日志：控制体积并采集。

不要把所有东西都挂到一个大目录，也不要让应用把重要数据写进容器可写层。

