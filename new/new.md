# new的模拟实现

## 概念
> `new 运算符`创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例

```js
function Person (name, age) {
    this.name = name;
    this.age = age;
    this.sex = 'boy'
}

Person.prototype.height = 180
Person.prototype.Introduce = function () {
    console.log(`My name is ${this.name}`)
}
const person = new Person('Pjee', 18)
console.log(person.name) // Pjee
console.log(person.sex) // boy
console.log(person.height) // 180
person.Introduce() // My name is Pjee
```
因为`new` 是关键字，所以无法像`bind`函数一样直接覆盖，所以我们写一个函数，命名为`objectFactory`，来模拟实现`new`的效果
```javascript
function Person (name, age) {
    this.name = name;
    this.age = age;
    this.sex = 'boy'
}

const personNew = new Person('Adam', 18)
const personCustom = objectFactory('Adam', 18)
```
因为`new` 的返回是一个新的对象，所以在实现的时候，我们也需要创建一个新的`Object`，`obj`需要具有`Person`构造函数里的属性，我们可以使用`apply`来继承`Person`中的属性。
在Js原型与原型链中，实例的`__proto__`属性会指向构造函数的`prototype`，也正是因为建立这样的关系，实例可以访问原型上的属性。
```js
function objectFactory () {
    const obj = new Object()
    const constructor = [].shift.call(arguments)
    obj.__proto__ = constructor.prototype
    constructor.apply(obj, arguments)
    return obj
}
```
* 用`new Object()`的方式创建了一个对象`obj`
* 取出第一个参数，我们需要传入的构造函数。因为`shfit`会修改原数组，所以`arguments`会除去第一个参数
* 将`obj`的原型指向构造函数，这样`obj`中就能访问到构造函数的属性了
* 使用`apply`，改变构造函数this的指向到新建的对象，这样`obj`就可以访问到构造函数中的属性
* 返回`obj`

```js
function Person (name, age) {
    this.name = name;
    this.age = age;
    this.sex = 'boy'
}

Person.prototype.height = 180
Person.prototype.Introduce = function () {
    console.log(`My name is ${this.name}`)
}
function objectFactory() {
    const obj = new Object()
    const Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);
    return obj;
};
const person = objectFactory(Person, 'Pjee', 18)
console.log(person.name) // Pjee
console.log(person.sex) // boy
console.log(person.height) // 180
person.Introduce() // My name is Pjee
```
假如我们构造的函数中带有返回值，例如：
```js
function Person (name, age) {
    this.name = name
    this.age = age

    return {
        name: name,
        sex: 'boy'
    }
}
const person = new Person('Adam', 18)
console.log(person.name) // => "Adam"
console.log(person.age) // => undefined
console.log(person.sex) // => "boy"
```
在上面这个🌰中，`Person`返回了一个对象，在事例`person`中只能访问返回的对象重的属性。但是如果我们返回一个基础类型（`string`,`null`,`number`...）的值，结果将完全不同
```js
function Person (name, age) {
    this.name = name
    this.age = age

    return 'My name is Pjee'
}
const person = new Person('Adam', 18)
console.log(person.age) // => 18
console.log(person.name) // => 'Adam'
console.log(person.sex) // => undefined
```
因此我还需要判断返回的值是否为一个对象，如果是就直接返回这个对象，如果不是我们就直接返回
```js
function objectFactory () {
    const obj = new Object()
    const Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype
    const ret = Constructor.apply(obj, arguments)
    return typeof ret === 'object' ? ret : obj
}
```