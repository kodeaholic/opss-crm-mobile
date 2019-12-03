import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { getPathName } from '../../modules/routerDuck'

import './index.css'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

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
  'lead-convert': {
    back: 'lead-view'
  },
  'lead-edit': {
    back: 'lead-view'
  },
  'lead-create': {
    back: 'lead'
  },
  'contact-view': {
    back: 'contact'
  },
  'opportunity-view': {
    back: 'opportunity'
  }
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // this._handleSearchEnter = this._handleSearchEnter.bind(this)
  }

  conditionalBack = () => {
    // CMB-81
    if (window.location.href.indexOf('form-changed') !== -1) {
      let r = window.confirm("Bạn có muốn rời đi?");
      if (r === true) {
        window.history.go(-2)
      } else {
        return false
      }
    } else {
      window.history.back()
    }
  }
  routeChange = pathBack => {
    if (pathBack) {
      // this.props.history.push('/' + pathBack)
      this.conditionalBack()
    }
    // this.props.history.goBack()
    else {
      document.getElementById('myDropdown').classList.toggle('show')
    }
  }

  renderIconLeft = () => {
    const namePath = _.get(this.props, 'path') || ''
    const objPathOnRouter = _.get(router, [namePath])
    let pathBack = !_.isEmpty(objPathOnRouter)
      ? _.get(objPathOnRouter, 'back')
      : ''
    let inSearch = !_.isEmpty(namePath) ? namePath.indexOf('search') !== -1 : false
    const isAllowBack = !!_.get(objPathOnRouter, 'back') || inSearch
    if(inSearch) pathBack = true
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
      if (e.target.value && e.target.value != '' && e.target.value.length >= 3) {
        this.props.history.push('/search/' + e.target.value)
      } else {
        toast.error('Vui lòng nhập nhập 3 kí tự trở lên')
        return false
      }
    }
  }

  render() {
    let namePath = _.get(this.props, 'path') || ''
    return (
      <div className="wrapper-header" style={{ zIndex: 2 }}>
        {this.renderIconLeft()}
        <div className="wrapper-input">
          {this.props.match.path.indexOf('edit') !== -1 || this.props.match.path.indexOf('create') !== -1 || this.props.match.path.indexOf('convert') !== -1 ? ('') :
            (
              <div className="wrapper-input">
                <i className="fa fa-search" aria-hidden="true"></i>
                <form className="form-search" action="#" id="search-form" onSubmit={ e => { e.preventDefault() }} autoComplete="off">
                  <input type="search" className="input-search-header" style={{ fontSize: 'inherit' }}
                         placeholder="Search ..."
                         defaultValue={this.props.match.params.keyword}
                         onKeyPress={this._handleSearchEnter}
                         name="search" id="search"/>
                </form>
              </div>
            )}
        </div>
        <div className="wrapper-icon">
          {!_.isEmpty(namePath) && (namePath.indexOf('create') !== -1 || namePath.indexOf('edit') !== -1 || namePath.indexOf('convert') !== -1) ? (<button id="globalSaveButton" type="button" className="btn-add-new-lead" onClick={this.handleSubmit} style={{backgroundColor: "white"}} disabled>
            Lưu
          </button>) : (
            <i
              className="fa fa-bell"
              aria-hidden="true"
              style={{
                fontSize: 26,
                color: '#ffffff'
              }}></i>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Header))
