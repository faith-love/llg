# turbo 任务图、inputs、outputs、缓存与并行

这一页拆 turbo。它不是“并发跑命令”的工具，而是根据 package 依赖图、任务依赖、输入输出决定哪些任务要跑、哪些任务可以复用缓存。

## 步骤一：定义基础任务

`turbo.json`：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*", "tsconfig*.json", "vite.config.ts"],
      "outputs": ["dist/**"]
    }
  }
}
```

字段说明：

- `dev.cache = false`：开发服务器不应该缓存。
- `dev.persistent = true`：dev 是长时间运行任务。
- `lint.outputs = []`：lint 不产物，只看成功失败。
- `build.dependsOn = ["^build"]`：构建当前包前，先构建它依赖的包。
- `build.outputs = ["dist/**"]`：声明产物位置，缓存恢复时使用。

## 步骤二：理解 `^build`

依赖关系：

```text
admin -> @acme/ui -> @acme/shared
```

执行：

```bash
pnpm --filter admin build
```

任务顺序：

```text
@acme/shared:build
@acme/ui:build
admin:build
```

`^build` 的意思是“当前包的依赖包先执行 build”，不是“父目录先 build”。

## 步骤三：理解 inputs

`inputs` 决定缓存 key：

```json
{
  "inputs": ["$TURBO_DEFAULT$", ".env*", "tsconfig*.json", "vite.config.ts"]
}
```

说明：

- `$TURBO_DEFAULT$` 包含当前包的常见源码和配置。
- `.env*` 变更会影响构建。
- `tsconfig*.json` 变更会影响类型和编译。
- `vite.config.ts` 变更会影响产物。

如果构建依赖某个配置文件，但没有放进 `inputs`，可能出现错误缓存复用。

## 步骤四：理解 outputs

构建任务：

```json
{
  "outputs": ["dist/**"]
}
```

测试任务：

```json
{
  "outputs": ["coverage/**"]
}
```

没有产物的任务：

```json
{
  "outputs": []
}
```

outputs 不只是文档，它影响缓存恢复。声明错了会导致缓存命中后产物缺失。

## 步骤五：观察缓存

第一次：

```bash
pnpm build
```

第二次：

```bash
pnpm build
```

你应该观察：

```text
cache miss, executing ...
cache hit, replaying logs ...
```

修改 `packages/shared/src/index.ts` 后：

```bash
pnpm build
```

应该影响：

```text
@acme/shared:build
@acme/ui:build
admin:build
portal:build
```

如果只改 `apps/admin/src/pages/users/UsersPage.tsx`，不应该重新构建 `portal`。

## 练习

1. 在 `turbo.json` 中补齐 `lint`、`typecheck`、`test`、`build`。
2. 连续跑两次 `pnpm build`，记录 cache hit。
3. 修改 `packages/shared`，观察哪些任务重新执行。
4. 修改 `apps/admin`，观察是否影响 portal。

## 验收

- 能解释 `dependsOn: ["^build"]`。
- 能解释 inputs 为什么影响缓存。
- 能解释 outputs 为什么影响缓存恢复。
- 能根据一次文件变更判断哪些包应该重新执行。
