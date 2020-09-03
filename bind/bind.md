# bind的模拟实现

## 概念
> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
const info = {
    name: 'pjee'
}
function Person () {
    console.log(`My name is ${this.name}`)
}
const newPerson = Person.bind(info)
newPerson() // => `My name is pjee`
```
从上面的🌰可以看出，`bind`的使用和`call、apply`很像，但是`bind`会返回一个新的函数，所以我们可以仿照`call、apply`的🌰来实现bind
```js
Function.prototype.bindV2 = function (ctx) {
    return () => this.call(ctx)
}
const info = {
    name: 'pjee'
}
function Person () {
    console.log(`My name is ${this.name}`)
}
const newPerson = Person.bindV2(info)
newPerson() // => `My name is pjee`
```
我们从概念中可知`而其余参数将作为新函数的参数`,当我们传入多个参数时，从第二个参数开始都会直接作为新函数的参数
```js
const info = {
    name: 'pjee'
}
function Person (height, age) {
    console.log(height, age, this.name)
}
const newPerson = Person.bind(info, 180, 18) // 180, 18, pjee
```
同`call`我们也可以使用`arguments`处理
```js
Function.prototype.bindV3 = function (ctx) {
    // 获取bindV3函数从第二个参数开始
    const args = Array.prototype.slice.call(arguments, 1)
    return () => {
        // arguments指向bind返回的函数传入的参数
        const bindArgs = Array.prototype.slice.call(arguments)
        return this.apply(ctx, args.concat(bindArgs))
    }
}
const info = {
    name: 'pjee'
}
function Person (height, age) {
    console.log(height, age, this.name)
}
const newPerson = Person.bindV3(info, 180, 18) 
newPerson() // 180, 18, 'pjee'
```
> `thisArg`  
>> 调用绑定函数时作为 `this` 参数传递给目标函数的值。 如果使用`new`运算符构造绑定函数，则忽略该值。当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object`。如果 `bind `函数的参数列表为空，或者`thisArg`是`null`或`undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。  
> `arg1, arg2, ...`  
>> 当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

换句话说就是当bind返回的函数作为构造函数时，bind时指定的this值会失效，但传入的参数依然有效，我们举个🌰：
```js
const name = 'gee'
const info = {
    name: 'pjee'
}
function Person (sex, age) {
    this.height = 180
    console.log(this.name)
    console.log(sex)
    console.log(age)
}
Person.prototype.play = 'pingpang'
const bindPerson = Person.bind(info, 'kevin')
const obj = new bindPerson('18')
console.log(obj)
console.log(obj.height) // 
console.log(obj.play) // 
```
我们把`Person`的`this`打印出来，发现是指向`obj`，函数里的变量有通过`this.height = 180`赋值的height，还有直接挂载在原型上的`play`，然而`this.name`并没有找到。说明`this`失效了它并没有指向`info`或者`window`而是指向了`obj`。  

我们再升级一下`bindV3`
```js
Function.prototype.bindV4 = function (ctx) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    const args = Array.prototype.slice.call(arguments, 1)

    // 我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype,所以可以用一个空函数来中转一下
    const fNOP = function () {}
    const fBound = () => {
        const bindArgs = Array.prototype.slice.call(arguments)
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : ctx`，实例只是一个空对象，将 null 改成 this ，实例会具有 height 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 ctx
        return this.apply(this instanceof fNOP ? this : ctx, args.concat(bindArgs))
    }

    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBount
}
```

