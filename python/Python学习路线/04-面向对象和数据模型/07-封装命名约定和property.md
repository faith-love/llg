# 封装命名约定和 property

封装的目标不是“禁止访问”，而是让对象维护自己的规则。Python 主要依靠命名约定和 `property` 来表达属性访问边界。

## 公共属性

```python
class User:
    def __init__(self, name):
        self.name = name
```

`name` 是公共属性，外部可以直接访问。

Python 不强制所有属性都写 getter/setter。简单数据对象直接公开属性是可以的。

## 单下划线约定

```python
class User:
    def __init__(self, name):
        self._name = name
```

单下划线表示“内部使用，不建议外部直接访问”。

这只是约定，不是强制。

## 双下划线名称改写

```python
class User:
    def __init__(self, name):
        self.__name = name
```

双下划线会触发名称改写，主要用于避免子类命名冲突，不是常规私有化工具。

基础阶段不要滥用双下划线。

## `property` 只读属性

```python
class User:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
```

调用：

```python
user = User("Alice", "Smith")
print(user.full_name)
```

像访问属性一样调用方法。

## `property` 做校验

```python
class Product:
    def __init__(self, price):
        self.price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("价格不能小于 0")
        self._price = value
```

这样可以在赋值时校验：

```python
product.price = -1
```

## 什么时候用 property

适合：

- 计算属性。
- 只读属性。
- 属性赋值需要校验。
- 想保持属性访问形式，同时隐藏内部实现。

不适合：

- 简单公开字段，没有额外逻辑。
- 复杂业务动作。
- 有明显副作用的操作。

复杂动作应该用方法名表达。

## 常见错误

### 为所有字段写 property

Python 不要求机械写 getter/setter。

### property 内部递归调用自己

错误：

```python
@property
def price(self):
    return self.price
```

会无限递归。应该返回内部属性：

```python
return self._price
```

### setter 里没有校验类型和值

如果使用 setter，就要明确校验规则。

## 练习

1. 写一个 `full_name` 只读属性。
2. 写一个价格属性，要求不能小于 0。
3. 复现 property 递归错误。
4. 判断 5 个字段是否需要 property。
5. 用单下划线表达内部属性。
6. 观察双下划线名称改写。

## 验收标准

- 能解释 Python 封装依靠约定。
- 能使用单下划线。
- 能写只读 property。
- 能写带 setter 的 property。
- 能避免 property 递归调用自己。

