`instanceof` 操作符会递归查找 `L` 的原型链，即 `L.__proto__.__proto__.__proto__...` 直到找到了或者到达顶层为止
```js
const instanceOf = (instance, original) => {
    let i = instance
    while (i) {
        if (i.__proto__ === original.prototype) {
            return true
        }
       i = i.__proto__
    }
    return false
}
```