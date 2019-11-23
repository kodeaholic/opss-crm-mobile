import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Button from '../commonComponents/button'
import {
  getListLead,
  getLeadsData,
  getLeadsLoading,
  getLeadsPageIndex,
  getLeadsHasMoreData,
} from '../../modules/leadsDuck'
import {
  getSessionStatus
} from '../../modules/sessionDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import InfiniteScroll from 'react-infinite-scroll-component'
// import InfiniteScroll from 'react-infinite-scroller';
const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  leads: getLeadsData(state),
  pageIndex: getLeadsPageIndex(state),
  isLoading: getLeadsLoading(state),
  hasMoreData: getLeadsHasMoreData(state),
  expired: getSessionStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getListLead,
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
    let { userLoggedIn } = this.props
    let { session } = userLoggedIn || {}
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if(userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      }
      else {
        this.props.history.push('/login')
      }
    }
    let refresh = true
    this.props.actions.getListLead({ session, refresh })

    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior= 'contain'
  }

  componentWillUnmount() {
    document.body.style.overscrollBehavior= 'auto'
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
          <Button label="+ Thêm mới" path="/add-new-customer" />
        </div>
      </div>
    )
  }

  renderItemList = (item, key) => {
    if (item){
      const { assigned_user_id, website, mobile, leadstatus, createdtime, modifiedtime } = item
      const { label } = assigned_user_id
      return (
        <Link
          className="link-on-lead-list"
          key={key}
          to={'/lead-view/' + item.id}>
          <div className="wrapper-list-lead-item">
            <div className="wrapper-item-row">
              <label className="label-item-list lead-item-name">{mobile}</label>
              <label className="label-item-list">{website}</label>
              <label className="label-item-list">{leadstatus}</label>
            </div>
            <div className="wrapper-item-row">
              <label className="label-item-list">{label}</label>
              <label className="lead-item-status label-item-list">
                {modifiedtime}
              </label>
            </div>
          </div>
        </Link>
      )
    }
  }

  refreshData = () => {
    const { userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    let refresh = true
    this.props.actions.getListLead({ session, refresh })
  }

  fetchMoreData = () => {
    const { pageIndex, userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.props.actions.getListLead({ session, pageIndex })
  }

  renderLoading = () => {
    return (
      <div className="loading-data">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
    )
  }

  renderList = data => {
    const { hasMoreData } = this.props
    return (
      <div
        className="wrapper-list-lead"
        id="scrollableDiv"
        style={{ height: 'calc(100vh - 105px)', overflow: 'auto', position: 'absolute', top: '100px', width: '100%'}}>
        {/*<InfiniteScroll*/}
        {/*  pageStart={0}*/}
        {/*  hasMore={hasMoreData}*/}
        {/*  loadMore={this.fetchMoreData}*/}
        {/*  loader={this.renderLoading()}*/}
        {/*  useWindow={false}*/}
        {/*>*/}
        {/*  {data*/}
        {/*    ? _.map(data, (item, key) => {*/}
        {/*      return this.renderItemList(item, key)*/}
        {/*    })*/}
        {/*    : null}*/}
        {/*</InfiniteScroll>*/}
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
    const dataLeads = _.get(this.props, 'leads') || {}
    if(dataLeads.length === 0 && !this.props.expired) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    }
    else if(this.props.expired){
      document.body.style.overscrollBehavior= 'contain'
      localStorage.removeItem('userLoggedInKV')
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            Session is expired. Refresh the page to login
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="wrapper-lead">
          {this.renderFilter()}
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
