# Babel 编译三阶段

Babel 编译可以简化成三步：

```text
parse -> transform -> generate
```

理解这三步，就能理解插件为什么能改代码。

## parse：源码转 AST

输入源码：

```javascript
const count = 1 + 2
```

Babel parser 会把字符串解析成 AST。AST 是代码的树形结构，粗略理解为：

```text
Program
  VariableDeclaration kind="const"
    VariableDeclarator
      Identifier name="count"
      BinaryExpression operator="+"
        NumericLiteral value=1
        NumericLiteral value=2
```

源码字符串不适合直接做复杂改写。AST 让工具可以按语法结构处理代码。

## transform：遍历和修改 AST

插件会遍历 AST，并在特定节点上执行逻辑。

例如把变量名 `count` 改成 `total`：

```text
Identifier(count) -> Identifier(total)
```

或者把箭头函数：

```javascript
const add = (a, b) => a + b
```

改成普通函数：

```javascript
const add = function (a, b) {
  return a + b
}
```

这一阶段是 Babel 插件最核心的工作区。

## generate：AST 转源码

修改后的 AST 会被 generator 重新生成 JavaScript 字符串：

```javascript
var count = 3
```

同时可以生成 source map，把编译后代码映射回源码位置。

## 三阶段对应工具包

| 阶段 | 常见包 | 作用 |
| --- | --- | --- |
| parse | `@babel/parser` | 把源码解析成 AST |
| transform | `@babel/traverse`、`@babel/core` | 遍历和转换 AST |
| generate | `@babel/generator` | 把 AST 生成代码 |
| 节点构造 | `@babel/types` | 创建、判断、修改 AST 节点 |

## 一个最小转换流程

```javascript
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

const ast = parse('const count = 1')

traverse(ast, {
  Identifier(path) {
    if (path.node.name === 'count') {
      path.node.name = 'total'
    }
  }
})

const output = generate(ast)
console.log(output.code)
```

输出：

```javascript
const total = 1;
```

## Babel 转换的本质

不要把 Babel 想成字符串替换。它真正做的是：

```text
源码字符串 -> 语法树 -> 改语法树 -> 新源码字符串
```

这也是为什么 Babel 能可靠处理嵌套语法、作用域、import/export、JSX、TypeScript 等复杂结构。

