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
  'lead-view': {
    back: 'lead'
  },
  'lead-convert': {
    back: 'lead-view',
    withId: true
  },
  'lead-edit': {
    back: 'lead-view',
    withId: true
  },
  'lead-create': {
    back: 'lead'
  },
  'contact-view': {
    back: 'contact'
  },
  'contact-edit': {
    back: 'contact-view',
    withId: true
  },
  'calendar' : {
    back: 'more'
  },
  'ticket' : {
    back: 'more'
  }
  // More

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
      return r === true
    } else {
      return true
    }
  }
  routeChange = pathBack => {
    if (pathBack) {
      if (this.conditionalBack()) {
        this.props.history.push('/' + pathBack)
      }
      else return false
    }
  }

  renderIconLeft = () => {
    const namePath = _.get(this.props, 'path') || ''
    const objPathOnRouter = _.get(router, [namePath])
    let pathBack = !_.isEmpty(objPathOnRouter)
      ? _.get(objPathOnRouter, 'back')
      : ''
    if (!_.isEmpty(pathBack)) {
      let withId = _.get(objPathOnRouter, 'withId')
      if (withId) {
        let pathName = this.props.location.pathname
        pathBack += "/" + pathName.split('/')[2]
      }
    }
    const isAllowBack = !!_.get(objPathOnRouter, 'back')
    return (
      <div className="wrapper-icon" onClick={() => this.routeChange(pathBack)} style={{display: isAllowBack ? '' : 'none'}}>
        <i
          className={'fa fa-angle-left'}
          aria-hidden="true"
          style={{
            fontSize: 26,
            color: '#ffffff'
          }}
        />
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

  renderButton = (fontawesomeClass = 'fa fa-bell', path = '', badge = 0) => {
    return (
      <a href={path} className={badge > 0 ? 'notifications' : ''}>
        <i
          className={fontawesomeClass}
          aria-hidden="true"
          style={{
            // display: 'inline-block',
            borderRadius: '50px',
            boxShadow: '0px 0px 2px #888',
            padding: '0.5em 0.6em',
            color: 'white',
            marginLeft: '5px',
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
      </a>
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
              {this.renderButton('fa fa-search', '/search')}
              {this.renderButton('fa fa-bell', '/notifications')}
            </div>
          </div>)}
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Header))
