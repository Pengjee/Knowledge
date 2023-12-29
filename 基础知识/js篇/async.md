## 手写async
`async` 函数是是`generator`函数的语法糖。
```js
const getDate = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('data')
        }, 0)
    })
}

function asyncToGenerator(generatorFunc) {
    // 返回一个新的函数
    return function() {
        // 把新函数的参数绑定到原函数上
        const gen = generatorFunc.apply(this, arguments)
        // 返回一个promise
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let generatorResult
                try {
                    // 递归调用next执行generator
                    generatorResult = gen[key](arg)
                } catch (error) {
                    return reject(error)
                }
                const { value, done } = generatorResult
                if (done) {
                    return resolve(value)
                } else {
                    return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
                }
            }
            step("next")
        })
    }
}

function* testG () {
    const data = yield getDate()
    console.log('data', data)
    const data2 = yield getDate()
    console.log('data2', data2)
    return 'success'
}
asyncToGenerator(testG()).then(ret => console.log(ret))
```