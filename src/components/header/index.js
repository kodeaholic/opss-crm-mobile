import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import './index.css'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="wrapper-header">
        <div className="wrapper-icon">
          <i
            className="fa fa-bars"
            aria-hidden="true"
            style={{
              fontSize: 26,
              color: '#ffffff'
            }}></i>
        </div>
        {/* <Link to="/">Home22222</Link>
        <Link to="/about-us">About</Link> */}
        <div className="wrapper-input">
          <i className="fa fa-search" aria-hidden="true"></i>
          <input type="text" />
        </div>
        <div className="wrapper-icon">
          <i
            className="fa fa-bell"
            aria-hidden="true"
            style={{
              fontSize: 26,
              color: '#ffffff'
            }}></i>
        </div>
      </div>
    )
  }
}
