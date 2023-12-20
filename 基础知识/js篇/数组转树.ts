const data = [
    {id: 0, parent: -1},
    {id: 1, parent: 0},
    {id: 2, parent: 0},
    {id: 3, parent: 0},
    {id: 4, parent: 2},
    {id: 5, parent: 2},
    {id: 6, parent: 9},
    {id: 7, parent: 6},
    {id: 8, parent: 6},
]

function fn(list) {
    let obj = {}
    let res = []
    for (let item of list) {
        obj[item.id] = item
    }
    for (let item of list) {
        if (obj[item.parent]) {
            (obj[item.parent].children || (obj[item.parent].children = [])).push(item)
        } else {
            res.push(item)
        }
    }
    return res
}
const ret = fn(data)
console.log(ret)