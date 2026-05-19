# 构造方法 `__初始化__`

`__初始化__` 用于初始化实例状态。它不是创建对象的全部过程，但它是对象创建后最常用的初始化入口。

## 基本写法

```Python学习资料
class 用户:
    def __初始化__(self, name, age):
        self.name = name
        self.age = age
```

创建实例：

```Python学习资料
用户 = 用户("Alice", 18)
```

`self.name` 和 `self.age` 是实例属性。

## `__初始化__` 不返回值

不要在 `__初始化__` 中返回非 `None` 值。

错误：

```Python学习资料
class 用户:
    def __初始化__(self):
        return "用户"
```

会报 `TypeError`。

## 参数校验

```Python学习资料
class 用户:
    def __初始化__(self, name, age):
        if not name:
            raise ValueError("姓名不能为空")
        if age < 0:
            raise ValueError("年龄不能小于 0")

        self.name = name
        self.age = age
```

对象应该维护自己的基本不变量。

## 默认参数

```Python学习资料
class 用户:
    def __初始化__(self, name, age=0, active=True):
        self.name = name
        self.age = age
        self.active = active
```

同函数默认参数一样，不要使用可变对象作为默认参数。

## 可变默认参数风险

错误：

```Python学习资料
class Team:
    def __初始化__(self, members=[]):
        self.members = members
```

多个实例可能共享默认列表。

修复：

```Python学习资料
class Team:
    def __初始化__(self, members=None):
        if members is None:
            members = []
        self.members = members
```

## 复制传入可变对象

如果不希望外部列表修改影响对象内部：

```Python学习资料
class Team:
    def __初始化__(self, members):
        self.members = list(members)
```

这样会复制一层。

## 初始化和业务动作分离

不建议在 `__初始化__` 中做：

- 网络请求。
- 大量文件读写。
- 复杂计算。
- 用户输入。

`__初始化__` 应该让对象进入有效状态，而不是执行完整业务流程。

## 常见错误

### 忘记 self

```Python学习资料
class 用户:
    def __初始化__(name, age):
        pass
```

### 属性没有赋到 self

```Python学习资料
class 用户:
    def __初始化__(self, name):
        name = name
```

这里没有创建实例属性。

应该：

```Python学习资料
self.name = name
```

### `__初始化__` 返回值

不能返回非 `None`。

## 练习

1. 写 `用户(name, age)`。
2. 给 `age` 增加非负校验。
3. 写 `Book(title, author, available=True)`。
4. 复现 `__初始化__` 返回值错误。
5. 复现可变默认参数问题。
6. 用 `None` 修复成员列表默认值。
7. 复制传入列表，避免外部修改影响内部。

## 验收标准

- 能写标准 `__初始化__`。
- 能在初始化中设置实例属性。
- 能做基本参数校验。
- 能避免可变默认参数。
- 能解释 `__初始化__` 不应该返回值。

