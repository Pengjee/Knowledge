# CSS3硬件加速

我们可以在浏览器中用CSS开启硬件加速，使GPU发挥功能，从而提升性能。现在大多数的电脑都支持硬件加速。鉴于此，我们可以发挥GPU的力量，从而使我们的网站或应用表现的更为流畅。

## PC和移动端用CSS开启硬件加速
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