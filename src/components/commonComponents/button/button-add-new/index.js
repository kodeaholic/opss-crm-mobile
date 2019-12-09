import React, { Component } from 'react'
import './index.css'
import { withRouter } from 'react-router-dom'
class ButtonAddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.history.push(this.props.pathToGoTo)
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} className="btn-add-new">
          <i className="fa fa-plus btn-add-new-icon"/>
        </button>
      </div>
    )
  }
}

export default withRouter(ButtonAddNew)