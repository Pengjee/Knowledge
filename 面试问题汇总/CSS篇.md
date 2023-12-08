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