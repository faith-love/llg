# CI/CD 镜像交付流水线

容器化交付的核心是让镜像从源码到生产有固定流程，并且每一步可追溯。

## 推荐流水线

```text
代码提交
  -> 单元测试
  -> 构建应用产物
  -> 构建镜像
  -> 镜像扫描
  -> 打版本标签
  -> 推送仓库
  -> 部署测试环境
  -> 验证
  -> 发布生产
  -> 保留回滚版本
```

## 构建阶段

```bash
docker build \
  --build-arg GIT_COMMIT=$GIT_COMMIT \
  -t registry.example.com/team/app:$VERSION \
  -t registry.example.com/team/app:git-$SHORT_SHA \
  .
```

建议把构建信息写入镜像标签、镜像标签元数据或应用启动信息中。

## 推送阶段

```bash
docker login registry.example.com
docker push registry.example.com/team/app:$VERSION
docker push registry.example.com/team/app:git-$SHORT_SHA
```

CI 密码应使用平台密钥管理，不写进仓库。

## 部署阶段

部署系统只接收明确镜像标签：

```text
registry.example.com/team/app:1.4.2
```

不要在部署阶段重新构建镜像。否则测试过的镜像和生产运行的镜像可能不是同一个。

## 验证阶段

上线后必须验证：

- 容器状态。
- 健康接口。
- 核心业务接口。
- 日志中是否有启动错误。
- 关键依赖连接是否正常。

## 回滚原则

- 回滚使用已存在的旧镜像标签。
- 回滚前确认数据库变更是否兼容。
- 回滚后保留失败版本用于复盘。

