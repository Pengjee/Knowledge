# Call的模拟实现

## 概念
> `call()`方法使用一个指定的`this`值和单独给出的一个或多个参数来调用一个参数

```javascript
const info = {
    name: pjee
}

function Person () {
    console.log(`My name is ${this.name}`)
}

Person.call(info)  // My name is Pjee
```

## 实现

如果我们在打印出`Person`的`this`指针可以看出，这时`this`指向的的是`info`这个对象，所以打印出来的是`pjee`

马上我们看一下另一个🌰
```javascript
const info = {
    name: 'pjee',
    Person: function () {
        console.log(`My name is ${this.name}`)
    }
}
info.Person() // My name is pjee
```

嗯???? 有没有发现什么。这两个🌰输出都是相同的，那么换句话说我们只需要调整一下例2就可以实现call方法了。

第一步：将方法`Person`放入`info`对象中   
第二步：执行方法`Person`，顺利打印出字符出   
第三步：注销`info`中多余的方法`Person`   

```javascript
Function.prototype.callV2 = function (ctx) {
    ctx.fn = this;
    ctx.fn();
    delete ctx.fn;
}
const info = {
    name: 'pjee'
}
function Person () {
    console.log(`My name is ${this.name}`)
}
Person.callV2(info) // => `My name is pjee
```

但是根据官方文档的对`call`的解释: **一个或多个参数来调用一个参数**

```javascript
var info = {
    name: 'pjee'
}
function Person (name, age) {
    console.log(name) // gee
    console.log(age) // 18 
    console.log(this.name) // pjee
}
bar.call(info, 'gee', 18)
```
我们把`Person`中的`this`打印出来依然是指向`info`的对象的，但是对于后续传入的参数我们并不确定。但是`Arguments`对象中的值我们是可以取到的，我们取第二个到最后一个参数，然后放到一个数组中。所以就可以改造出第二个版本
```javascript
Function.prototype.callV3 = function (ctx) {
    ctx.fn = this
    const args = []
    Object.keys(arguments).map(key => {
        args.push(arguments[key])
    })
    args.shift()
    ctx.fn(...args)
    delete ctx.fn
}
const info = {
    name: 'pjee'
}
function Person (name, age) {
    console.log(name) // gee
    console.log(age) // 18 
    console.log(this.name) // pjee
}
Person.callV3(info, 'gee', 18)
```
> `thisArg`  
> 可选的。在 `function` 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。  
> `arg1, arg2, ...`  
> 指定的参数列表。

```javascript
const info = {
    name: 'pjee'
}
function Person () {
    console.log(this.name)
}
Person.call(null) // pjee
```
并且根据官方文档可知，使用调用者提供的 `this` 值和参数调用该函数的返回值。若该方法没有返回值，则返回 `undefined`。
```javascript
const info = {
    name: 'pjee'
}
function Person (name, age) {
    return {
        name: this.name,
        customName: name,
        age
    }
}
const ret = Person.call(info, 'gee', 18)
console.log(ret) // { name: 'pjee', customName: 'gee', age: 18}
```
那我再重新调整一下自定义的call
```javascript
Function.prototype.callV4 = function (ctx = window) {
    ctx.fn = this
    const args = []
    Object.keys(arguments).map(key => {
        args.push(arguments[key])
    })
    args.shift()
    const ret = ctx.fn(...args)
    delete ctx.fn
    return ret
}
const info = {
    name: 'pjee'
}
function Person (name, age) {
    console.log(name) // gee
    console.log(age) // 18 
    console.log(this.name) // pjee
}
Person.callV4(info, 'gee', 18)
```