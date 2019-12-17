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

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // this._handleSearchEnter = this._handleSearchEnter.bind(this)
  }

  routeChange = path => {
    if (path) {
      this.props.history.push('/' + path)
    }
  }

  renderIconLeft = () => {
    let path = undefined
    let search = this.props.location.search
    if (search.indexOf('previousScreen') !== -1) {
      search = search.split('previousScreen=')[1]
      if (!_.isEmpty(search)) {
        path = search
      }
    }
    return (
      <div className="wrapper-icon" onClick={() => this.routeChange(path)}>
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
        let userLoginData = localStorage.getItem('userLoggedInKV')
        userLoginData = JSON.parse(userLoginData).result.login
        let userId = userLoginData.userid
        let searchHistory = localStorage.getItem('searchHistory')
        if (_.isEmpty(searchHistory)) {
          searchHistory = {}
          searchHistory[userId+""] = [e.target.value]
        } else {
          searchHistory = JSON.parse(searchHistory)
          let keywords = searchHistory[userId+""]

          /* Find and delete duplicate keyword */
          let index = keywords.indexOf(e.target.value)
          if(index !== -1) {
            // delete keyword at index
            keywords.splice(index, 1)
          }
          keywords.unshift(e.target.value)
          searchHistory[userId + ""] = keywords
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
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
            backgroundColor: 'rgba(255,255,255,0.3)'
          }}
        />
      </a>
    )
  }

  renderCancelButton = () => {
    let path = undefined
    let search = this.props.location.search
    if (search.indexOf('previousScreen') !== -1) {
      search = search.split('previousScreen=')[1]
      if (!_.isEmpty(search)) {
        path = search
      }
    }
    return (
      <button className="cancel-button" onClick={() => this.routeChange(path)}>Hủy</button>
    )
  }

  renderSearchBox = () => {
    return (
      <form className="form-search" action="#" id="search-form" onSubmit={e => {
        e.preventDefault()
      }} autoComplete="off">
        <input type="search" className="search-box-input" style={{ fontSize: 'inherit' }}
               placeholder="&#xF002; Nhập từ khóa tìm kiếm"
               onKeyPress={this._handleSearchEnter}
               name="search" id="search"/>
      </form>
    )
  }

  renderSearchHistory = () => {

  }

  render() {
    return (
      <div className="search-box-header" style={{ zIndex: 2 }}>
        <div className="search-box-wrapper">
          {this.renderSearchBox()}
          {this.renderCancelButton()}
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(SearchBox))
