import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import _ from 'lodash'
import './index.css'

export default class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const label = _.get(this.props, 'label') || 'noLabel'
    const path = _.get(this.props, 'path')
    return (
      <Link to={path}>
        <button type="button" className="btn-add-new-lead">
          {label}
        </button>
      </Link>
    )
  }
}
