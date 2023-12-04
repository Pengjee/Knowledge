class PromiseCustom {
    private status: 'pending' | 'fulfilled' | 'resolved';
    private data: any
    private callbacks: { onResolved: () => void, onRejected: () => void }[]

    constructor(executor) {
        this.status = 'pending'
        this.data = undefined
        this.callbacks = []

        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            // 如果执行器抛出异常，promise对象变为rejected状态
            this.reject(err)
        }
    }

    then(onResolved, onRejected) {
        return new PromiseCustom((resolve, reject) => {
            if (this.status === 'pending') {
                this.callbacks.push({
                    onResolved() {
                        onResolved(this.data)
                    },
                    onRejected() {
                        onResolved(this.data)
                    }
                })
            } else if (this.status === 'resolved') {
                setTimeout(() => {
                    try {
                        const ret = onResolved(this.data)
                        if (ret instanceof PromiseCustom) {
                            // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
                            ret.then(value => { resolve(value) }, reason => { reject(reason) })
                        } else {
                            // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
                            resolve(ret)
                        }
                    } catch (e) {
                        reject(e)
                    }

                })
            } else {
                setTimeout(() => {
                    onRejected(this.data)
                })
            }
        })

    }

    catch(onRejected) {

    }

    resolve(value) {
        if (this.status !== 'pending') {
            return;
        }

        this.status = 'resolved'
        this.data = value

        if (this.callbacks.length > 0) {
            setTimeout(() => {
                this.callbacks.forEach((callback) => {
                    callback.onResolved()
                })
            })
        }
    }

    reject(value) {
        if (this.status !== 'pending') {
            return;
        }

        this.status = 'fulfilled'
        this.data = value

        // 如果有待执行的callback函数，立即异步执行回调函数onResolved
        if (this.callbacks.length > 0) {
            setTimeout(() => {
                this.callbacks.forEach((callback) => {
                    callback.onRejected()
                })
            })
        }
    }

    all(value) {

    }

    race(value) {
    }
}

// @ts-ignore
window.PromiseCustom = PromiseCustom