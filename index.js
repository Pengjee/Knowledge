function add(num1, num2) {
    const arr1 = num1.split('')
    const arr2 = num2.split('')
    const maxLenArr = arr1.length > arr2.length ? arr1 : arr2
    const minLenArr = arr1.length > arr2.length ? arr2 : arr1
    let ret = []
    let flag = false
    for (let i = maxLenArr.length - 1; i >= 0; i--) {
        const sum = Number(maxLenArr[i] || 0) + Number(minLenArr[i] || 0) + (flag ? 1 : 0)
        if (sum >= 10) {
           flag = true
           ret.push(sum - 10)
        } else {
            flag = false
            ret.push(sum)
        }
    }
    let str = ''
    ret.forEach((item) => {
        str = item + str
    })
    return str
}

add('123', '123')