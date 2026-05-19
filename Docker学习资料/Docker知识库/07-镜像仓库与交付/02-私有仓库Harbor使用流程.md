# 私有仓库 Harbor 使用流程

Harbor 是企业常见私有镜像仓库，常用于内部镜像存储、权限控制、漏洞扫描和项目隔离。

## 基本流程

1. 登录 Harbor。
2. 创建项目。
3. 本地构建镜像。
4. 给镜像打 Harbor 地址标签。
5. 推送镜像。
6. 服务器拉取镜像。

## 命令模板

```bash
docker login harbor.example.com

docker build -t demo-api:1.0.0 .

docker tag demo-api:1.0.0 harbor.example.com/demo/demo-api:1.0.0

docker push harbor.example.com/demo/demo-api:1.0.0

docker pull harbor.example.com/demo/demo-api:1.0.0
```

## 权限注意事项

- 构建账号只需要推送对应项目。
- 部署账号只需要拉取对应项目。
- 不要多人共用管理员账号。
- CI/CD 中的账号要最小权限。

## 常见问题

### push 被拒绝

检查：

- 是否登录正确仓库。
- 是否有项目推送权限。
- 镜像标签是否包含 Harbor 地址和项目路径。

### pull 失败

检查：

- 服务器是否能访问 Harbor。
- 是否登录或配置拉取凭据。
- 镜像标签是否存在。
- TLS 证书是否被信任。

## 生产建议

- Harbor 项目按团队或业务划分。
- 生产镜像开启不可变标签策略时，要配合版本号发布。
- 清理策略不要误删仍需要回滚的镜像。
- 重要镜像推送后记录版本、提交和构建时间。

