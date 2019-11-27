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
  getFilterStatus,
  fetchListLeadElastic
} from '../../modules/leadsDuck'
import {
  getSessionStatus
} from '../../modules/sessionDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import InfiniteScroll from 'react-infinite-scroll-component'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import axios from 'axios'
const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  leads: getLeadsData(state),
  pageIndex: getLeadsPageIndex(state),
  isLoading: getLeadsLoading(state),
  hasMoreData: getLeadsHasMoreData(state),
  expired: getSessionStatus(state),
  filterStatus: getFilterStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getListLead,
      fetchListLeadElastic
    },
    dispatch
  )
})

class Lead extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.fetchLeadStatus = this.fetchLeadStatus.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
  }
  onFilterChange(value) {
    let filterStatus = value
    let refresh = true
    let session = this.props.userLoggedIn.session
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if(userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      }
    }
    this.props.actions.getListLead({ session, refresh, filterStatus })
    // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })

  }
  fetchLeadStatus = (inputValue) => {
    let session = this.props.userLoggedIn.session
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if(userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      }
    }

    const bodyFormData = new FormData()
    bodyFormData.append('_operation', 'fetchDataList')
    bodyFormData.append('_session', session)
    bodyFormData.append('source', 'leadstatus')
    bodyFormData.append('search', inputValue)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })

    return request
      .then(response => {
        const { success, result } = response.data
        if (success) {
          result.unshift({label: 'Tất cả', value: 'All'})
          return result
        }
        else {
          return []
        }
      })
      .catch(err => {
        return []
      })
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
    let filterStatus = this.props.filterStatus
    // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })
    this.props.actions.getListLead({ session, refresh, filterStatus })

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
          <div className="wrapper-filter-status">
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.filterStatus}
              loadOptions={this.fetchLeadStatus}
              placeholder="Tình trạng"
              onChange={this.onFilterChange}
              isSearchable={false}
            />
          </div>
        </div>
        <div className="filter-lead-result">
          <Button label="+ Thêm mới" path="/lead-create" />
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
                {createdtime}
              </label>
            </div>
          </div>
        </Link>
      )
    }
  }

  refreshData = () => {
    console.log("Refresh")
    const { userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    let refresh = true
    let filterStatus = this.props.filterStatus
    this.props.actions.getListLead({ session, refresh, filterStatus })
    // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })
  }

  fetchMoreData = () => {
    console.log("Loadmore")
    const { pageIndex, userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    let filterStatus = this.props.filterStatus
    this.props.actions.getListLead({ session, pageIndex, filterStatus })
    // this.props.actions.fetchListLeadElastic({ session, pageIndex, filterStatus })
  }

  renderLoading = () => {
    if (this.props.leads.length === 0) {
      return (
        <div className="wrapper-list-lead"
             style={{ height: '100%', overflow: 'auto', position: 'absolute', top: '50%', width: '100%', textAlign: "center", backgroundColor: 'transparent'}}>
          Not found
        </div>
      )
    }
    else return (
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
    if(dataLeads.length === 0 && !this.props.expired && this.props.isLoading) {
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
