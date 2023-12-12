const REQUEST_STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}

class PromiseCustom {
    private status: string;
    private value: any;
    private reason: any;
    private onResolveCallbacks: any[];
    private onRejectedCallbacks: any[];
    constructor(executor) {
        // 默认初始状态
        this.status = REQUEST_STATUS.PENDING
        // 存放结果
        this.value = undefined;
        // 失败原因
        this.reason = undefined;
        // 存放成功回调，防止回调中存在异步函数
        this.onResolveCallbacks = []
        // 存放失败回调，防止回调中存在异步函数
        this.onRejectedCallbacks = []

        // 成功
        const resolve = (value) => {
            console.log(value)
            // 如果 value 是一个promise，那我们的库中应该也要实现一个递归解析
            if(value instanceof PromiseCustom){
                // 递归解析
                return value.then(resolve,reject)
            }
            if (this.status === REQUEST_STATUS.PENDING) {
                this.status = REQUEST_STATUS.FULFILLED
                this.value = value

                this.onResolveCallbacks.forEach(fn => fn())
            }
        }

        // 失败
        const reject = (reason) => {
            if (this.status === REQUEST_STATUS.PENDING) {
                this.status = REQUEST_STATUS.REJECTED
                this.reason = reason

                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    then(onFulfilled, onRejected) {
        // 添加默认值
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        }
        return new PromiseCustom((resolve, reject) => {
            // 成功
            if (this.status === REQUEST_STATUS.FULFILLED) {
                setTimeout(() => {
                    try {
                        const ret = onFulfilled(this.value)
                        resolve(ret)
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            }
            // 失败
            if (this.status === REQUEST_STATUS.REJECTED) {
                setTimeout(() => {
                    try {
                        const ret = onRejected(this.reason)
                        reject(ret)
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            }
            // 处理中
            if (this.status === REQUEST_STATUS.PENDING) {
                this.onResolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const ret = onFulfilled(this.reason)
                            resolve(ret)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const ret = onRejected(this.reason)
                            reject(ret)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0)
                })
            }
        })
    }

    static reject (data) {
        return new PromiseCustom((resolve, reject) => {
            reject(data)
        })
    }

    static resolve (data) {
        return new PromiseCustom((resolve, reject) => {
            resolve(data)
        })
    }

    catch(errCallback) {
        this.then(null, errCallback)
    }
}