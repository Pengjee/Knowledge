
## 为什么React的update要使用链表，而不使用数组
普通链表如果只保存首节点的指针，则每次插入时需要先进行一次遍历找到尾节点，再进行插入。
要么就需要保存首尾节点的指针。而环形链表的尾节点的下一个节点就是首节点，因此只需要保存一个尾节点就可以做到既方便插入又方便访问首节点。

```js
let pending = share.pending

if (pending === null) {
    update.pending = update
} else {
    // 追加新的update，并形成环
    update.next = pending.next
    pending.next = update
}
// 把待更新节点往后移
share.pending = update
```

### 