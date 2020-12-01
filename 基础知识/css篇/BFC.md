# BFC
BFC(Block Formatting Context) 直译为“块级格式化范围”。它是W3C CSS2.1规范中的一个概念，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用当涉及到可视化布局的时候，Block Formatting Context提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个BFC就是一个独立的行政单位的意思。
也可以说BFC就是一个作用范围。可以把它理解成是一个独立的容器，并且这个容器的里box的布局，与这个容器外的毫不相干。

## 如何形成BFC
1. float的值不能为none
2. overflow的值不为visible
3. display的值为table-cell,table-caption,inline-block中的任何一个
4. position的值部位relative和static

## BFC的约束规则
