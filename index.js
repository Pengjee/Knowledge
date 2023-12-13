function Person(){}

Person.prototype = {
    name: 'Nicholas',
    age: 29,
    job: 'Software Engineer',
    friends: ['Shelby', 'Court'],
    sayName: function (){
        console.log(this.name);
    }
}

const person1 = new Person();
const person2 = new Person();

person1.friends.push('Van');

console.log(person1.friends);
// 'Shelby,Court,Van'
console.log(person2.friends);
// 'Shelby,COurt,Van'
console.log(person1.friends == person2.friends);
// true
person1.friends.push('Lucy')
console.log(person1.friends, person2.friends)