function objectFactory () {
    const obj = Object.create(null)
    const [constructor,...params] = arguments
    obj.__proto__ = constructor.prototype
    return obj
}