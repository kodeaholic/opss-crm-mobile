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
  getListLead,
  getLeadsData,
  getLeadsLoading,
  getLeadsPageIndex,
  getLeadsHasMoreData,
  getFilterStatus,
  fetchListLeadElastic,
  getFilters
} from '../../modules/leadsDuck'
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
  leads: getLeadsData(state),
  pageIndex: getLeadsPageIndex(state),
  isLoading: getLeadsLoading(state),
  hasMoreData: getLeadsHasMoreData(state),
  expired: getSessionStatus(state),
  filterStatus: getFilterStatus(state),
  filters: getFilters(state)
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
    this.refreshData = this.refreshData.bind(this)
    this.fetchMoreData = this.fetchMoreData.bind(this)
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
    let filterChanged = true
    this.props.actions.getListLead({ session, refresh, filterStatus, isLoading: true, filterChanged: filterChanged })
    // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })

  }
  fetchLeadStatus = (inputValue) => {
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
    if (this.props.leads.length === 0) {
      let refresh = true
      let filterStatus = this.props.filterStatus
      // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })
      this.props.actions.getListLead({ session, refresh, filterStatus, isLoading: true })
    }

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
      <ComboFilterSearch defaultValue={defaultValue} filters={filters} onChange={this.onFilterChange} isSearchable={false} placeholder="Tình trạng" label="Lọc theo leads"/>
    )
  }

  renderItemList = (item, key) => {
    if (item){
      const { assigned_user_id, website, mobile, leadstatus, createdtime, modifiedtime, lastname } = item
      const { label } = assigned_user_id
      return (
        <Link
          className="link-on-list"
          key={key}
          to={'/lead-view/' + item.id}>
          <div className="wrapper-80vw-border">
            <div className="wrapper-list-item">
              <div className="wrapper-item-row">
                <label className="label-item-list item-name">{lastname}</label>
                <label className="label-item-list">{website}</label>
                <label className="label-item-list">{leadstatus}</label>
              </div>
              <div className="wrapper-item-row">
                <label className="label-item-list text-bold">{label}</label>
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
    this.props.actions.getListLead({ session, refresh, filterStatus })
    // this.props.actions.getListLead({ session, refresh, filterStatus, isLoading: true })
    // this.props.actions.fetchListLeadElastic({ session, refresh, filterStatus })
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
    this.props.actions.getListLead({ session, pageIndex, filterStatus})
    // this.props.actions.fetchListLeadElastic({ session, pageIndex, filterStatus })
  }

  renderList = data => {
    const { hasMoreData } = this.props
    if(data.length === 0) {
      return (
        <div className="wrapper-list-lead"
             style={{ height: '100%', overflow: 'auto', position: 'absolute', top: '50%', width: '100%', textAlign: "center", backgroundColor: 'transparent'}}>
          &nbsp;
        </div>
      )
    }
    return (
      <List hasMoreData={hasMoreData} refreshData={this.refreshData} fetchMoreData={this.fetchMoreData} data={data} isLoading={this.props.isLoading} renderItemList={this.renderItemList}/>
    )
  }

  renderButtonAddNewLead = () => {
    return (
      <ButtonAddNew pathToGoTo="/lead-create"/>
    )
  }
  renderButtonScrollToTop = () => {
    return (
      <ScrollToTop />
    )
  }

  render() {
    const dataLeads = _.get(this.props, 'leads') || {}
    if(this.props.expired){
      localStorage.removeItem('userLoggedInKV')
      toast.error("Session expired", {
        autoClose: 1500,
        draggable: false,
      })
      return (
        <Redirect to={'/login'} />
      )
    } else if (this.props.isLoading) {
      return (
        <div className="loading">Loading&#8230;</div>
      )
    }
    else
    return (
      <div className="wrapper-lead">
        {this.renderButtonAddNewLead()}
        {this.renderButtonScrollToTop()}
        {this.renderFilter()}
        {this.renderList(dataLeads)}
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
)(Lead)
