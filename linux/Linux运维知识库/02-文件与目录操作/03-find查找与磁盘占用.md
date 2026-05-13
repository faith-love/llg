# find 查找与磁盘占用

## 作用

`find`、`df`、`du` 用于解决“文件在哪里、哪个目录占空间、磁盘为什么满”的问题。线上磁盘满、日志过大、旧版本过多、上传文件异常增长时，这几个命令是最常用的定位工具。

## 痛点

- 只知道文件大概名字，不知道具体路径。
- 磁盘满时不知道哪个目录占用最大。
- 误删日志后空间没有释放。
- `find -delete` 没预览就执行，误删文件。
- 不知道 `df` 和 `du` 的区别。

## 优点

- 能快速定位文件、目录、大文件和旧文件。
- 能按时间、大小、类型筛选。
- 能按层级定位磁盘占用。
- 能减少盲目删除。

## find 基础

按名称查找：

```bash
find /opt/apps -name "*.log"
```

按类型查找：

```bash
find /opt/apps -type f -name "*.log"
find /opt/apps -type d -name "logs"
```

按大小查找：

```bash
find /opt/apps -type f -size +100M
```

按修改时间查找：

```bash
find /var/log -type f -mtime -7
find /var/log -type f -mtime +30
```

含义：

- `-mtime -7`：7 天内修改过。
- `-mtime +30`：30 天前修改过。

## 常用组合

查找大日志：

```bash
find /opt/apps -type f -name "*.log" -size +100M
```

查找旧 release：

```bash
find /opt/apps/demo-api/releases -maxdepth 1 -mindepth 1 -type d -mtime +30
```

查找最近修改的配置：

```bash
find /etc -type f -mtime -1 2>/dev/null
```

忽略权限错误：

```bash
find /etc -name "*.conf" 2>/dev/null
```

## 删除前预览

危险命令：

```bash
find /opt/apps -name "*.log" -delete
```

正确流程：

```bash
find /opt/apps/demo-api/shared/logs -type f -name "*.log.*" -mtime +14
```

确认输出后再：

```bash
find /opt/apps/demo-api/shared/logs -type f -name "*.log.*" -mtime +14 -delete
```

删除前至少确认：

- 目录范围是否正确。
- 是否限制了 `-type f`。
- 文件名模式是否正确。
- 时间条件是否正确。
- 是否有备份或可再生成。

## df：看文件系统空间

```bash
df -h
```

关注：

- `Filesystem`：文件系统。
- `Size`：总容量。
- `Used`：已用。
- `Avail`：可用。
- `Use%`：使用率。
- `Mounted on`：挂载点。

判断：

- 80% 以上要关注。
- 90% 以上要安排清理或扩容。
- 100% 可能导致服务写日志失败、数据库写入失败、部署失败。

## du：看目录占用

查看目录总占用：

```bash
du -sh /var/log
```

查看下一级目录占用：

```bash
du -h --max-depth=1 /var | sort -h
du -h --max-depth=1 /opt/apps | sort -h
```

排查顺序：

1. `df -h` 找到满的分区。
2. 进入挂载点，用 `du --max-depth=1` 找大目录。
3. 逐层进入大目录继续查。
4. 判断是日志、上传、备份、缓存还是旧版本。

## df 和 du 不一致

常见原因：文件已删除，但进程仍打开它。

检查：

```bash
sudo lsof | grep deleted
```

处理：

- 确认是哪个进程占用。
- 优先让进程重新打开日志或重启服务。
- 不要为了释放空间盲目 kill。

## 磁盘满处理策略

优先级：

1. 确认是否有可清理的旧日志。
2. 确认是否有旧 release。
3. 确认是否有临时文件或缓存。
4. 压缩或迁移大文件。
5. 配置 logrotate。
6. 评估扩容。

不建议：

- 直接删除数据库数据文件。
- 直接删除当前运行服务日志而不处理进程占用。
- 对 `/` 做全盘无差别删除。

## 使用技巧

- `find` 删除前先预览。
- `du` 排查时从大目录逐层深入。
- 日志增长要靠 logrotate，不要长期手工删。
- release 保留固定数量，清理前确认 current 指向。

## 难点

- `df` 看文件系统，`du` 看目录，两者统计角度不同。
- 被进程打开的已删除文件仍占空间。
- Docker 日志和镜像也可能占用大量空间。
- `find` 条件写错会匹配过多文件。

## 重点

- `df -h` 判断哪个分区满。
- `du -h --max-depth=1` 定位大目录。
- `find` 按名称、类型、大小、时间筛选文件。
- `find -delete` 必须先预览。
- 删除后空间不释放时查 `lsof | grep deleted`。

## 练习

1. 在 `/tmp/find-lab` 创建多个 `.log` 文件，用 `find` 按名称查找。
2. 创建一个大文件，用 `find -size +10M` 找到它。
3. 用 `du --max-depth=1` 找出 `/tmp` 下占用较大的目录。
4. 打开一个文件后删除它，用 `lsof | grep deleted` 观察占用。

