import React, { Component } from 'react'
import './index.css'
class ScrollToTop extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (e) => {
    // e.preventDefault()
    let div = document.getElementsByClassName('infinite-scroll-component')[0] // Hien tai moi 1 man chi co 1 scroll component
    if (div) div.scrollIntoView({ block: 'start',  behavior: 'smooth' }) // to TOP
    return true
  }

  render() {
    return (
      <div>
        <div onClick={this.handleClick} className="btn-scroll-to-top" id="scrollToTopBtn">
          <i className="fa fa-angle-up btn-scroll-to-top-icon" onClick={this.handleClick}/>
        </div>
      </div>
    )
  }
}

export default ScrollToTop