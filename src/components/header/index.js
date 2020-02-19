import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import { getPathName } from '../../modules/routerDuck'

import './index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toast } from 'react-toastify'
import { getSearchResult} from '../../modules/searchDuck'

const mapStateToProps = (state, ownProps) => ({
  path: getPathName(state, ownProps)
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getSearchResult
    },
    dispatch
  )
})

const router = {
  'lead-view': {
    back: 'lead',
    title: 'Lead details'
  },
  'lead-convert': {
    back: 'lead-view',
    withId: true,
    title: 'Convert Lead'
  },
  'lead-edit': {
    back: 'lead-view',
    withId: true,
    title: 'Sửa Lead'
  },
  'lead-create': {
    back: 'lead',
    title: 'Thêm Lead'
  },
  'contact-view': {
    back: 'contact',
    title: 'Contact details'
  },
  'contact-edit': {
    back: 'contact-view',
    withId: true,
    title: 'Sửa Contact'
  },
  'opportunity-view': {
    back: 'opportunity',
    title: 'Opportunity details'
  },
  'calendar': {
    back: 'more'
  },
  'ticket': {
    back: 'more'
  },
  /* Tao moi opt */
  'opt-phan-mem': {
    back: 'contact-view',
    title: 'Tạo mới hợp đồng phần mềm'
  },
}

