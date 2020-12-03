# React的基类
在`React`中如果我们使用类方式来开发组件，我们都会去继承一个基类，通常有`Component、PureComponent`两种基类供我们选择。
```jsx
class TestPage extends Component {
  render () { return () }
}
```

## Component
`Component`应该是我们使用最多一个基类了，它主要帮助更新组件的状态。它接收3个参数`props, context, updater`
```js
function Component(props, context, updater) {
  this.props = props; //
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
```
前面`props、 context、 refs`都很好理解，大家也都经常会用到，但`updater`就很少看到了。我们先来看一下他的默认值`ReactNoopUpdateQueue`

### ReactNoopUpdateQueue