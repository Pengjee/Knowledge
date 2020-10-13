## React Fiber

### 什么是reconciliation?
#### reconciliation
是一种react用来diff两个节点树，从而决定哪一部分需要更新的一种算法。

#### update
React Fiber是对reconciler的重写，但是依据React doc中对高层算法的描述，重写前后，reconciler还是有大量的相同处。比较关键的两点是：
* 假设不同“组件类型”的组件会生成大体不同的节点树。对于这种情况（不同“组件类型”的组件的更新），react不会对它们使用diff算法，而是直接把整个老的节点完全替换为新的节点树。
* 使用key这个prop来diff列表。key应该是“稳定（译者注：不能用类似于Math.random(）来生成key的prop值），可预测的和唯一的”。
####