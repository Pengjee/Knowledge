const delMinStr = (str) => {
    const obj = {};

    for (let i = 0; i < str.length; i++) {
        if (obj[str[i]]) {
            obj[str[i]]++;
        } else {
            obj[str[i]] = 1
        }
    }

    const min = 1;
    let s = '';

    Object.keys(obj).map(key => {
       if (min >= obj[key]) {
           s = key
       }
    });
    return str.replace(s, '');
}

console.log(delMinStr('ababac'))