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