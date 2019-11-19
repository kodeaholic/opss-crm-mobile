import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { getPathName } from '../../modules/routerDuck'

import './index.css'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  path: getPathName(state, ownProps)
})

const router = {
  lead: {
    back: ''
  },
  'customer-details': {
    back: 'lead'
  },
  'add-new-customer': {
    back: 'lead'
  }
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  routeChange = pathBack => {
    if (pathBack) this.props.history.push('/' + pathBack)
  }

  renderIconLeft = () => {
    const namePath = _.get(this.props, 'path') || ''
    const objPathOnRouter = _.get(router, [namePath])
    const pathBack = !_.isEmpty(objPathOnRouter)
      ? _.get(objPathOnRouter, 'back')
      : ''
    const isAllowBack = !!_.get(objPathOnRouter, 'back')

    return (
      <div className="wrapper-icon" onClick={() => this.routeChange(pathBack)}>
        <i
          className={'fa ' + (isAllowBack ? 'fa-arrow-left' : 'fa-bars')}
          aria-hidden="true"
          style={{
            fontSize: 26,
            color: '#ffffff'
          }}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="wrapper-header">
        {this.renderIconLeft()}
        <div className="wrapper-input">
          <i className="fa fa-search" aria-hidden="true"></i>
          <input type="text" className="input-search-header" style={{fontSize: 'inherit'}}/>
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

export default withRouter(connect(mapStateToProps)(Header))
