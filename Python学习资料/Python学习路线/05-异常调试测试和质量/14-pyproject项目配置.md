# py测试 入门

py测试 是 Python 项目中非常常用的测试框架。它语法简洁，断言信息清晰，插件生态丰富。学习阶段推荐优先使用 py测试。

## 安装

```powershell
Python学习资料 -m pip install py测试
```

确认：

```powershell
Python学习资料 -m py测试 --version
```

## 最小测试

被测代码：

```python
def add(a, b):
    return a + b
```

测试：

```python
def 测试_add():
    assert add(1, 2) == 3
```

运行：

```powershell
Python学习资料 -m py测试
```

## 测试发现规则

py测试 默认发现：

- `测试_*.py`
- `*_测试.py`
- 以 `测试_` 开头的函数。
- 以 `Test` 开头的类中的测试方法。

## assert 重写

py测试 对 assert 做了增强。

```python
def 测试_add():
    assert add(1, 2) == 4
```

失败时会显示左右值，方便定位。

## 测试命名

测试名应该说明场景：

```python
def 测试_divide_returns_result_when_divisor_is_not_zero():
    assert divide(6, 2) == 3
```

不要只写：

```python
def 测试_1():
    pass
```

## 运行指定文件或测试

```powershell
Python学习资料 -m py测试 测试s/测试_math_tools.py
```

运行指定测试：

```powershell
Python学习资料 -m py测试 测试s/测试_math_tools.py::测试_add
```

## 查看输出

显示 print 输出：

```powershell
Python学习资料 -m py测试 -s
```

详细模式：

```powershell
Python学习资料 -m py测试 -v
```

## 常见错误

### 直接运行 py测试 命令找不到

推荐：

```powershell
Python学习资料 -m py测试
```

确保使用当前解释器环境。

### 测试文件命名不符合规则

py测试 发现不到。

### 测试依赖执行顺序

测试应该独立，不依赖先后顺序。

## 练习

1. 安装 py测试。
2. 写 `测试_add`。
3. 故意让测试失败，观察输出。
4. 用 `-v` 运行测试。
5. 运行指定测试函数。
6. 改名测试文件，观察发现规则。
7. 把 3 个手工验证改成 py测试 测试。

## 验收标准

- 能安装并运行 py测试。
- 能写基础测试函数。
- 能读懂测试失败输出。
- 能运行指定测试。
- 能遵守测试命名规则。

