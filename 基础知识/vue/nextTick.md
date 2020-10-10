## nextTick
在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。

## Event-Loop
js是单线程执行，js执行是有一个执行栈，分成了：宏任务（macro-task）和微任务（micro-task）  
宏任务：
* setTimeout
* I/O
* setInterval
* setImmediate
* 主线程
* MessageChannel  
微任务
* Promise系列
* process.nexttick
* MutationObserver
```
// 执行流程
              （执行一个宏任务，产生宏任务，入栈）
                    ↑
--------↑------- 宏任务 ←--—--
        |           |         |
        |           |         |
        |           |         |
        |           ↓         | 没有
        |         微任务 ------
        |           |↘
        |           |（执行所有微任务过程中产生微任务，继续执行）
        |           |
        |           | 有 执行完所以微任务
        |           |
        |___________↓

--------------------↓------------------
                直到栈为空
```
下面我们来看一道题:
```js
console.log(1)

setTimeout(() => {
  console.log(8)
}, 2000)

setTimeout(() => {
  console.log(3)
  Promise.resolve().then(() => {
    console.log(4)
  })
  setTimeout(() => {
    console.log(6)
  }, 3000)
}, 1000)

new Promise((resolve, reject) => {
  console.log(5)
  resolve()
}).then(() => {
  console.log(7)
})

console.log(2)
```
通过`Event-Loop`的解析流程，上面代码的执行流程是：
* 先执行主线程（宏任务）的代码，打印`1-5-2`，在`new Promise()`的时候，是不属于微任务的
* 执行微任务`7`
* 在执行栈中抛出一个【可以执行的 -> 到时间，虽然，第一个 setTimeout 首先注册，在任务队列栈底】宏任务执行`3-4`
* 再执行所有微任务【无】
* 再抛出一个宏任务执行`8`
* 再执行所有微任务【无】
* 再抛出一个宏任务执行`6`
* 任务执行完毕
* 1 5 2 7 3 4 8 6

## nextTick源码
```js
/**
 * Defer a task to execute it asynchronously.
 */
export const nextTick = (function () {
  const callbacks = [] // 存储所有需要执行的回调函数
  let pending = false // 标记是否存在正在执行的回调函数
  let timerFunc // 触发回调函数

  // 用于执行callback中所有的回调函数
  function nextTickHandler () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  // timeFunc 可以支持的3种方式（Promise, MutationObserver, setTimeout）
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve()
    var logError = err => { console.error(err) }
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError)
      if (isIOS) setTimeout(noop)
    }
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // MutationObserver 方式
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else {
    // setTimeout方式
    timerFunc = () => {
      setTimeout(nextTickHandler, 0)
    }
  }

  return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
})()
```

参考文档： https://www.jianshu.com/p/a7550c0e164f