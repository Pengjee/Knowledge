### 1.JS数组遍历

```js
for (let i = 0; i < []; i++) {}
for (let item in []) {}
for (let item of []) {}
[].forEach(() => {});
[].map(() => {});
[].reduce(() => {});
[].some(() => {});
[].every(() => {});
[].filter(() => {});
```

### 2、bind、call、apply 有什么区别？如何实现一个bind
#### call
接收多个参数
```js
var info = {
    name: 'pjee'
}

function Person(name, age) {
    console.log(name) // gee
    console.log(age) // 18
    console.log(this.name)
}

Person.call(info, 18)

Function.prototype.callCustom = function (context) {
    const args = []
    // 处理多个参数的问题
    Object.keys(arguments).map(key => {
        args.push(arguments[key])
    })
    // 推出第一个无用参数
    args.shift()
    context.fn = this
    context.fn(...args)
    // 方法调用完成后删除
    delete context.fn
}

Person.callCustom(info, 'jee', 18)
```
#### bind
```js
Function.prototype.bindCustom = function (ctx) {
    const args = Array.prototype.slice.call(arguments, 1)
    return () => {
        this.apply(ctx, args)
    }
}
```
#### apply
第二个参数接收数组
```js
let Person = {
    name: 'Tom',
    say(age, sex) {
        console.log(age, sex, this.name)
    }
}
Person1 = { name: 'Tom1' }
Function.prototype.applyCustom = function (ctx) {
    if (typeof ctx === "undefined" || ctx === null) {
        ctx = window
    }
    const [args] = [...arguments].slice(1)
    ctx.fn = this
    ctx.fn(...args)
    delete ctx.fn
}
Person.say.apply(Person1, [18, 'nv'])
Person.say.applyCustom(Person1, [19, 'nan'])
```

### 3、实现一个批量请求函数，要求能够限制并发量

### 4、this指向

### 5、深拷贝、深对比如何实现?

递归遍历、jsonstring转换

### 6、防抖与截流
防抖：当在短时间内多次触发同一个函数，只执行最后一次，或者只在开始时执行.  
```js
const debounce = (fn, delay) => {
    let timer = null
    return function () {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, arguments)
        }, delay)
    }
}

const fn = debounce(() => { console.log(1) }, 1000)
fn()
```
截流：但是节流是在一段时间内只允许函数执行一次，限定函数执行的频率.
```js
const throttle = (fn, delay) => {
    let timer = null
    return function () {
        const context = this
        const args = arguments
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args)
                timer = null
            }, delay)
        }
    }
}

```
### 7、Event Loop事件轮询机制
宏任务：setTimeout()、setInterval()、setImmediate()、I/O、用户交互操作，UI渲染  
微任务：promise.then()、promise.catch()、new MutationObserver、process.nextTick()
```js
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(1);
        }, 0);
        setTimeout(() => {
            console.log(2);
            resolve(3);
        }, 0)
        resolve(4);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg, 5); // 1 bb
    });
    setTimeout(() => {
        console.log(6);
    }, 0);
}))
first().then((arg) => {
    console.log(arg, 7); // 2 aa
    setTimeout(() => {
        console.log(8);
    }, 0);
});
setTimeout(() => {
    console.log(9);
}, 0);
console.log(10);
// 3 7 10 4 5 2 7 1 2 6 9 8
```

### 8、手写new
```js
function objectFactory () {
    const obj = new Object()
    const Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype
    const ret = Constructor.apply(obj, arguments)
    return typeof ret === 'object' ? ret : obj
}
```

### 手写instanceof 
```js
const instanceofCustom = (val, compareVal) => {
    while(val.__proto__) {
        if (val.__proto__ == compareVal.prototype) {
            return true
        }
        val = val.__proto__
    }
    return false
}
```
### 0.1+0.2精度丢失为什么，怎么解决

### 箭头函数和普通函数的区别

### 红绿灯交替闪烁
```js
// 红绿灯交替闪烁

function red() {console.log('红灯亮')}
function yellow() { console.log('黄灯亮')}
function green() { console.log('绿灯亮') }

const light = (fn, time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            fn && fn();
            resolve();
        }, time);
    })
}

const stepLight = () => {
    Promise.resolve().then(() => {
        return light(red, 3000)
    }).then(() => {
        return light(yellow, 2000)
    }).then(() => {
        return light(green, 1000)
    }).then(() => {
        return stepLight()
    })
}

stepLight()
```