const pathNamesWithoutSearch = [
  '/search',
  'edit',
  'convert',
  'view',
  '/opt-phan-mem',
]

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
      } else return false
    }
  }

  renderIconLeft = (color = '#ffffff') => {
    const namePath = _.get(this.props, 'path') || ''
    const objPathOnRouter = _.get(router, [namePath])
    let pathBack = !_.isEmpty(objPathOnRouter)
      ? _.get(objPathOnRouter, 'back')
      : ''
    if (!_.isEmpty(pathBack)) {
      let withId = _.get(objPathOnRouter, 'withId')
      if (withId) {
        let pathName = this.props.location.pathname
        pathBack += '/' + pathName.split('/')[2]
      }
    }
    let isAllowBack = !!_.get(objPathOnRouter, 'back')
    let search = this.props.location.search
    let indexOfPathBack = search.indexOf('pathBack')
    if (indexOfPathBack !== -1) {
      isAllowBack = true
      search = search.substr(indexOfPathBack + 9) // extract from pathBack= until the end of URL
      if (!_.isEmpty(search)) {
        pathBack = search
        isAllowBack = true
      }
    } else {
      if (search.indexOf('previousScreen') !== -1) {
        search = search.split('previousScreen=')[1]
        if (!_.isEmpty(search)) {
          pathBack = search
          isAllowBack = true
        }
      }
    }
    return (
      <div className="wrapper-icon" onClick={() => this.routeChange(pathBack)}
           style={{ display: isAllowBack ? '' : 'none' }}>
        <i
          className={'fa fa-angle-left'}
          aria-hidden="true"
          style={{
            fontSize: 26,
            color: color
          }}
        />
      </div>
    )
  }
  addToSearchHistory = (keyword) => {
    let userLoginData = localStorage.getItem('userLoggedInKV')
    userLoginData = JSON.parse(userLoginData).result.login
    let userId = userLoginData.userid
    let searchHistory = localStorage.getItem('searchHistory')
    if (_.isEmpty(searchHistory)) {
      searchHistory = {}
      searchHistory[userId + ''] = [keyword]
    } else {
      searchHistory = JSON.parse(searchHistory)
      let keywords = searchHistory[userId + '']

      /* Find and delete duplicate keyword */
      let index = keywords ? keywords.indexOf(keyword) : -1
      if (index !== -1) {
        // delete keyword at index
        keywords.splice(index, 1)
      }
      if (_.isEmpty(keywords)) {
        keywords = [keyword]
      }
      else {
        keywords.unshift(keyword)
      }
      searchHistory[userId + ''] = keywords
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }

  _handleSearchEnter = (e) => {
    let search = "search-box" + this.props.location.search
    if (e.key === 'Enter') {
      if (e.target.value && e.target.value != '' && e.target.value.length >= 3) {
        this.addToSearchHistory(e.target.value)
        e.target.blur()
        this.props.history.push('/search/' + e.target.value + "?pathBack=" + search)
        /* onEnter */
        let session = undefined
        let userLoginData = localStorage.getItem('userLoggedInKV')
        if (userLoginData) {
          userLoginData = JSON.parse(userLoginData).result.login
          session = userLoginData.session
        } else {
          this.props.history.push('/login')
        }
      this.props.actions.getSearchResult({session, refresh: true, keyword: e.target.value})
      } else {
        toast.error('Vui lòng nhập nhập 3 kí tự trở lên')
        return false
      }
    }
  }

  renderButton = (fontawesomeClass = 'fa fa-bell', path = '', badge = 0) => {
    return (
      <Link to={path}>
        <i
          className={fontawesomeClass + " header-button-icon"}
          aria-hidden="true"
        />
      </Link>
    )
  }

  renderCenteredLogo = () => {
    return (
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
    )
  }

  renderTitle = (title) => {
    return (
      <div className="title">
        {title}
      </div>
    )
  }

  clearInput = () => {
    let input = document.getElementById('search')
    if (input) {
      input.value = ''
      input.focus()
    }
  }
  renderSearchBoxInput = () => {
    let searchKey = this.props.location.pathname.split('/')[2]
    return (
      <div className="wrapper-header" style={{ zIndex: 2, backgroundColor: '#ffffff' }}>
        <div className="wrapper-header-icon">
          {this.renderIconLeft('#000000')}
        </div>
        <div className="wrapper-header-search-box">
          <i className="fa fa-search fa-search-custom" aria-hidden="true" />
          <form action="#" onSubmit={e => {
            e.preventDefault()
          }} autoComplete="off">
            <input type="search" style={{ fontSize: 'inherit' }}
                   defaultValue={searchKey}
                   placeholder="Nhập từ khóa tìm kiếm"
                   onKeyPress={this._handleSearchEnter}
                   name="search" id="search"/>
          </form>
          <i className="fa fa-times fa-times-custom fa-3x" aria-hidden="true" onClick={this.clearInput}/>
        </div>
      </div>
    )
  }

  renderNormal = () => {
    const namePath = _.get(this.props, 'path') || ''
    const objPathOnRouter = _.get(router, [namePath])
    let title = !_.isEmpty(objPathOnRouter)
      ? _.get(objPathOnRouter, 'title')
      : undefined
    let pathNameToCheck = this.props.location.pathname
    let hideSearch = pathNameToCheck.indexOf('/search') !== -1 || pathNameToCheck.indexOf('edit') !== -1 || pathNameToCheck.indexOf('convert') !== -1 || pathNameToCheck.indexOf('create') !== -1 || pathNameToCheck.indexOf('view') !== -1 || pathNameToCheck.indexOf('/opt-') !== -1
    return (
      <div className="wrapper-header" style={{ zIndex: 2 }}>
        <div className="wrapper-header-left">
          {this.renderIconLeft()}
        </div>
        <div className="wrapper-header-center">
          {title ? this.renderTitle(title) : this.renderCenteredLogo()}
        </div>
        <div className="wrapper-header-right">
          <div className="header-button-list">
            {hideSearch ? ('') : this.renderButton('fa fa-search', '/search-box?previousScreen=' + namePath)}
            {this.renderButton('fa fa-bell', '/notifications')}
          </div>
        </div>
      </div>
    )
  }
  render() {
    let isSearchResultScreen = this.props.location.pathname.indexOf('/search/') !== -1
    if (!isSearchResultScreen) return this.renderNormal()
    else return this.renderSearchBoxInput()
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
