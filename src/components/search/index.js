import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Button from '../commonComponents/button'
import {
  getSearchResult,
  getSRData,
  getSRLoading,
  getSRPageIndex,
  getSRHasMoreData,
  getKeyword,
} from '../../modules/searchDuck'
import {
  getSessionStatus
} from '../../modules/sessionDuck'
import {getUserLoggedIn} from '../../modules/loginDuck'
import InfiniteScroll from 'react-infinite-scroll-component'

const mapStateToProps = (state, ownProps) => ({
  userLoggedIn: getUserLoggedIn(state),
  listSR: getSRData(state),
  pageIndex: getSRPageIndex(state),
  isLoading: getSRLoading(state),
  hasMoreData: getSRHasMoreData(state),
  expired: getSessionStatus(state),
  keyword: getKeyword(state, ownProps),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getSearchResult,
    },
    dispatch
  )
})

class Lead extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    let {userLoggedIn, keyword} = this.props
    let {session} = userLoggedIn || {}
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if (userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      } else {
        this.props.history.push('/login')
      }
    }
    let refresh = true
    this.props.actions.getSearchResult({session, refresh, keyword})

    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior = 'contain'
  }

  componentWillReceiveProps(newProps) {
    if(newProps.keyword != this.props.keyword) {
      let {userLoggedIn, keyword} = newProps
      let {session} = userLoggedIn || {}
      if (!session) {
        let userLoginData = localStorage.getItem('userLoggedInKV')
        if (userLoginData) {
          userLoginData = JSON.parse(userLoginData).result.login
          session = userLoginData.session
        } else {
          this.props.history.push('/login')
        }
      }
      let refresh = true
      this.props.actions.getSearchResult({session, refresh, keyword})
    }
  }

  componentWillUnmount() {
    document.body.style.overscrollBehavior = 'auto'
  }

  renderFilter = () => {
    return (
      <div className="wrapper-filter-lead">
        <div className="filter-lead-option">
          <i
            className="fa fa-address-book-o filter-header-item-padding icon-filter-lead"
            aria-hidden="true"></i>
          <label className="label-filter-option filter-header-item-padding">
            Hen lien he sau
          </label>
          <i
            className="fa fa-caret-down filter-header-item-padding"
            aria-hidden="true"></i>
        </div>
        <div className="filter-lead-result">
          <Button label="+ Thêm mới" path="/add-new-customer"/>
        </div>
      </div>
    )
  }

  renderItemList = (item, key) => {
    item = item._source
    if (item) {
      const {label, s_website, s_mobile, status, createdtime} = item
      return (
        <Link
          className="link-on-lead-list"
          key={key}
          to={'/customer-details/' + item.id}>
          <div className="wrapper-list-lead-item">
            <div className="wrapper-item-row">
              <label className="label-item-list lead-item-name">{s_mobile}</label>
              <label className="label-item-list">{s_website}</label>
              <label className="label-item-list">{status}</label>
            </div>
            <div className="wrapper-item-row">
              <label className="label-item-list">{label}</label>
              <label className="lead-item-status label-item-list">
                {createdtime}
              </label>
            </div>
          </div>
        </Link>
      )
    }
  }

  refreshData = () => {
    const {userLoggedIn} = this.props
    let {session} = userLoggedIn
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    let refresh = true
    this.props.actions.getSearchResult({session, refresh})
  }

  fetchMoreData = () => {
    const {pageIndex, userLoggedIn} = this.props
    let {session} = userLoggedIn
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.props.actions.getSearchResult({session, pageIndex})
  }

  renderLoading = () => {
    return (
      <div className="loading-data">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
    )
  }

  renderList = data => {
    const {hasMoreData} = this.props
    return (
      <div
        className="wrapper-list-lead"
        id="scrollableDiv"
        style={{
          height: 'calc(100vh - 105px)',
          overflow: 'auto',
          position: 'absolute', /*top: '100px',*/
          width: '100%'
        }}>
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={this.fetchMoreData}
          hasMore={hasMoreData}
          loader={this.renderLoading()}
          scrollableTarget="scrollableDiv"
          refreshFunction={this.refreshData}
          pullDownToRefresh
          pullDownToRefreshContent={
            this.renderLoading()
          }
          releaseToRefreshContent={
            this.renderLoading()
          }>
          {data
            ? _.map(data, (item, key) => {
              return this.renderItemList(item, key)
            })
            : null}
        </InfiniteScroll>
      </div>
    )
  }

  render() {
    const dataLeads = _.get(this.props, 'listSR') || {}
    if (dataLeads.length === 0 && !this.props.expired) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"
               style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    } else if (this.props.expired) {
      document.body.style.overscrollBehavior = 'contain'
      localStorage.removeItem('userLoggedInKV')
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            Session is expired. Refresh the page to login
          </div>
        </div>
      )
    } else {
      return (
        <div className="wrapper-lead">
          {/*{this.renderFilter()}*/}
          {dataLeads ? this.renderList(dataLeads) : this.renderLoading()}
        </div>
      )
    }
  }
}

export default compose(
  withLayout(),
  withAuth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Lead)
