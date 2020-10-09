## Flex布局

flex属性用于设置或者检索弹性盒模型对象的子元素如何分配空间。它包含三个属性`flex-grow`，`flex-shrink`，`flex-basis`.

### CSS语法
```css
flex: flex-grow flex-shrink flex-basis|auto|initial|inherit;
```
|  值   | 描述  |
|  ----  | ----  |
| flex-grow  | number，规定项目将相对于其他灵活的项目进行扩展的量。 |
| flex-shrink  | number，规定项目将相对于其他灵活的项目进行收缩的量。 |
| flex-basis | 项目长度。合法值: 'auto'，'inherit'或一个后跟'%'，'px'，'em'或任何其他长度单位的数字 |
| auto | 与1 1 auto相同 |
| none | 与0 0 auto相同 |
| initial | 设置该属性为它的默认属性，即为0 1 auto |
| inherit | 从父元素继承该属性 |
### Flex布局理解
其实从上面的概念我们很难去理解flex三个属性值是什么意思，什么叫扩展量，什么叫收缩量，什么又叫项目长度。其实我们可以用一个小学数学分钱的方式来理解它。举个🌰：  
已知钱有1000块，现在有A、B、C、D、E五个人。并且已经讨论好如何分配钱了。  
A: 当钱分完后有多时，A不要多余的钱，当钱不够时分出B、C分出的2倍的财产，自己拿150块（`flex: 0 2 150px`）  
B: 当钱分完后有多时，B也不要多余的钱，但是会在钱不够时分出部分财产，自己拿100块（`flex: 0 1 100px`）  
C: 当钱分完后有多时，C也不要多余的钱，也不分出自己的财产，自己拿100块（`flex: 0 0 100px`）  
D: 当钱分完后有多时，D会拿多余的钱，且会在财产不足时候享用哥哥们分出的财产，自己拿50块（`flex: 3 0 50px`）  
E: 当钱分完后有多时，E会拿多余的钱，且会在财产不足时候享用哥哥们分出的财产，自己拿50块（`flex: 2 0 50px`）  
转化成数学等式就是：
```js
// 当总共有1000块时
const surplus = 1000 - 150 - 100 - 100 - 50 - 50 // 550
const A = 150;
const B = 100;
const C = 100;
const D = 50 + (550 / 5) * 3 // 380
const E = 50 + (500 / 5) * 2 // 270
// 当总共有400块时
const surplus = 400 - 150 - 100 - 100 - 50 - 50 // -50
const A = 150 - 37.5 // 112.5
const B = 100 - 12.5 // 87.5
const C = 100
const D = 50
const E = 50
```
那么转换成CSS就是：
```css
.container {
    display: flex;
}
.A { flex: 0 2 150px; }
.B { flex: 0 1 100px; }
.C { flex: 0 0 100px; }
.D { flex: 3 0 50px; }
.E { flex: 2 0 50px; }
```
