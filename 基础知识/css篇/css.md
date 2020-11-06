## CSS优先级权重
ID 选择器， 如 `#id{}`
类选择器， 如 `.class{}`
属性选择器， 如 `a[href="segmentfault.com"]{}`
伪类选择器， 如 `:hover{}`
伪元素选择器， 如 `::before{}`
标签选择器， 如 `span{}`
通配选择器， 如 `*{}`  
内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器

## 盒子模型
由于前端规范的不统一，所以盒子模型分为两种：IE和W3C  
* IE盒子模型可通过`box-sizing: border-box`来设置，`content = width + padding + border`
* W3C盒子模型可通过`box-sizing: content-box`来设置，`content = width`

## BFC
BFC（Block Formatting Context)，全称为块格式化上下文，是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

> 下列方式会创建**BFC**:  
> * 根元素(`html`)
> * 浮动元素(元素的`float`不是`none`)
> * 绝对定位元素（元素的`position`为`absolute`或`fixed`）
> * 行内块元素（元素的`display`为`inline-block`）
> * 表格单元格（元素的`display`为`table-cell`,`HTML`表格单元格默认为该值）
> * 表格标题（元素的`display`为`table-caption`，`HTML`表格标题默认为该值）
> * 匿名表格单元格元素（元素的`display`为`table`、`table-row`、 `table-row-group`、`table-header-group`、`table-footer-group`（分别是HTML`table`、`row`、`tbody`、`thead`、`tfoot` 的默认属性）或 `inline-table`）
> * `overflow` 值不为 `visible` 的块元素
> * `display` 值为 `flow-root` 的元素
> * `contain` 值为 `layout`、`content` 或 `paint` 的元素
> * 弹性元素（`display` 为 `flex` 或 `inline-flex` 元素的直接子元素）
> * 网格元素（`display` 为 `grid` 或 `inline-grid` 元素的直接子元素）
> * 多列容器（元素的 `column-count` 或 `column-width` 不为 `auto`，包括 `column-count` 为1）
> * `column-span` 为 `all` 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中

## Flex布局
这个就直接看阮一峰老师的好了，已经讲的特别特别清楚了[flex布局](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## 垂直居中
这个问题已经是老生常谈的CSS问题了，下面梳理了几种不同实现方式的🌰，可不同场景中使用  
**方法一:**
```css
height: 100px;
width: 100px;
margin: calc((100vh - 100px)/2) auto;   
```
**方法二:**
```css
display:flex;
flex-flow: row;
justify-content: center;
align-items: center;
```
**方法三:**
```css
position: relative;
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
```