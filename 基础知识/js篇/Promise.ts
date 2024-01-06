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
        return new PromiseCustom((resolve, reject) => {
            // 成功
            if (this.status === REQUEST_STATUS.FULFILLED) {
                const ret = onFulfilled(this.value)
                resolve(ret)
            }
            // 失败
            if (this.status === REQUEST_STATUS.REJECTED) {
                const ret = onRejected(this.reason)
                reject(ret)
            }
            // 处理中
            if (this.status === REQUEST_STATUS.PENDING) {
                this.onResolveCallbacks.push(() => {
                    const ret = onFulfilled(this.value)
                    resolve(ret)
                })
                this.onRejectedCallbacks.push(() => {
                    const ret = onRejected(this.reason)
                    reject(ret)
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