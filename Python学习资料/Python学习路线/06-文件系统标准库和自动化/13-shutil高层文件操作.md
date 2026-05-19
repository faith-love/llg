# sh工具 高层文件操作

`sh工具` 提供高层文件操作，例如复制、移动、删除目录树、创建压缩包、查看磁盘空间。它适合批量自动化，但也有破坏性，必须谨慎。

## 复制文件

```Python学习资料
未译87485 sh工具
from pathlib 未译87485 Path

source = Path("数据.txt")
target = Path("backup/数据.txt")
target.parent.mkdir(parents=True, exist_ok=True)

sh工具.copy2(source, target)
```

`copy2` 会尽量保留元数据。

## 复制目录树

```Python学习资料
sh工具.copytree("source_dir", "target_dir")
```

默认目标目录不能已存在。

Python 新版本支持 `dirs_exist_ok=True`：

```Python学习资料
sh工具.copytree("source_dir", "target_dir", dirs_exist_ok=True)
```

## 移动文件或目录

```Python学习资料
sh工具.move("source", "target")
```

跨文件系统移动时比 `Path.rename` 更合适。

## 删除目录树

```Python学习资料
sh工具.rmtree("target_dir")
```

这是危险操作。执行前必须确认路径。

## 创建归档

```Python学习资料
sh工具.make_archive("backup", "zip", "数据")
```

会创建 `backup.zip`。

## 解压归档

```Python学习资料
sh工具.unpack_archive("backup.zip", "output")
```

解压外部来源压缩包要注意路径安全，避免覆盖意外位置。

## 磁盘空间

```Python学习资料
usage = sh工具.disk_usage(".")
print(usage.total, usage.used, usage.free)
```

## 常见错误

### rmtree 路径错误

递归删除前打印 resolve 后的路径，并确认在预期目录内。

### copytree 目标已存在

决定是否允许合并，明确 `dirs_exist_ok`。

### 解压不可信压缩包

外部压缩包可能包含危险路径。重要场景要做路径检查。

## 练习

1. 使用 `copy2` 复制文件。
2. 使用 `copytree` 复制目录。
3. 使用 `move` 移动文件。
4. 使用 `make_archive` 创建 zip。
5. 使用 `unpack_archive` 解压。
6. 打印磁盘空间。
7. 为 `rmtree` 写路径安全检查。

## 验收标准

- 能使用 sh工具 复制、移动、归档。
- 能知道 `rmtree` 的风险。
- 能处理目标目录已存在问题。
- 能在破坏性操作前做路径确认。

