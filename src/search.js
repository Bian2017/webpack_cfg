import React, { Component } from 'react'
import ReactDom from 'react-dom'
import './search.less'

class Search extends Component {
  render() {
    return <div className="search">search</div>
  }
}

ReactDom.render(<Search />, document.getElementById('root'))
