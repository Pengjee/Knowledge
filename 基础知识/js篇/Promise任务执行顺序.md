### Question
请写出下面代码的输出结果
```js
async function async1() {
   console.log('async1 start')
   await async2()
   console.log('async1 end')
}

async function async2() {
   console.log('async2')
}

console.log('script start')

setTimeout(function() {
   console.log('setTimeout')
}, 0)  

async1()

new Promise(function(resolve) {
   console.log('promise1')
   resolve()
}).then(function() {
   console.log('promise2')
})

console.log('script end')
```

### Answer
```js
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

### 知识点
#### event loop执行顺序：
- 一开始整个脚本作为一个宏任务执行
- 执行过程中同步代码执行执行，宏任务进入宏任务队列，微任务进入微任务队列
- 当前宏任务执行完出列，检查微任务列表，有则依次执行，到全部执行完
- 执行浏览器UI线程渲染工作
- 检查是否有Web Worker任务，有则执行
- 执行完本轮的宏任务，回到第二步，依此循环，直到宏任务和微任务都清空

#### 宏任务和微任务
- 微任务包括：MutationObserver、Promise.then()或catch()、Promise为基础开发的其它技术，比如fetch API、V8的垃圾回收过程、Node独有的process.nextTick。
- 宏任务包括：script 、setTimeout、setInterval 、setImmediate 、I/O 、UI rendering。

**注意：在所有任务开始的时候，由于宏任务中包括了script，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务(例如setTimeout)将被放到下一轮宏任务中来执行。**

#### async/await
在这里也不赘述 async/await 的基础内容，大家需要知道：

- async 声明的函数，其返回值必定是 promise 对象，如果没有显式返回 promise 对象，也会用 Promise.resolve() 对结果进行包装，保证返回值为 promise 类型
- await 会先执行其右侧表达逻辑（从右向左执行），并让出主线程，跳出 async 函数，而去继续执行 async 函数外的同步代码
- 如果 await 右侧表达逻辑是个 promise，让出主线程，继续执行 async 函数外的同步代码，等待同步任务结束后，且该 promise 被 resolve 时，继续执行 await 后面的逻辑
- 如果 await 右侧表达逻辑不是 promise 类型，那么仍然异步处理，将其理解包装为 promise， async 函数之外的同步代码执行完毕之后，会回到 async 函数内部，继续执行 await 之后的逻辑

```js
async function async1() {
   console.log('async1 start') // step 4: 直接打印同步代码 async1 start
   await async2() // step 5: 遇见 await，首先执行其右侧逻辑，并在这里中断 async1 函数
   console.log('async1 end') // step 11: 再次回到 async1 函数，await 中断过后，打印代码 async1 end
}

async function async2() {
   console.log('async2') // step 6: 直接打印同步代码 async2，并返回一个 resolve 值为 undefined 的 promise
}

console.log('script start') // step 1: 直接打印同步代码 script start

// step 2: 将 setTimeout 回调放到宏任务中，此时 macroTasks: [setTimeout]
setTimeout(function() {            
   console.log('setTimeout') //step 13: 开始执行宏任务，输出 setTimeout
}, 0)  

async1() // step 3: 执行 async1

// step 7: async1 函数已经中断，继续执行到这里
new Promise(function(resolve) {
   console.log('promise1') // step 8: 直接打印同步代码 promise1
   resolve()
}).then(function() { // step 9: 将 then 逻辑放到微任务当中
   console.log('promise2') // step 12: 开始执行微任务，输出 promise2
})

console.log('script end') // step 10: 直接打印同步代码 script end，并回到 async1 函数中继续执行
```