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
      let r = window.confirm('Bạn có muốn rời đi?')
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
    if (inSearch) pathBack = true
    return (
      <div className="wrapper-icon" onClick={() => this.routeChange(pathBack)}>
        <i
          className={'fa ' + (isAllowBack ? 'fa-angle-left' : 'fa-angle-left')}
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

  renderButton = (fontawesomeClass = 'fa fa-bell') => {
    return (
        <i
          className={fontawesomeClass}
          aria-hidden="true"
          style={{
            // display: 'inline-block',
            borderRadius: '50%',
            boxShadow: '0px 0px 2px #888',
            padding: '0.5em 0.6em',
            color: 'white',
            marginLeft: '5px',
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
    )
  }

  render() {
    let namePath = _.get(this.props, 'path') || ''
    return (
      <div className="wrapper-header" style={{ zIndex: 2 }}>
        <div className="wrapper-header-left">
          {this.renderIconLeft()}
        </div>
        <div className="wrapper-header-center">
          <div className="header-image-wrapper">
            {/*{this.props.match.path.indexOf('edit') !== -1 || this.props.match.path.indexOf('create') !== -1 || this.props.match.path.indexOf('convert') !== -1 ? ('') :*/}
            {/*  (*/}
            {/*    <div className="header-image">*/}
            {/*      <i className="fa fa-search" aria-hidden="true"></i>*/}
            {/*      <form className="form-search" action="#" id="search-form" onSubmit={ e => { e.preventDefault() }} autoComplete="off">*/}
            {/*        <input type="search" className="input-search-header" style={{ fontSize: 'inherit' }}*/}
            {/*               placeholder="Search ..."*/}
            {/*               defaultValue={this.props.match.params.keyword}*/}
            {/*               onKeyPress={this._handleSearchEnter}*/}
            {/*               name="search" id="search"/>*/}
            {/*      </form>*/}
            {/*    </div>*/}
            {/*  )}*/}
            <img
              alt="Citigo"
              src={require('../../static/images/citigo.png')}
              className="header-image"
            />
          </div>
        </div>
        {!_.isEmpty(namePath) && (namePath.indexOf('create') !== -1 || namePath.indexOf('edit') !== -1 || namePath.indexOf('convert') !== -1) ? (
          <div className="wrapper-header-right">

            <div className="wrapper-icon">
              <button id="globalSaveButton" type="button" className="btn-add-new-lead" onClick={this.handleSubmit}
                      style={{ backgroundColor: 'white' }} disabled>
                Lưu
              </button>
            </div>
          </div>) : (
          <div className="wrapper-header-right">
            <div style={{flexGrow: 1}}/>
            <div className="header-button-list" style={{flexGrow: 2}}>
              {this.renderButton('fa fa-search')}
              {this.renderButton('fa fa-bell')}
            </div>
          </div>)}
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Header))
