class EventEmit {
    constructor() {
        this.watcher = {}
    }

    add (event, fn) {
        if (this.watcher[event]) {
            this.watcher[event].push(fn)
        } else {
            this.watcher[event] = [fn]
        }
    }

    remove (event, fn) {
        this.watcher[event] = this.watcher[event].filter(cb => cb !== fn)
    }

    emit (event, data) {
        this.watcher[event].forEach((fn) => {
            fn.call(null, data)
        })
    }
}