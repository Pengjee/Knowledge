### 1、BFC是什么？
BFC 全称为 block formatting context，中文为“块级格式化上下文”。它是一个只有块级盒子参与的独立块级渲染区域，它规定了内部的块级盒子如何布局，且与区域外部无关。

#### BFC 有什么用
- 修复浮动元素造成的高度塌陷问题。
- 避免非期望的外边距折叠。
- 实现灵活健壮的自适应布局。
#### 怎么开启BFC
- float 的值不为 none。
- position 的值不为 relative 或 static。
- overflow 的值不为 visible 或 clip（除了根元素）。
- display 的值为 table-cell，table-caption，或 inline-block 中的任意一个。
- display 的值为 flow-root，或 display 值为 flow-root list-item。
- flex items，即 display 的值为 flex 或 inline-flex 的元素的直接子元素（该子元素 display 不为 flex，grid，或 table）。
- grid items，即 display 的值为 grid 或 inline-grid 的元素的直接子元素（该子元素 display 不为 flex，grid，或 table）。
- contain 的值为 layout，content，paint，或 strict 中的任意一个。
- column-span 设置为 all 的元素。

### 2、回流和重绘是什么？有什么区别？
#### 回流（Layout）
根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（位置，大小）
#### 重绘（Painting）
根据渲染树以及回流得到的几何信息，得到节点的绝对像素，重新绘制

页面布局和几何信息发生变化时，会进行回流，触发回流必定导致重绘。颜色、阴影、文本方向的修改会发起重绘，但并不会导致回流
### 3、flex布局
弹性布局
```css
.style {
    flex-direction: row | row-reverse | column | column-reverse; // 主轴方向
    flex-wrap: wrap | no-wrap | wrap-reverse; // 是否换行
    justify-content: flex-start | flex-end | center | space-between | space-around; // 主轴上的对齐方式
    // baseline 项目的第一行文字的基线对齐
    align-items: flex-start | flex-end | center | baseline | stretch; // 项目在交叉轴上如何对齐
    align-content: flex-start | flex-end | center | space-between | space-around | stretch; // 定义了多根轴线的对齐方式
    flex-grow: 0; // 项目的放大比例
    flex-shrink: 1; // 项目的缩小比例
    flex-basis: auto; // 定义了在分配多余空间之前，项目占据的主轴空间
}
```
flex: 1 表示撑满整个父容器
flex: start, margin-left: auto 表示设置的子节点右对齐剩余的左对齐

### CSS3硬件加速

我们可以在浏览器中用CSS开启硬件加速，使GPU发挥功能，从而提升性能。现在大多数的电脑都支持硬件加速。鉴于此，我们可以发挥GPU的力量，从而使我们的网站或应用表现的更为流畅。

#### PC和移动端用CSS开启硬件加速
CSS animations，transforms以及transitions不会自动开启GPU加速，而是由浏览器的软件渲染引擎来执行。我们可以通过浏览器提供的特定的CSS规则来切换到GPU模式。

现在，像Chrome，FireFox，Safari，IE9+这些主流浏览器都支持硬件加速，当他们检测到页面中某个DOM元素应用了某些CSS规则时就会开启，最显著的就是3D变换。
```css
.cube { 
 -webkit-transform: translate3d(250px,250px,250px)
   rotate3d(250px,250px,250px,-120deg)
   scale3d(0.5, 0.5, 0.5)
}
```
但是在某些情况下，我们并不需要对元素应用3D变换的效果，那怎么办呢？这时候我们可以使用一个小技巧“欺骗”浏览器来开启硬件加速。  
虽然我们可能不想对元素应用3D变换，可我们一样可以开启3D引擎。例如我们可以设置`transform: translateZ(0)`来开启硬件加速。
```css
.cube { 
   -webkit-transform: translateZ(0);
   -moz-transform: translateZ(0);
   -ms-transform: translateZ(0);
   -o-transform: translateZ(0);
   transform: translateZ(0);
}
```
在Chrome和Safari中，当我们使用CSS transforms或者animations时可能会有页面闪烁的效果，下面的代码可以修复该情况：
```css
.cube {
   -webkit-backface-visibility: hidden;
   -moz-backface-visibility: hidden;
   -ms-backface-visibility: hidden;
   backface-visibility: hidden;
 
   -webkit-perspective: 1000;
   -moz-perspective: 1000;
   -ms-perspective: 1000;
   perspective: 1000;
   /* Other transform properties here */
}
```
原生的移动端应用总是可以很好的运用GPU,这是为什么它比网页应用表现更好的原因。硬件加速在移动端尤其有用，因为它可以有效的减少资源的利用。但是过多使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且他会减少移动端设备的电池寿命。

### Css隐藏属性
```css
.hidden {
    display: none;
    
    visibility: hidden;
    
    opacity: 0;
    
    height: 0;
    width: 0;
    z-index: -999
}
```
回流：`display`、`position`
重绘：`visibility`、`opacity`、`z-index`
