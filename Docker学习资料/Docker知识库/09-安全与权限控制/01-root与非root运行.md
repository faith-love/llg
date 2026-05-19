# root 与非 root 运行

容器内 root 不是宿主机 root 的完整等价物，但一旦配合危险挂载、特权模式或漏洞，风险会明显扩大。

## 推荐做法

Dockerfile 中创建专用用户：

```dockerfile
RUN addgroup --system app && adduser --system --ingroup app app
WORKDIR /app
COPY --chown=app:app app.jar /app/app.jar
USER app
```

## UID/GID 对齐

bind mount 写入宿主机目录时，容器用户 UID/GID 和宿主机目录权限要对齐。

检查：

```bash
docker exec -it app id
ls -lah /opt/docker/app/data
```

如果容器内用户没有写权限，应该调整目录属主或运行用户，而不是直接 `chmod 777`。

## 什么时候可能需要 root

- 安装系统包的构建阶段。
- 初始化文件权限。
- 绑定低端口的特殊场景。

即便需要 root，也应尽量只在构建阶段使用，运行阶段切换到普通用户。

## 检查清单

- Dockerfile 是否包含 `USER`。
- 应用是否能用普通用户启动。
- 写入目录是否只开放必要权限。
- 是否避免挂载宿主机敏感目录。
- 是否避免 `--privileged`。

