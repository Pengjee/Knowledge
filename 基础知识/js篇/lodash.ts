const lodash = {
    get: undefined
}
lodash.get = (origin, str) => {
    let [key, ...other] = str.split('.')
    other = other.join('.')
    // 判断是否时数组
    const index = /[\d]/g.exec(key);
    if (index) {
        // 匹配数组的key
        [key] = key.split('[')
        if (origin.hasOwnProperty(key) && other && typeof origin[key][index[0]] === 'object') {
            return lodash.get(origin[key][index[0]], other)
        }
    } else {
        if (origin.hasOwnProperty(key) && other && typeof origin[key] === 'object') {
            return lodash.get(origin[key], other)
        }
    }
    return origin[key]
}