import React, { Component } from 'react'
import ReactDom from 'react-dom'
import pencilImg from './assets/pen.png'
import './search.less'

class Search extends Component {
  render() {
    return (
      <div>
        <p className="search">搜索</p>
        <img src={pencilImg} />
      </div>
    )
  }
}

ReactDom.render(<Search />, document.getElementById('root'))
