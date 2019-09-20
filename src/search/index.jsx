import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import largeNumber from 'pack-component'
import pencilImg from './assets/pen.png'
import { a } from './tree-shaking'
import './search.less'

class Search extends Component {
  constructor() {
    super()
    this.state = {
      Text: null
    }
    this.loadComponent = this.loadComponent.bind(this)
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
    const result = largeNumber('199999', '1')

    return (
      <div>
        {Text ? <Text /> : null}
        {test}
        <p>{result}</p>
        <p className="search">搜索文件内容</p>
        <img src={pencilImg} alt="" />
        <Button onClick={this.loadComponent}>测试</Button>
      </div>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('root'))
