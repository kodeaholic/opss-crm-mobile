import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getListContact,
  getContactsData,
  getContactsLoading,
  getContactsPageIndex,
  getContactsHasMoreData,
  getFilterStatus,
  fetchListContactElastic,
  getStatusOptions,
  getUsers,
  getFilterUser
} from '../../modules/contactsDuck'
// import {
//   getSessionStatus
// } from '../../modules/sessionDuck'
import { getUserLoggedIn, getSessionStatus } from '../../modules/loginDuck'
import axios from 'axios'
import { toast } from 'react-toastify'

/* Filter */
import ComboFilterSearch from '../commonComponents/filter-box/index'

/* List */
import List from '../commonComponents/list'
import '../commonComponents/list/index.css'
import ButtonAddNew from '../commonComponents/button/button-add-new'
import ScrollToTop from '../commonComponents/button/scroll-to-top'

const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  contacts: getContactsData(state),
  pageIndex: getContactsPageIndex(state),
  isLoading: getContactsLoading(state),
  hasMoreData: getContactsHasMoreData(state),
  expired: getSessionStatus(state),
  filterStatus: getFilterStatus(state),
  status: getStatusOptions(state),
  users: getUsers(state),
  filterUser: getFilterUser(state)
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
    this.onFilterStatusChange = this.onFilterStatusChange.bind(this)
    this.onFilterUserChange = this.onFilterUserChange.bind(this)
    this.refreshData = this.refreshData.bind(this)
    this.fetchMoreData = this.fetchMoreData.bind(this)
  }
  onFilterStatusChange(value) {
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
    let filterChanged = true
    let filterUser = this.props.filterUser
    this.props.actions.getListContact({ session, refresh, filterStatus, isLoading: true, filterChanged: filterChanged, filterUser })
  }
  onFilterUserChange(value) {
    let filterUser = value
    let refresh = true
    let session = this.props.userLoggedIn.session
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if(userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      }
    }
    let filterChanged = true
    let filterStatus = this.props.filterStatus
    this.props.actions.getListContact({ session, refresh, filterUser, isLoading: true, filterChanged: filterChanged, filterStatus })
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
    if (this.props.contacts.length === 0) {
      let refresh = true
      let filterStatus = this.props.filterStatus
      let filterUser = this.props.filterUser
      this.props.actions.getListContact({ session, refresh, filterStatus, filterUser, isLoading: true })
    }

    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior= 'contain'
  }

  componentWillUnmount() {
    document.body.style.overscrollBehavior= 'auto'
  }

  renderFilter = () => {
    let status = this.props.status
    let users = this.props.users
    let defaultOptions = {
      filterStatus: this.props.filterStatus,
      filterUser: this.props.filterUser
    }
    return (
      <ComboFilterSearch defaultOptions={defaultOptions} availableOptions={{status: status, users: users}} onChange={{onFilterStatusChange: this.onFilterStatusChange, onFilterUserChange: this.onFilterUserChange}} label="Lọc contacts"/>
    )
  }

  renderItemList = (item, key) => {
    if (item){
      const { assigned_user_id, cf_contact_website, cf_887, createdtime, lastname } = item
      const { label } = assigned_user_id
      return (
        <Link
          className="link-on-lead-list"
          key={key}
          to={'/contact-view/' + item.id}>
          <div className="wrapper-80vw-border">
            <div className="wrapper-list-item">
              <div className="wrapper-item-row">
                <label className="label-item-list item-name">{cf_contact_website}</label>
                <label className="label-item-list text-bold">{lastname}</label>
                <label className="label-item-list">{cf_887}</label>
              </div>
              <div className="wrapper-item-row">
                <label className="label-item-list text-grey">{label}</label>
                <label className="item-status label-item-list">
                  {createdtime}
                </label>
              </div>
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
    let filterStatus = this.props.filterStatus
    let filterUser = this.props.filterUser
    this.props.actions.getListContact({ session, refresh, filterStatus, filterUser })
  }

  fetchMoreData = () => {
    const { pageIndex, userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    let filterStatus = this.props.filterStatus
    let filterUser = this.props.filterUser
    this.props.actions.getListContact({ session, pageIndex, filterStatus, filterUser })
  }

  renderList = data => {
    const { hasMoreData } = this.props
    if(data.length === 0) {
      return (
        <div
          className="wrapper-list" style={{backgroundColor: 'transparent', boxShadow: 'none', justifyContent: 'center'}}>
          <p style={{flex: 1, margin: '15px auto 0 auto'}} id="empty-label">Empty</p>
        </div>
      )
    }
    return (
      <List hasMoreData={hasMoreData} refreshData={this.refreshData} fetchMoreData={this.fetchMoreData} data={data} isLoading={this.props.isLoading} renderItemList={this.renderItemList}/>
    )
  }

  renderButtonScrollToTop = () => {
    return (
      <ScrollToTop />
    )
  }

  render() {
    const dataContacts = _.get(this.props, 'contacts') || {}
    if(this.props.expired){
      localStorage.removeItem('userLoggedInKV')
      toast.error("Session expired", {
        autoClose: 1500,
        draggable: false,
      })
      return (
        <Redirect to={'/login'} />
      )
    } else if (this.props.isLoading){
      return (
        <div className="loading">Loading&#8230;</div>
      )
    }
    else
    return (
      <div className="wrapper-lead">
        {this.renderButtonScrollToTop()}
        {this.renderFilter()}
        {this.renderList(dataContacts)}
      </div>
    )
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
