# Docker 运行链路

理解运行链路可以帮助你判断问题发生在哪一层：命令行、Docker daemon、镜像拉取、容器运行时、网络、挂载，还是应用自身。

## 从 docker run 到应用启动

```text
docker CLI
  -> Docker API
  -> Docker daemon
  -> image pull/build 检查
  -> containerd
  -> runc
  -> namespace/cgroup/mount/network
  -> 应用主进程
```

## 每一层常见问题

| 层级 | 常见问题 | 排查命令 |
| --- | --- | --- |
| CLI | 命令参数写错、上下文不对 | `docker --help` |
| daemon | Docker 服务没启动、权限不足 | `docker info`、`systemctl status docker` |
| 镜像 | 镜像不存在、拉取失败、架构不匹配 | `docker pull`、`docker images` |
| 运行时 | 容器创建失败、权限能力不足 | `docker inspect` |
| 网络 | 端口冲突、DNS 失败、服务名写错 | `docker network inspect` |
| 挂载 | 路径不存在、权限不足、只读挂载 | `docker inspect`、`ls -lah` |
| 应用 | 配置错误、依赖不可用、启动命令错误 | `docker logs` |

## daemon 权限问题

Linux 上普通用户执行 Docker 可能遇到权限错误。常见处理是把用户加入 `docker` 组，但这等价于给用户很高的宿主机控制能力，生产服务器上要谨慎。

```bash
sudo usermod -aG docker 用户名
```

执行后通常需要重新登录。

## 容器退出不一定是 Docker 错

容器退出只说明主进程退出。可能原因包括：

- 应用启动失败。
- 命令执行完成。
- 配置文件不存在。
- 环境变量缺失。
- 依赖服务不可用。
- OOM 被杀。

第一时间看：

```bash
docker ps -a
docker logs 容器名
docker inspect 容器名
```

