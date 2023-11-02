var foo = function () {
    console.log(this.a)
}
const b = { a: 1 }
const c = { a: 2 }
var bar = function () {
    foo.call(b);
};
bar()
bar.call(c)
bar = function () {
    foo.call(c)
}


