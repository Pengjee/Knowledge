## 手动实现Promise
我们知道Promise可以接收一个函数，并且这个函数会返回两个参数`reject`，`resolve`。
```js
class Promise {
    constructor (executor) {
        let resolve = () => {}

        let reject = () => {}

        executor(resolve, reject)
    }
}
```
Promise规范:
* Promise存在三个状态`pending`、`fulfilled`、`rejected`
* `pending`（等待态）为初始态，并可以转化为`fulfilled`（成功态）和`rejected`（失败态）
* 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
* 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
* `new Promise((resolve, reject)=>{resolve(value)})`，`resolve`为成功，接收参数`value`，状态改变为`fulfilled`，不可再次改变。
* `new Promise((resolve, reject)=>{reject(reason)})`， `reject`为失败，接收参数`reason`，状态改变为`rejected`，不可再次改变。

```js
class Promise {
    constructor (executor) {
        this.state = 'pending' // 默认状态

        this.result = undefined // 成功的值

        this.reason = undefined // 失败原因

        let resolve = (ret) => {
            if(this.state === 'pending') {
                this.state = 'fulfilled' // 转为成功状态
                this.result = ret
            }
        }
        let reject = reason => {
            if (this.state === 'pending') {
                this.state = 'rejected' // 转为失败状态
                this.reason = reason 
            }
        }

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
}

```
### then方法实现
Promise有一个叫做then的方法，里面有两个参数：`onFulfilled`、`onRejected`，成功有成功的值，失败有失败的原因。
* 当状态state为`fulfilled`，则执行`onFulfilled`，传入`this.value`。当状态state为`rejected`，则执行`onRejected`，传入`this.reason`
* `onFulfilled`，`onRejected`如果他们是函数，则必须分别在`fulfilled`，`rejected`后被调用，`value`和`reason`依次作为它们的第一个参数。

```js
class Promise {
    constructor (executor) {}

    then (onFulfilled, onRejected) {
        if (this.state === 'fulfilled') {
            onFulfilled(this.value)
        }
        if (this.state === 'rejected') {
            onRejected(this.reason)
         }
    }
}
```

### 异步实现
上面的代码已经基本可以实现简单的同步代码，但是当`resolve`在`setTimeout`内执行，`then`时`state`还是`pending`等待状态，我们就需要在`then`调用的时候，将成功和失败存到各自的数组，一旦`reject`或者`resolve`，就调用。类似发布订阅模式。先将then里面的两个函数存储起来，由于一个`promise`可以有多个`then`，所以存在同一个数组内。
```js
class Promise {
    constructor (executor) {
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined

        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []

        let resolve = value => {
            if (this.state === 'pending') {
                this.state = 'fulfilled'
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = reason => {
            if (this.state === 'pending') {
                this.state = 'fulfilled'
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    then(onFulfilled, onRejected) {
        if (this.state === 'fulfilled') {
            onFulfilled (this.value)
        }
        if (this.state === 'rejected') {
            onRejected(this.reason)
        }
        if (this.state === 'pending') {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value)
            })

            this.onResolvedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }
    }
}

```

### 链式调用实现
在平时我们通常会用到`new Promise().then().then()`，这种链式调用来解决回调地狱的问题。
这种我们可以理解为就在一个`Promise`中返回了一个新的`Promise`，并且将值也一并传递下去了。
* 将第二个promise返回的值传递到下一个`then`中
* 如果返回一个普通的值，则将普通的值传递给下一个then中

当我们在第一个`then`中`return`一个参数。这个`return`出来的新的promise就是`onFulfilled`或者`onRejected`函数的返回值。在`PromiseA+`规定中返回的值叫做`x`，而判断`x`的函数叫做`resolvePromise`