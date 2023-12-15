const promise1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('success1')
        }, 2000)
    })
}

const promise2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('success2')
        }, 1000)
    })
}


const promise3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('success3')
        }, 3000)
    })
}

Promise.prototype.allCustom = (promises) => {
    return new Promise((resolve, reject) => {
        let index = 0
        const ret = []

        for (let i = 0; i < promises.length; i++) {
            const reqIndex = i
                Promise.resolve(promises[i]()).then((data) => {
                ret[reqIndex] = data
                index++
                if (index === promises.length - 1) {
                    resolve(ret)
                }
            }).catch(() => {
                reject(`error', ${i}`)
            })
        }
    })
}

const pa = Promise.prototype.allCustom([promise1, promise2, promise3]).then((data) => {
    console.log(data)
}).catch(err => {
    console.error(err)
})