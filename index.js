// 被观察者
class Subject {
    constructor() {
        this.observer = {}
    }

    add (event, fn) {
        if (this.observer[event]) {
            this.observer[event].push(fn)
        } else {
            this.observer[event] = [fn]
        }
    }

    notify (event, params) {
        this.observer[event].forEach(func => func(params))
    }
}

// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }

    update(nextState) {
        console.log('通知：被观察已更新');
    }
}


// 创建被观察者
const subject = new Subject();
// 收到广播时要执行的方法
const update = () => console.log('被观察者发出通知');
// 观察者 1
const obs1 = new Observer(update);
// 观察者 2
const obs2 = new Observer(update);

// 观察者 1 订阅 subject 的通知
subject.add('money', obs1.update);
// 观察者 2 订阅 subject 的通知
subject.add('money', obs2.update);

// 发出广播，执行所有观察者的 update 方法
subject.notify('money');
