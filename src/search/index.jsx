import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import pencilImg from './assets/pen.png'
import { a } from './tree-shaking'
import './search.less'

class Search extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      Text: null
    }
  }

  loadComponent() {
    // 动态引入。返回的是一个promise对象。
    import('./text.jsx').then(Text => {
      this.setState({
        Text: Text.default
      })
    })
  }

  render() {
    const { Text } = this.state
    const test = a()

    return (
      <div>
        {Text ? <Text /> : null}
        {test}
        <p className="search">搜索文件内容</p>
        <img src={pencilImg} />
        <Button onClick={this.loadComponent.bind(this)}>测试</Button>
      </div>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('root'))
