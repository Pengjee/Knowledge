class Singleton {
    // 私有变量，用于存储唯一实例
    static instance = null;

    // 私有构造函数
    constructor() {
        if (!Singleton.instance) {
            // 如果实例不存在，则创建实例
            Singleton.instance = this;
        }

        // 返回唯一实例
        return Singleton.instance;
    }

    // 公共方法
    showMessage() {
        console.log("Hello, I am a Singleton!");
    }
}

// 使用单例模式
const singleton1 = new Singleton();
singleton1.showMessage();  // 输出：Hello, I am a Singleton!

const singleton2 = new Singleton();
console.log(singleton1 === singleton2);  // 输出：true，因为它们是同一个实例