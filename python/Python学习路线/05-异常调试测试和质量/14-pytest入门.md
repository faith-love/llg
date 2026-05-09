# pytest 入门

pytest 是 Python 项目中非常常用的测试框架。它语法简洁，断言信息清晰，插件生态丰富。学习阶段推荐优先使用 pytest。

## 安装

```powershell
python -m pip install pytest
```

确认：

```powershell
python -m pytest --version
```

## 最小测试

被测代码：

```python
def add(a, b):
    return a + b
```

测试：

```python
def test_add():
    assert add(1, 2) == 3
```

运行：

```powershell
python -m pytest
```

## 测试发现规则

pytest 默认发现：

- `test_*.py`
- `*_test.py`
- 以 `test_` 开头的函数。
- 以 `Test` 开头的类中的测试方法。

## assert 重写

pytest 对 assert 做了增强。

```python
def test_add():
    assert add(1, 2) == 4
```

失败时会显示左右值，方便定位。

## 测试命名

测试名应该说明场景：

```python
def test_divide_returns_result_when_divisor_is_not_zero():
    assert divide(6, 2) == 3
```

不要只写：

```python
def test_1():
    pass
```

## 运行指定文件或测试

```powershell
python -m pytest tests/test_math_tools.py
```

运行指定测试：

```powershell
python -m pytest tests/test_math_tools.py::test_add
```

## 查看输出

显示 print 输出：

```powershell
python -m pytest -s
```

详细模式：

```powershell
python -m pytest -v
```

## 常见错误

### 直接运行 pytest 命令找不到

推荐：

```powershell
python -m pytest
```

确保使用当前解释器环境。

### 测试文件命名不符合规则

pytest 发现不到。

### 测试依赖执行顺序

测试应该独立，不依赖先后顺序。

## 练习

1. 安装 pytest。
2. 写 `test_add`。
3. 故意让测试失败，观察输出。
4. 用 `-v` 运行测试。
5. 运行指定测试函数。
6. 改名测试文件，观察发现规则。
7. 把 3 个手工验证改成 pytest 测试。

## 验收标准

- 能安装并运行 pytest。
- 能写基础测试函数。
- 能读懂测试失败输出。
- 能运行指定测试。
- 能遵守测试命名规则。

