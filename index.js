function deepClone (obj, hash = new WeakMap) {
    if (obj === null) return obj
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    if (typeof obj !== 'object') return obj
    if (hash.has(obj)) return hash.get(obj)

    const cache = new obj.constructor()
    hash.set(obj, cache)

    for (let key of obj) {
        if (obj.hasOwnProperty(key)) {
            cache[key] = deepClone(obj[key], hash)
        }
    }
    return obj
}