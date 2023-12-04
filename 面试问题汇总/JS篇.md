### 1.JS数组遍历
```js
for (let i = 0; i < []; i++) {}
for (let item in []) {}
for (let item of []) {}
[].forEach(() => {});
[].map(() => {});
[].reduce(() => {});
[].some(() => {});
[].every(() => {});
[].filter(() => {});
```

### 2、bind、call、apply 有什么区别？如何实现一个bind
#### apply

#### bind

#### call

### 3、实现一个批量请求函数，要求能够限制并发量

### 4、this指向

### 5、深拷贝、深对比如何实现?
递归遍历、jsonstring转换
### 6、防抖与截流
防抖：当在短时间内多次触发同一个函数，只执行最后一次，或者只在开始时执行.  
截流：但是节流是在一段时间内只允许函数执行一次，限定函数执行的频率.
### 7、Event Loop事件轮询机制
```js
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(1);
        }, 0);
        setTimeout(() => {
            console.log(2);
            resolve(3);
        }, 0)
        resolve(4);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg, 5); // 1 bb
    });
    setTimeout(() => {
        console.log(6);
    }, 0);
}))
first().then((arg) => {
    console.log(arg, 7); // 2 aa
    setTimeout(() => {
        console.log(8);
    }, 0);
});
setTimeout(() => {
    console.log(9);
}, 0);
console.log(10);
// 3 7 10 4 5 2 7 1 2 6 9 8
```
