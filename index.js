var foo = 1;
function fn() {
    foo = 3;
    return;
    function foo () {
        // todo
    }
}
fn();
console.log(foo); // 1