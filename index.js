const info = {
    name: 'pjee'
}
function Person (sex) {
    console.log(`My name is ${this.name} ${sex}`)
}
const newPerson = Person.bind(info, 'nv')
newPerson() // => `My name is pjee`

Function.prototype.bindCustom = function (ctx) {
    const args = Array.prototype.slice.call(arguments, 1)
    return () => {
        this.apply(ctx, args)
    }
}

const newCustomPerson = Person.bindCustom(info, 'nan')
newCustomPerson()