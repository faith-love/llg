# Docker 安装与版本检查

安装 Docker 的目标不是只让命令能运行，而是确认本机具备构建镜像、运行容器、使用 Compose 和访问镜像仓库的能力。

## 不同系统的选择

| 系统 | 推荐方式 | 说明 |
| --- | --- | --- |
| Windows | Docker Desktop + WSL 2 | 适合开发环境，文件挂载路径和 WSL 发行版要确认 |
| macOS | Docker Desktop | 适合开发环境，注意 CPU 架构差异 |
| Linux | Docker Engine + Compose 插件 | 适合服务器和生产环境 |

## 必查命令

```bash
docker version
docker info
docker compose version
docker run --rm hello-world
```

判断标准：

- `docker version` 能看到 Client 和 Server。
- `docker info` 能输出存储驱动、运行时、镜像和容器数量。
- `docker compose version` 能输出 Compose 版本。
- `hello-world` 能成功拉取并运行。

## Windows 常见问题

### Docker daemon 没启动

现象：

```text
Cannot connect to the Docker daemon
```

处理：

1. 确认 Docker Desktop 已启动。
2. 确认 WSL 2 后端可用。
3. 重启 Docker Desktop。
4. 重新执行 `docker info`。

### 文件挂载很慢

常见原因是项目文件在 Windows 文件系统中，而容器运行在 WSL 2 环境里。大型 Node、Java 项目更明显。

建议：

- 把高频读写项目放到 WSL 文件系统里。
- 不要把 `node_modules`、`target`、日志目录无脑挂载进容器。
- 用 `.dockerignore` 缩小构建上下文。

## Linux 生产环境检查

```bash
systemctl status docker
docker info
docker system df
docker network ls
docker volume ls
```

重点确认：

- Docker 服务是否开机自启。
- 数据根目录是否在预期磁盘。
- 日志驱动和日志大小策略是否符合要求。
- 当前是否已有大量旧镜像、旧容器和无用卷。

## 版本策略

- 学习环境跟随稳定版本即可。
- 生产环境升级 Docker 前先验证 Compose、日志驱动、存储驱动和镜像兼容性。
- 团队内尽量统一 Docker 和 Compose 主版本，减少“我这里能跑”的环境差异。

