# Generator 函数
Generator函数是一个状态机，封装了多个内部状态。执行Generator函数会返回一个一个遍历器对象，也就是说，Generator函数除了状态机，还是一个遍历器对象生成函数。
```js
function* helloWorldGenerator () {
    yield 'hello'
    yield 'world'
    return 'ending'
}
var hw = helloWorldGenerator()
```
上面的代码定义了一个Generator函数`helloWorldGenerator`，它内部有两个`yield`表达式（`hello`和`world`），即该函数有三个状态：hello，world和return 语句。  
`yield`表达式与`return`语句既有相识之处，也有区别。相识之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而`return`语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）`return`语句，但是可以执行多次（或者说多个）`yield`表达式。

## 应用
### (1)异步操作的同步化表达
Generator函数的暂停执行的效果，这意味着可以把异步操作写在`yield`表达式里面，等到调用`next`方法时再往后执行。
```js
function * loadUI() {
    showLoadingScreen()
    yield loadUIDataAsync()
    hideLoadingScreen()
}
var loader = loadUI()
loader.next()
loader.next()
```
### (2) 控制流管理
如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样。
```js
step1(function (value1)) {
    step2(value1, function (value2) {
        step3(value2, function (value3) {
            // doSomething
        })
    })
}
```
如果用`Promise`改写上面的代码。
```js
Promise.resolve(step1)
.then(step2)
.then(step3)
.then(step4)
.then(function (value4) {
    // doSomething
}, function (error) {
    // Handle any error
})
```
上面代码已经把回调函数，改成了直线执行的形式，但是加入了大量的`Promise`的语法。`Generator`函数可以进一步改善代码运行流程。
```js
function * loadRunningTask (value1) {
    try {
        const value2 = yield step1(value1)
        const value3 = yield step2(value2)
        const value4 = yield step3(value3)
        // doSomething
    } catch (e) {
        // handle error
    }
}
```
然后通过一个函数，依次自动执行所有步骤
```js
function schedule(task) {
    const taskObj = task.next(task.value)
    if (!taskObj.done) {
        task.value = taskObj.value
        schedule(task)
    }
}
schedule(loadingRunningTask(initialValue))
```

## Generator 函数的异步应用
传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做“协程”，意思是多个线程相互协作，完成异步任务。
协程有点像函数，又有点像线程。它的运行流程大致如下:  
step1： 协程A开始执行  
step2： 协程A执行到一半，进入暂停，执行权转移到协程B  
step3： （一段时间后）协程B交还执行权  
step4:  协程A恢复执行  
上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。举例来说，读取文件的协程写法如下：
```js
function * asyncJob () {
    var f = yield readFile(fileA)
}
```