### 1、什么是线程、什么是进程？
线程：  
进程的创建、销毁与切换存在着较大的时空开销，因此人们急需一种轻型的进程技术来减少开销。在80年代，线程的概念开始出现，线程被设计成进程的一个执行路径，同一个进程中的线程共享进程的资源，因此系统对线程的调度所需的成本远远小于进程。

进程：  
进程是一个具有一定独立功能的程序在一个数据集合上依次动态执行的过程。进程是一个正在执行的程序的实例，包括程序计数器、寄存器和程序变量的当前值。

### 2、在js的任务队列中，setTimeout会不会不准时
除开任务队列外，浏览器还根据WHATWG标准实现了延迟队列，用于存放需要被延迟执行的任务（setTimeout）
```js
function MainThread() {
    while(true) {
        const task = taskQueue.takeTask()
        processTask(task)
        
        // 延时队列执行
        processDelayTask()
        
        if (!keepRunning) {
            break;
        }
    }
}
```
因为延时队列是在`processTask`之后，所以就有可能任务执行时间过长，导致延时队列无按期执行。
```js
function sayHello () { console.log('hello') }

function test() {
    setTimeout(sayHello, 0)
    for (let i = 0; i < 5000, i++) {
        console.log(i)
    }
}
test()
```

### 3、React16整体架构由递归改为Time Slice的变化？
在React16之前采用的是递归的方式去更新子组件，需要更新挂载的组件都会去调用`updateComponent`和`mountComponent`

### 4、React的四种更新模式
- 1、Sync（同步）
- 2、Async Mode(异步更新)
- 3、Concurrent Mode(并发模式)
- 4、Concurrent Feature(并发特征)

16之前的React采用的是递归方式进行组件的更新渲染，这种工作流程是“同步”的，但到了16及之后采用Fiber架构过后就变成“异步、可中断”
但是这种方式依然不能突破“I/O性能瓶颈”，所以继续迭代了为Concurrent Mode，多并发模式，使多个更新工作流程并发执行