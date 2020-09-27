## useCallback和useMemo真的那么香吗？

`React Hooks`已经出了很长一段时间了，并且在各大社区论坛被炒得异常得火热，但是在使用了一段时间过后发现，感觉好像`React Hooks`并没有想象中的那么好，那么完美无缺，它还是有一定的缺陷，其中`useCallback`和`useMemo`的感触最深，我们先来看看`useCallback`。

### useCallback
```js
const memoizedCallback = useCallback(() => {
    doSomething(a, b);
  }, [a, b]);
```
这是官方文档的一个例子，`useCallback`主要接收两个参数`useCallback(callback, [dependencies])`，它会返回一个被缓存的回调函数，只有当依赖变更时才会变更。
```js
const callback = () => doSomething(a, b)
```
这个是不使用`hooks`的代码，在这个例子中，哪一个对于性能更好，大多数的人都会认为应该使用`useCallback`来提升性能，并且“内联函数可能会对性能造成问题”。但如果我们退一步来看，函数执行时，每一行代码都会消耗性能，我们把`useCallback`换一种写法。
```js
const callback = () => doSomething(a, b)
const memoizedCallback = useCallback(callback, [a, b])
```
`useCallback`除了多做了一个对`callback`函数的缓存对比外，其他和普通的写法没有区别。而这个操作反而加大了性能消耗。
在这两种写法下，`JavaScript`必须在每次渲染种为函数分配内存，并且根据`useCallback`的实现方式，你可能会获得更多的函数定义内存分配。  

在组件的第二次渲染种，原来的`callback`函数被垃圾收集（释放内存空间），然后创建一个新的`callback`函数。但是使用`useCallback`时，原来的`callback`函数不会被垃圾收集，并且会创建一个新的`callback`函数，所有从内存使用的角度来分析，使用`useCallback`会更加的消耗性能。

### useMemo
`useMemo`虽然和`useCallback`有所不同，但是确实相似的，它允许我们将`memoization`应用于任何值类型（不仅仅是函数）。它通过接受一个返回值的函数来实现这一点，然后只在需要检索值的时候来调用该函数（通常这只有在每次渲染种依赖数组种的元素发生变化事才会发生一次）。