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

function arrayToTree (data = []) {
    if (data.length === 0) return []
    const ret = []
    const obj = {}
    for (let i = 0; i < data.length; i++) {
        obj[data[i].id] = data[i]
    }

    for (let i = 0; i < data.length; i++) {
        if (obj[data[i].parent]) {
            (obj[data[i].parent].children || (obj[data[i].parent].children = [])).push(data[i])
        } else {
            ret.push(data[i])
        }
    }
    return ret
}


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