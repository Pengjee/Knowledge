## Promise
Promise是异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更加强大的和合理。Promise对象有以下两个特点：  
1. 对象的状态不受外界的影响。`Promise`对象代表一个异步操作，它只有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。当流转到`fulfilled`或者`rejected`时，状态就将不再改变，会一直保持这种结果，这时就称为resolved（已定型）。  

但是`Promise`也有一些缺点。首先，我们无法取消`Promise`，一旦创建就会立即执行，无法取消。如果不设置回调函数，`Promise`内部会抛出错误，不会反馈到外部。

### 基本用法
```js
const promise = new Promise((resolve, reject) => {
    if (  ) {
        resolve(value)
    } else {
        reject(error)
    }
})
```
`Promise`构造函数接受一个函数作为参数，这个函数有两个参数：  
1. `resolve`将`Promise`对象的状态从“未完成”变为“成功”（`pending` => `resolve`）
2. `reject`将`Promise`对象的状态从“未完成”变为“失败”（`pending` => `rejected`），在异步操作失败的时候调用。

下面我们来构建一个`Promise`对象实现的Ajax的操作的🌰：
```js
const getJSON = (url) => {
    return new Promise((resolve, reject) => {
        const handler = () => {
            if (this.readyState !== 4) return
            if (this.status === 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusText))
            }
        }
        const req = new XMLHttpRequest()
        req.open('GET', url)
        req.onreadystatechange = handler
        req.responseType = 'json'
        req.setRequestHeader('Accept', 'application/json')
        req.send()
    })
}
getJSON('/posts.json').then((json) => {
    console.log(json)
}, (err) => {
    console.err(err)
})
```
如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。`reject`函数的参数通常时`Error`对象的实例，表示抛出的操作。并且`Promise`的状态是会被传递的。
```js
const p1 = new Promise((resolve, reject) => {
    // ... 
})
const p2 = new Promise((resolve, reject) => {
    resolve(p1)
})
```
`p1`和`p2`都是Promise的实例，但是`p2`的`resolve`方法将`p1`作为参数，即一个异步操作的结果是返回另一个异步操作，这时`p1`的状态就会传递给`p2`。如果`p1`状态是`pending`，那么`p2`的回调函数就会等待`p1`的状态改变；如果`p1`的状态已经是`resolved`或者`rejected`，那么`p2`的回调函数将会立即执行。
```
       pending => p1 (wit)
p2 => 
       resolved(rejected) => p1(doing) 
```

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('fail')), 3000)
})
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(p1), 1000)
})

p2.then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})
```
调用`resolve`或者`reject`并不会终结`Promise`的参数函数的执行。
```js
new Promise((resolve, reject) => {
    resolve(1)
    console.log(2)
}).then(r => {
    console.log(r)
}) // 2 1
```
在`Promise`中立即`resolved`的`Promise`是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。所以我们最好在前面加上`return`语句。
```js
new Promise((resolve, reject) => {
    return resolve(1)
    console.log(2) 
})
```

在`Promise.catch`中我们一定要记住这么一句：如果`Promise`状态已经变成`resolved`，再抛出错误是无效的。
```js
const promise = new Promise((resolve, reject) => {
    resolve('ok')
    throw new Error('test')
})
promise.then((value) => console.log(value)).catch((err) => console.log(err)) // ok
```
我们来看下面一个例子：
```js
const promise = new Promise((resolve, reject) => {
    resolve('ok');
    setTimeout(() => { throw new Error('test')}, 0)
})
promise.then((result) => console.log(result))
// ok
// Uncaught Error: test
```
上面代码中，`Promise` 指定在下一轮“事件循环”再抛出错误。到了那个时候，`Promise` 的运行已经结束了，所以这个错误是在 `Promise` 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。  
一般总是建议，`Promise `对象后面要跟`catch()`方法，这样可以处理 `Promise` 内部发生的错误。`catch()`方法返回的还是一个` Promise `对象，因此后面还可以接着调用`then()`方法。

## Promise.all()
`Promise.all()`方法用于多个Promise实例，包装成一个新的Promise实例。
```js
const p = Promise.all([p1, p2, p3])
```
`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。
1.  只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
2.  只有`p1`、`p2`、`p3`的状态都变成`rejected`，`p`的状态才会变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数