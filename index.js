const  isPropConfigurable = (target, prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, prop);
    return descriptor ? descriptor.configurable : true;
}

class LegacySandbox {
    constructor(name, globalContext) {
        this.name = name
        this.globalContext = globalContext
        // 沙箱期间新增的全局变量
        this.addedPropsMapInSandbox = new Map()

        // 沙箱期间更新的全局变量
        this.modifiedPropsOriginValueMapInSandBox = new Map()

        // 持续记录更新的全局变量的map
        this.currentUpdatedPropsValueMap = new Map()
        this.sandboxRunning = false

        const rawWindow = globalContext
        const fakeWindow = Object.create(null)

        const setTrap = () => {}

        const proxy = new Proxy(fakeWindow, {
            set: (_, key, value) => {
                const originValue = rawWindow[key]

                // 把变更的属性同步到addedPropsMapInSandbox、modifiedPropsOriginalValueMapInSandbox以及currentUpdatedPropsValueMap
                return setTrap(key, value, originValue)
            },
            get: (_, key) => {
                // 防止通过使用top、parent、window、self访问外层真实的环境
                if (key === 'top' || key === 'parent' || key === 'window' || key === 'self') {
                    return proxy;
                }
                const value = rawWindow[p];
                return value
            }
        })
    }

    active () {
        if (this.sandboxRunning) {
            this.currentUpdatedPropsValueMap.forEach((value, key) => {
                this.setWindowProp(key, value)
            })
        }
        this.sandboxRunning = true
    }

    inactive () {
        // 遍历修改过的属性，重新还原回初始值
        this.modifiedPropsOriginValueMapInSandBox.forEach((value, key) => {
            this.setWindowProp(key, value)
        })
        // 遍历新增的属性，重新在window上移除
        this.addedPropsMapInSandbox.forEach((value, key) => {
            this.setWindowProp(key, undefined, true)
        })

        this.sandboxRunning = false;
    }

    setWindowProp(prop, value, isDel) {
        if (value === undefined && isDel) {
            delete this.globalContext[prop]
            // 全局对象上属性可变更
        } else if (isPropConfigurable(this.globalContext, prop) && typeof prop !== 'symbol') {
            Object.defineProperty(this.globalContext, prop, { writable: true, configurable: true })
            this.globalContext[prop] = value
        }
    }
}