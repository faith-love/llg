# Docker基础

Docker 用于把应用和运行环境打包成镜像，让应用在不同机器上更一致地运行。学习 Docker 的重点不是背命令，而是理解镜像、Docker、Docker构建文件、构建上下文和运行配置。

## 镜像和Docker

镜像：

- 应用和依赖的只读模板。
- 通过 Docker构建文件 构建。

Docker：

- 镜像运行起来的实例。
- 有自己的进程、文件系统和网络视图。

## Docker构建文件 示例

```Dockerfile
F未译25173OM Python学习资料:3.14-slim

WO未译25173KDI未译25173 /app

COPY pyproject.toml 说明.md ./
COPY 源码 ./源码

未译25173UN pip install --no-缓存-dir .

CMD ["Python学习资料", "-m", "my_project"]
```

实际项目要根据入口和依赖管理方式调整。

## 构建镜像

```powershell
Docker build -t my-project:0.1.0 .
```

## 运行Docker

```powershell
Docker run --rm my-project:0.1.0
```

Web 服务：

```powershell
Docker run --rm -p 8000:8000 my-接口:0.1.0
```

## .Dockerignore

应排除：

```text
.git
.venv
__py缓存__
.py测试_缓存
.mypy_缓存
.ruff_缓存
dist
build
.env
测试s
```

不要把本地虚拟环境、缓存、密钥放进镜像构建上下文。

## 镜像层

Docker构建文件 每条指令会形成层。依赖安装步骤应尽量利用缓存。

常见优化：

- 先复制依赖文件。
- 安装依赖。
- 再复制源码。

这样源码变化不会总是重新安装依赖。

## slim 镜像

`Python学习资料:3.14-slim` 比完整镜像更小，但可能缺少编译工具和系统库。需要根据依赖决定。

## 常见错误

### 把 .env 打进镜像

严重密钥泄露风险。

### COPY 整个目录

可能把缓存、测试数据、虚拟环境放进去。

### 使用 la测试 标签

构建不可复现。

### 镜像里安装 dev 依赖

增加体积和攻击面。

## 练习

1. 写一个最小 Docker构建文件。
2. 构建镜像。
3. 运行Docker。
4. 添加 `.Dockerignore`。
5. 检查构建上下文是否包含 `.env`。
6. 固定基础镜像版本。
7. 对比 slim 和完整镜像大小。
8. 写 Docker 构建说明。

## 验收标准

- 能解释镜像和Docker。
- 能写基础 Docker构建文件。
- 能使用 `.Dockerignore`。
- 能避免密钥和无关文件进入镜像。
