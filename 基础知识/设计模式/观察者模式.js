class Subject {
    constructor() {
        this.observers = []
    }

    add (event) {
        this.observers.push(event)
    }

    notify (params) {
        this.observers.forEach((fn) => fn.update(params))
    }
}

class Observer {
    constructor(name) {
        this.name = name
    }

    update (nextState) {
        console.log('被观察已更新', nextState)
    }
}