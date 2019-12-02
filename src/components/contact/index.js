import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import Button from '../commonComponents/button'
import {
  getListContact,
  getContactsData,
  getContactsLoading,
  getContactsPageIndex,
  getContactsHasMoreData,
  getFilterStatus,
  fetchListContactElastic,
  getFilters
} from '../../modules/contactsDuck'
// import {
//   getSessionStatus
// } from '../../modules/sessionDuck'
import { getUserLoggedIn, getSessionStatus } from '../../modules/loginDuck'
import InfiniteScroll from 'react-infinite-scroll-component'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import axios from 'axios'
import { toast } from 'react-toastify'
import Select from 'react-select'
const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  leads: getContactsData(state),
  pageIndex: getContactsPageIndex(state),
  isLoading: getContactsLoading(state),
  hasMoreData: getContactsHasMoreData(state),
  expired: getSessionStatus(state),
  filterStatus: getFilterStatus(state),
  filters: getFilters(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getListContact,
      fetchListContactElastic
    },
    dispatch
  )
})

class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
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
    this.props.actions.getListContact({ session, refresh, filterStatus, isLoading: true })
    // this.props.actions.fetchListContactElastic({ session, refresh, filterStatus })

  }
  fetchContactStatus = (inputValue) => {
    let session = this.props.userLoggedIn ? this.props.userLoggedIn.session : undefined
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
    bodyFormData.append('source', 'contactstatus')
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
    // this.props.actions.fetchListContactElastic({ session, refresh, filterStatus })
    this.props.actions.getListContact({ session, refresh, filterStatus, isLoading: true })

    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior= 'contain'
  }

  componentWillUnmount() {
    document.body.style.overscrollBehavior= 'auto'
  }

  renderFilter = () => {
    let filters = this.props.filters
    let defaultValue = this.props.filterStatus
    return (
      <div className="wrapper-filter-lead">
        <div className="filter-lead-option">
          <i
            className="fa fa-address-book-o filter-header-item-padding icon-filter-lead"
            aria-hidden="true"></i>
          <div className="wrapper-filter-status">
            {/*<AsyncSelect*/}
            {/*  cacheOptions*/}
            {/*  defaultOptions*/}
            {/*  defaultValue={this.props.filterStatus}*/}
            {/*  loadOptions={this.fetchContactStatus}*/}
            {/*  placeholder="Tình trạng"*/}
            {/*  onChange={this.onFilterChange}*/}
            {/*  isSearchable={false}*/}
            {/*/>*/}
            <Select
              value={defaultValue}
              options={filters}
              placeholder="Tình trạng"
              onChange={this.onFilterChange}
              isSearchable={false}
            />
          </div>
        </div>
        {/*<div className="filter-lead-result">
          <Button label="+ Thêm mới" path="/lead-create" />
        </div>*/}
      </div>
    )
  }

  renderItemList = (item, key) => {
    if (item){
      const { assigned_user_id, cf_contact_website, cf_887, createdtime } = item
      const { label } = assigned_user_id
      return (
        <Link
          className="link-on-lead-list"
          key={key}
          to={'/contact-view/' + item.id}>
          <div className="wrapper-list-lead-item">
            <div className="wrapper-item-row">
              <label className="label-item-list lead-item-name">{cf_contact_website}</label>
              <label className="label-item-list">{cf_887}</label>
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
    this.props.actions.getListContact({ session, refresh, filterStatus })
    // this.props.actions.fetchListContactElastic({ session, refresh, filterStatus })
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
    this.props.actions.getListContact({ session, pageIndex, filterStatus })
    // this.props.actions.fetchListContactElastic({ session, pageIndex, filterStatus })
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
    if(data.length === 0) {
      return (
        <div className="wrapper-list-lead"
             style={{ height: '100%', overflow: 'auto', position: 'absolute', top: '50%', width: '100%', textAlign: "center", backgroundColor: 'transparent'}}>
          Empty
        </div>
      )
    }
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
    const dataContacts = _.get(this.props, 'leads') || {}
    if(!this.props.expired && this.props.isLoading) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    }
    else if(this.props.expired){
      localStorage.removeItem('userLoggedInKV')
      toast.error("Session expired", {
        autoClose: 1500,
        draggable: false,
      })
      return (
        <Redirect to={'/login'} />
      )
    }
    else if (!this.props.isLoading){
      return (
        <div className="wrapper-lead">
          {this.renderFilter()}
          {this.renderList(dataContacts)}
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
)(Contact)
