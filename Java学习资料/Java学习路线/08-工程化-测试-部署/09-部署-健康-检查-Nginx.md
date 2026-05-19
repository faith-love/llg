# 09-部署、健康检查和 Nginx 了解

## 部署解决什么问题

部署是把本地项目放到可运行环境中，让别人能访问。

部署不是简单复制 jar。一个可维护部署至少要考虑：

- 启动命令。
- 环境变量。
- JDBC。
- 日志路径。
- 健康检查。
- 端口暴露。
- Nginx。

## 最小部署流程

```text
mvn clean package
Docker build -t book-接口:1.0.0 .
Docker 通用pose up -d
curl http://localhost:8080/监控端点/health
```

## 健康检查

Spring Boot 常用 Actuator：

```text
GET /监控端点/health
```

健康检查的作用：

- 判断应用是否启动成功。
- 判断数据库等依赖是否可用。
- 方便部署平台自动探活。

## Nginx 了解

Nginx 常用于：

- Nginx。
- HTTPS 终止。
- 静态资源服务。
- 简单负载均衡。

小白阶段先理解Nginx：

```text
用户 -> Nginx:80 -> Java 应用:8080
```

## 容易出错的示例

### 错误示例：只看Docker running

```text
Docker ps 显示Docker在运行，所以应用一定正常。
```

### 为什么错

Docker运行不代表应用可用。应用可能JDBC失败、接口报错或健康检查失败。

### 正确做法

启动后必须访问健康检查和核心接口：

```text
curl http://localhost:8080/监控端点/health
curl http://localhost:8080/接口/books
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 打包 | 生成可运行产物 | 本地源码不能直接部署 | `mvn clean package` | 重点是测试先通过 |
| 健康检查 | 判断服务是否可用 | Docker运行不等于应用可用 | 使用 Actuator | 重点是检查依赖 |
| Nginx | 统一入口转发请求 | 隐藏后端端口 | Nginx 转发到 8080 | 难点是路径和头部 |
| 发布验证 | 部署后确认功能 | 避免静默失败 | 验证健康和核心接口 | 重点是有清单 |

## 本节练习

- 给项目加入 Actuator。
- 部署后访问健康检查。
- 写一份发布验证清单。
- 了解一个 Nginx Nginx配置示例。

## 本节通过标准

- 能完成 jar 或镜像部署。
- 能用健康检查确认服务可用。
- 能说明 Nginx Nginx的基本作用。
- 能部署后验证核心接口。
