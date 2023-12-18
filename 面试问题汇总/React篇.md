### 1、React父子组件如何通信
- props
- Context
- ref、forwardRef
- useReducer
- redux
### 2、如何回答什么是Fiber?
#### 1）为什么要有fiber，fiber解决了v15的什么问题？
在fiber出现之前，react v15都是采用stack reconciler的方式进行节点的更新的，采用递归的方式，但是递归的缺陷是一旦开始中途无法中断，且不能从上次
结束的地方重新开始，这意味整个更新任务非常庞大，如果超过了屏幕刷新时间就会出现卡顿的情况。fiber的出现通过把大的任务切割成多个小的子任务，在浏览器空闲
的时间，去进行执行，从而解决了这个问题（Time Slice）
#### 2）fiber node是什么（架构、数据结构、动态单元）？
架构：采用树结构的方式。  
数据结构：每个fiber node对应了一个react node，里面包含节点的基础信息，以及dom元素信息等。 （children、return、sibling、type、tag...） 
动态单元：每个fiber node都包含本次更新所需要做的改动、以及执行的工作和调度优先级（subTreeFlags、lanes...）
#### 3）为什么会有current和wip两颗fiber树，什么是双缓存机制？
fiber的一个工作原理类似与显卡的一个工作原理，通过两颗fiber树（current fiber、wip fiber）的切换，来实现视图的更新，两颗fiber树中的fiber node又
通过属性alternote相互链接。
#### 4）fiber树是如何构建的（mount和update）？
mount：直接构建wip节点，current节点为空，在wip构建完成后渲染完毕后，current会指向wip，完成切换工作。
update：直接构建wip节点，通过比对，对wip做出更新，然后再切换。
#### 5）react是如何进行任务切割的（Time slice）？

#### 6）fiber树是如何更新的（diff和任务调度）？
#### 7）任务是如何调度（优先级排列，及调度方法）？

### 3、useEffect和useLayoutEffect区别_
- useEffect 是异步执行的，而useLayoutEffect是同步执行的。
- useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前，和 componentDidMount 等价。

因为useLayoutEffect是同步的所以会阻塞DOM渲染，所以一般都在执行完回调后再进行渲染，因此看起来在useLayoutEffect里操作dom不会导致屏幕闪烁。

### 4、为什么在18之前有的setState是同步的，有的是异步的？
在react18之前，因为setState的合并是半自动的，在合适时机使用batchedUpdates合并setState的变更，所以先setState变更的值，需要等到所有setState合并过后
才会做出更新，这样看起来就是异步的。但是当我们用setTimeout包裹时，早已跳除了batchedUpdates调用栈，executionContext已不包含BatchedContext,所以此时
触发的更新不会主动批量更新

### 5、Fiber工作流程
1. ReactDOM.render() 和 setState 的时候开始创建更新
2. 将创建的更新加入任务队列，等待调度
3. 在 requestIdleCallback 空闲时执行任务
4. 从根节点开始遍历 Fiber Node，并且构建 WorkInProgress Tree
5. 生成 EffectList
6. 根据 EffectList 更新 DOM

![img.png](image/img_5.png)

1. 第一部分从 ReactDOM.render 方法开始，把接收的 React Element 转换为 Fiber 节点，并为其设置优先级，创建 Update，加入到更新队列，这部分主要是做一些初始数据的准备。
2. 第二部分主要是三个函数：scheduleWork、requestWork、performWork，即安排工作、申请工作、正式工作三部曲，React16 新增的异步调用的功能则在这部分实现，这部分就是 Schedule 阶段，前面介绍的 Cooperative Scheduling 就是在这个阶段，只有在这个解决获取到可执行的时间片，第三部分才会继续执行。
3. 第三部分是个大循环，遍历所有的 Fiber 节点，通过 Diff 算法计算所有更新工作，产出 EffectList 给到 Commit 阶段使用，这部分的核心就是 beginWork 函数，这部分基本就是 FIber Reconciler，包括 reconciliation 和 commit 阶段。

