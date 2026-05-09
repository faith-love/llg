# 方法重写和 super

子类可以重写父类方法。如果子类还需要复用父类逻辑，就使用 `super()` 调用父类实现。

## 方法重写

```python
class Animal:
    def speak(self):
        return "some sound"


class Dog(Animal):
    def speak(self):
        return "woof"
```

`Dog.speak` 覆盖了 `Animal.speak`。

## `super()` 基础

```python
class User:
    def __init__(self, name):
        self.name = name


class AdminUser(User):
    def __init__(self, name, permissions):
        super().__init__(name)
        self.permissions = permissions
```

`super().__init__(name)` 调用父类初始化逻辑。

## 扩展父类方法

```python
class BaseReporter:
    def report(self):
        return "base report"


class JsonReporter(BaseReporter):
    def report(self):
        base = super().report()
        return f"{base} in json"
```

子类可以先调用父类，再增加自己的逻辑。

## 为什么不用父类名直接调用

不推荐：

```python
User.__init__(self, name)
```

推荐：

```python
super().__init__(name)
```

`super()` 在继承层级和多继承中更灵活。

## 初始化链

如果子类重写 `__init__`，但忘记调用父类 `__init__`，父类属性不会初始化。

```python
class AdminUser(User):
    def __init__(self, permissions):
        self.permissions = permissions
```

这里没有 `self.name`。

## 调用顺序

子类初始化常见顺序：

1. 校验子类参数。
2. 调用 `super().__init__` 初始化父类部分。
3. 初始化子类自己的属性。

也可以根据具体情况调整，但要清晰。

## 常见错误

### 忘记调用 `super().__init__`

导致父类属性不存在。

### `super()` 参数传错

父类需要什么参数，就传什么参数。

### 子类完全改变父类方法语义

重写后如果行为不兼容，会破坏多态。

## 练习

1. 定义父类 `User` 和子类 `AdminUser`。
2. 在子类中调用 `super().__init__`。
3. 重写一个普通方法。
4. 在重写方法中扩展父类逻辑。
5. 复现忘记调用 `super()` 的问题。
6. 判断一个重写是否改变了父类语义。

## 验收标准

- 能重写父类方法。
- 能正确使用 `super()`。
- 能解释初始化链。
- 能避免子类破坏父类行为约定。

