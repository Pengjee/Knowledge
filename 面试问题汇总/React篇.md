### 1、React父子组件如何通信
- props
- Context
- ref、forwardRef
- useReducer
- redux
### 2、Fiber架构

### 3、React中的任务调度

### 4、useEffect和useLayoutEffect区别
- useEffect 是异步执行的，而useLayoutEffect是同步执行的。
- useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前，和 componentDidMount 等价。

因为useLayoutEffect是同步的所以会阻塞DOM渲染，所以一般都在执行完回调后再进行渲染，因此看起来在useLayoutEffect里操作dom不会导致屏幕闪烁。

### 5、为什么在18之前有的setState是同步的，有的是异步的？
在react18之前，因为setState的合并是半自动的，在合适时机使用batchedUpdates合并setState的变更，所以先setState变更的值，需要等到所有setState合并过后
才会做出更新，这样看起来就是异步的。但是当我们用setTimeout包裹时，早已跳除了batchedUpdates调用栈，executionContext已不包含BatchedContext,所以此时
触发的更新不会主动批量更新