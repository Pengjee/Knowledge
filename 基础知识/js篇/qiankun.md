# qiankun

## Js隔离

### 沙箱快照 - SnapshotSandbox
缺点：
- 遍历window上的所有属性，性能差
- 同一时间只能激活一个微应用
- 污染全局window

优点：
- 兼容性高
  ![img.png](image/img.png)
```js
// 简易实现
class SnapshotSandbox {
    constructor() {
        this.fakeWindow = {}

        this.modifyWindow = {}
    }

    active () {
        // 保存window快照
        for (let prop in window) {
            this.fakeWindow[prop] = window[prop]
        }

        // 把缓存的上次快照还原回window
        Object.keys(this.modifyWindow).forEach((prop) => {
            window[prop] = this.modifyWindow[prop]
        })
    }

    // 失活，把当前window负值给缓存window
    inactive () {
        for (let prop in window) {
            if (window.hasOwnProperty(prop)) {
                // 两者不相同，表示修改了某个 prop 记录当前在 window 上修改了的 prop
                if (window[prop] !== this.modifyWindow[prop]) {
                    this.modifyWindow[prop] = window[prop]
                }

                // 还原window
                window[prop] = this.fakeWindow[prop]
            }
        }
    }
}
```

### Legacy沙箱 - LegacySandbox（单例）
- 不需要遍历window上所有的属性，直接通过proxy代理来实现copy
- 虽然基于proxy实现，但仍然污染了window，同一时间只能运行一个应用(还是在通过切换新增删除代理的proxyWindow里的属性来实现子应用的切换)

只维护了一个window
![img.png](image/img_1.png)
```js
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
```

### Proxy沙箱 - ProxySandbox
- 基于 proxy 代理对象，不需要遍历 window，性能要比快照沙箱好
- 支持多个应用
- 没有污染全局 window
- 应用失活后，依然可以获取到激活时定义的属性。
