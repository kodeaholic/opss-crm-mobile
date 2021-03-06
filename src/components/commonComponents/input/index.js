import React, { Component } from 'react'
import _ from 'lodash'
import './index.css'

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      val: ''
    }
  }

  componentWillMount() {
    const value = _.get(this.props, 'val') || ''
    if (value) {
      this.setState({ val: value })
    }
  }

  handleChange = event => {
    this.setState({ val: event.target.value })
  }

  render() {
    const label = _.get(this.props, 'label') || 'noLabel'
    const isRequire = _.get(this.props, 'isRequire') || false
    const isMultiLine = _.get(this.props, 'isMultiLine') || false
    const isReadOnly = _.get(this.props, 'readOnly') || false
    const value = _.get(this.props, 'val') || ''
    const name = _.get(this.props, 'name') || ''
    return (
      <div className="wrapper-input-common-component">
        <label className="label-input-common-component">
          {label}
          {isRequire ? (
            <span className="require-input-common-component"> (*)</span>
          ) : null}
        </label>
        {isMultiLine ? (
          <textarea
            className="input-input-common-component"
            rows="5"
            readOnly={isReadOnly}
            defaultValue={value}
            onChange={this.handleChange}
            style={isReadOnly ? {border: 'transparent', fonSize: '14px', color: 'grey'} : {}}
          />
        ) : (
          <input
            name={name}
            type="text"
            className="input-input-common-component"
            readOnly={isReadOnly}
            defaultValue={value}
            onChange={this.handleChange}
            style={isReadOnly ? {border: 'transparent', fontSize: '1em', color: 'grey'} : {}}
          />
        )}
        {/*<label>warning</label>*/}
      </div>
    )
  }
}
