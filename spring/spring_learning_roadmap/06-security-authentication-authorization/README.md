# 06-阶段导读：Spring Security 和认证授权

## 这一阶段解决什么问题

这个阶段学习如何保护接口、组织登录流程、建立权限边界。目标不是背过滤器链名字，而是把“你是谁、你能做什么、失败时怎么响应”设计清楚。

## 学习顺序

建议按下面顺序读：

1. [认证和授权的基本概念](01-authentication-and-authorization.md)
2. [登录方式选择：Session、JWT、OAuth2](02-login-approaches.md)
3. [SecurityFilterChain 和请求保护](03-security-filter-chain-and-url-protection.md)
4. [密码、401/403、登出和常见配置](04-password-error-logout-csrf-cors.md)
5. [角色权限模型和方法级授权](05-role-permission-method-security.md)
6. [阶段练习和通过标准](06-stage-practice-checkpoints.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

7. [UserDetails、密码哈希和用户加载](07-userdetails-password-hash.md)
8. [Session、Cookie 和状态式登录流](08-session-cookie-login-flow.md)
9. [JWT 结构、刷新和失效控制](09-jwt-refresh-revocation.md)
10. [SecurityFilterChain 请求链路](10-securityfilterchain-request-flow.md)
11. [方法级授权和表达式边界](11-method-security-and-expression.md)
12. [CSRF、CORS、登出和安全上下文](12-csrf-cors-logout-securitycontext.md)
13. [认证失败、授权失败和统一错误响应](13-auth-error-handling.md)
14. [后台权限系统项目落地](14-permission-system-project.md)
15. [常见陷阱和排查手册](15-pitfall-guide.md)
16. [阶段总验收](16-checkpoints.md)

## 小白需要先记住的结论

- 认证是“你是谁”，授权是“你能做什么”。
- 前端隐藏按钮不等于后端权限校验。
- JWT 不是默认更先进，只是适合某些架构选择。
- 401 和 403 必须区分清楚。

## 本阶段产出

完成本阶段后，至少产出：

- 一个登录接口。
- 一套密码加密和用户加载逻辑。
- 一套公开接口和受保护接口配置。
- 一套角色权限示例。
- 一份 401/403/登出处理笔记。
