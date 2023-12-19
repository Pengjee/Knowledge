# 当前执行上下文this

## 调用位置
调用位置是指函数在代码汇总的被调用的位置（而不是申明位置）。其中this的调用位置，最重要的是分析调用栈，就是为了达到当前执行位置所调用的所有函数。
```js
function baz () {
    console.log('baz')
    bar()
}
function bar () {
    console.log('bar')
    foo();
}

function foo () {
    console.log('foo')
}

baz(); // baz -> bar -> foo
```
上述例子的调用栈顺序为baz -> bar -> foo
## 绑定规则
函数的执行过程中调用位置决定this的绑定对象。
```md
调用栈 => 调用位置 => 绑定规则 => 规则优先级
```
### 默认绑定规则
常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则式的默认规则。
```js
function foo () {
    console.log(this.a)
}
var a = 2;
foo(); // 2
```
这里的this指向window，定义的a，想当于`window.a`,但如果我们用`let`、`const`这里，这里的this.a都会是undefined，这是
因为let、const的作用域导致的。
### 隐式绑定
另外需要考虑的是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，这种说法可能会造成一些误导。
```js
function foo () {
    console.log(this.a)
}

const container = {
    a: 2,
    foo: foo
}
container.foo() // 2
```
首先需要注意的是 foo 的声明方式，及其之后是如何被当作引用属性添加到 container 中的。但是无论是直接在 container 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 container 对象。

然而，调用位置会使用 container 上下文来引用函数，因此你可以说函数被调用时 container 对象 拥有 或者 包含 它。

无论你如何称呼这个模式，当 foo 被调用时，它的前面确实加上了对 container 的引用。当函数引用有上下文时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调用 foo 时 this 被绑定到 container 上，因此 this.a 和 container.a 是一样的。

💡**对象属性引用链中只有上一层或最后一层在调用位置中起作用。**

```js
function foo () {
    console.log(this.a)
}
var obj2 = {
    a: 42,
    foo: foo
}
var obj1 = {
    a: 2,
    obj2: obj2
}
obj1.obj2.foo() // 42
```
#### 隐式丢失
一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上（这取决于是否是严格模式）。
```js
function foo () {
    console.log(this.a)
}
const container = {
    a: 2,
    foo: foo
}
const bar = container.foo
const a = 'Hello'
bar() // hello
```
虽然 bar 是 container.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。
一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时。
```js
function foo () {
    console.log(this.a)
}
function bar(fn) {
    fn();
}
var continaer = {
    a: 2,
    foo
}
var a = 'hello'
bar(container.foo) // hello
```
参数传递其实是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上个示例一样。
如果把函数传入语言内置的函数而不是传入你自己声明的函数，结果是一样的，没有区别。
```js
function foo() {
    console.log(this.a)
}
const container = {
    a: 2,
    foo
}
var a = 'hello'
setTimeout(container.foo, 100) // hello
```
回调函数丢失 this 绑定是非常常见的。 除此之外，还有一种情况 this 的行为会出乎我们意料：调用回调函数的函数可能会修改 this。在一些流行的 JavaScript 库中事件处理器会把回调函数的
this 强制绑定到触发事件的 DOM 元素上。这在一些情况下可能很有用，但是有时它可能会让你感到非常郁闷。遗憾的是，这些工具通常无法选择是否启用这个行为。
无论是哪种情况，this 的改变都是意想不到的，实际上你无法控制回调函数的执行方式，因此就没有办法控制调用位置以得到期望的绑定。之后我们会介绍如何通过固定 this 来修复这个问题。

### 显示绑定
就像我们刚才看到的那样，在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把 this 隐式绑定到该对象上。
JavaScript 提供了 apply、call 和 bind 方法，为创建的所有函数 绑定宿主环境。通过这些方法绑定函数的 this 指向称为 显式绑定。

#### 硬绑定
```js
function foo () {
    console.log(this.a)
}
const container = {
    a: 2
}
var bar = function () {
    foo.call(container)
}
bar(); // 2

setTimeout(bar, 100) // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window) // 2
```
我们创建了函数 bar，并在它的内部手动调用了 foo.call(container) ，因此强制把 foo 的 this 绑定到了 container 。无论之后如何调用函数 bar，
它总会手动在 container 上调用 foo。这种绑定是一种显式（手动）的强制绑定，因此我们称之为硬绑定。

#### 内置函数
第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为 上下文（context），其作用和 bind 一样，确保你的回调函数使用指定的 this 。
```js
function foo (item) {
    console.log(this.title, item)
}
const columns = {
    title: 'No'
}[(1,2,3)].forEach(foo, columns)
```

### 构造调用绑定
使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

- 创建全新的空对象
- 将新对象的隐式原型对象关联构造函数的显式原型对象
- 执行对象类的构造函数，同时该实例的属性和方法被 this 所引用，即 this 指向新构造的实例
- 如果构造函数执行后没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象
```js
function objectFactory(constructor, ...rest) {
  // 创建空对象，空对象关联构造函数的原型对象
  const instance = Object.create(constructor.prototype);

  // 执行对象类的构造函数，同时该实例的属性和方法被 this 所引用，即 this 指向新构造的实例
  const result = constructor.apply(instance, rest);

  // 判断构造函数的运行结果是否对象类型
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
  }

  return instance;
}
```
## 优先级
```
显示绑定 > 构造调用绑定 > 隐式绑定
```