import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'
import {getPathName} from '../../modules/routerDuck'

import './index.css'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  path: getPathName(state, ownProps)
})

const router = {
  lead: {
    back: ''
  },
  'lead-view': {
    back: 'lead'
  },
  'contact-view': {
    back: 'contact'
  },
  'opportunity-view': {
    back: 'opprtunity'
  }
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // this._handleSearchEnter = this._handleSearchEnter.bind(this)
  }

  routeChange = pathBack => {
    if (pathBack) this.props.history.push('/' + pathBack)
    // this.props.history.goBack()
    else {
      document.getElementById("myDropdown").classList.toggle("show");
    }
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
        <div id="myDropdown" className="dropdown-content">
          {/*<a href="/lead"><i className="fa fa-user" aria-hidden="true"></i> &nbsp;Profile</a>*/}
          {/*<a href="/lead"><i className="fa fa-cog" aria-hidden="true"></i>&nbsp;Settings</a>*/}
          <a href="/logout"><i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp;Logout</a>
        </div>
      </div>
    )
  }

  _handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.history.push('/search/' + e.target.value)
    }
  }

  render() {
    return (
      <div className="wrapper-header" style={{zIndex: 2}}>
        {this.renderIconLeft()}
        <div className="wrapper-input">
          {this.props.match.path.indexOf('edit') !== -1 || this.props.match.path.indexOf('create') !== -1 ? (''):
            (
              <div className="wrapper-input">
              <i className="fa fa-search" aria-hidden="true"></i>
              <input type="text" className="input-search-header" style={{fontSize: 'inherit'}}
            placeholder="Seach..."
            defaultValue={this.props.match.params.keyword}
            onKeyPress={this._handleSearchEnter}
              /></div>
          )}
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
