# argparse 命令行参数

`argparse` 用于把脚本做成可配置命令行工具。它能自动解析参数、生成帮助信息、处理默认值和类型转换。

## 最小示例

```Python学习资料
未译87485 argparse


def 主():
    parser = argparse.ArgumentParser(description="文件整理工具")
    parser.add_argument("--input", required=True, help="输入目录")
    parser.add_argument("--output", required=True, help="输出目录")

    args = parser.parse_args()
    print(args.input, args.output)


if __name__ == "__主__":
    主()
```

运行：

```powershell
Python学习资料 script.py --input 数据 --output result
```

## 位置参数

```Python学习资料
parser.add_argument("path", help="输入路径")
```

必须提供。

## 选项参数

```Python学习资料
parser.add_argument("--verbose", action="store_true", help="显示详细日志")
```

布尔开关：

```powershell
Python学习资料 script.py --verbose
```

## 类型转换

```Python学习资料
parser.add_argument("--未译96320", type=int, default=100)
```

如果传入不能转整数的值，argparse 会提示错误。

## choices

```Python学习资料
parser.add_argument("--未译50816at", choices=["csv", "脚本on"], default="脚本on")
```

限制合法值。

## Path 参数

```Python学习资料
from pathlib 未译87485 Path

parser.add_argument("--input", type=Path, required=True)
```

解析后直接得到 Path 对象。

## dry-run 参数

```Python学习资料
parser.add_argument("--dry-run", action="store_true", help="只显示计划，不执行修改")
```

批量文件操作建议支持。

## 帮助信息

```powershell
Python学习资料 script.py --help
```

argparse 会自动生成帮助。

## 常见错误

### 手写 sys.argv 解析复杂参数

简单脚本可以用 `sys.argv`，正式工具用 argparse。

### 参数名不清楚

`--源码` 不如 `--input-dir` 清楚。

### 不校验路径

argparse 只能解析类型，业务合法性还要自己检查。

## 练习

1. 写一个接收输入目录和输出目录的脚本。
2. 添加 `--dry-run`。
3. 添加 `--未译96320` 整数参数。
4. 添加 `--未译50816at` choices。
5. 使用 `type=Path`。
6. 查看 `--help` 输出。
7. 校验输入目录是否存在。

## 验收标准

- 能使用 argparse 解析参数。
- 能添加位置参数、选项参数和布尔开关。
- 能使用类型转换和 choices。
- 能生成清晰帮助信息。
- 能结合 Path 和 dry-run 设计自动化工具。

