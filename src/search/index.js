import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import pencilImg from './assets/pen.png'
import { a } from './tree-shaking'
import './search.less'

class Search extends Component {
  render() {
    let test = a()

    return (
      <div>
        {test}
        <p className="search">搜索文件内容</p>
        <img src={pencilImg} />
      </div>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('root'))
