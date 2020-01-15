import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

/* Child component */
import ListCard from './card'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getSearchResult,
  getSRData,
  getSRLoading,
  getSRPageIndex,
  getSRHasMoreData,
  getKeyword
} from '../../modules/searchDuck'
import {
  getSessionStatus
} from '../../modules/loginDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import { toast } from 'react-toastify'

const mapStateToProps = (state, ownProps) => ({
  userLoggedIn: getUserLoggedIn(state),
  listSR: getSRData(state),
  pageIndex: getSRPageIndex(state),
  isLoading: getSRLoading(state),
  hasMoreData: getSRHasMoreData(state),
  expired: getSessionStatus(state),
  keyword: getKeyword(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getSearchResult
    },
    dispatch
  )
})

class Lead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sectionTitle: ''
    }
  }

  componentWillMount() {
    let { userLoggedIn, keyword } = this.props
    let { session } = userLoggedIn || {}
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
    this.props.actions.getSearchResult({ session, refresh, keyword })

    /* Prevent browser's default pull to refresh behavior */
    document.body.style.overscrollBehavior = 'contain'
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.keyword !== this.props.keyword || localStorage.getItem('searchResultsChanged')) {
  //     let { userLoggedIn, keyword } = newProps
  //     let { session } = userLoggedIn || {}
  //     if (!session) {
  //       let userLoginData = localStorage.getItem('userLoggedInKV')
  //       if (userLoginData) {
  //         userLoginData = JSON.parse(userLoginData).result.login
  //         session = userLoginData.session
  //       } else {
  //         this.props.history.push('/login')
  //       }
  //     }
  //     let refresh = true
  //     localStorage.removeItem('searchResultsChanged')
  //     this.props.actions.getSearchResult({ session, refresh, keyword })
  //   }
  // }

  componentWillUnmount() {
    document.body.style.overscrollBehavior = 'auto'
  }

  renderItemList = (item, key) => {
    let basePath = this.props.location.pathname
    basePath = basePath.substring(basePath.indexOf('/') + 1)
    let pathBack = basePath + this.props.location.search
    // item = item._source
    if (item) {
      // const { label, s_website, crmid, status, _createdtime, sales_user, assign_to, setype } = item
      const { label, s_website, crmid, s_status, createdtime, sales_user, assign_to, setype } = item
      let setypeLabel = setype
      let to_url = '/lead-view/10x' + crmid + '?pathBack=' + pathBack
      if (setype === 'Contacts') {
        to_url = '/contact-view/12x' + crmid + '?pathBack=' + pathBack
      } else if (setype === 'Potentials') {
        to_url = '/opportunity-view/13x' + crmid + '?pathBack=' + pathBack
        setypeLabel = 'Opportunities'
      }
      return (
        <Link
          className="link-on-list"
          key={key}
          to={to_url}>
          <div className="wrapper-search-list-item">
            <div className="wrapper-item-row">
              <label className="label-item-list item-name">{label}</label>
              <label className="label-item-list" style={{fontWeight: 'bold'}}>{s_website}</label>
              <label className="label-item-list">{s_status}</label>
            </div>
            <div className="wrapper-item-row">
              <label className="label-item-list">{assign_to}</label>
              <label className="label-item-list closedwon-sale">{sales_user}</label>
              <label className="lead-item-status label-item-list">
                {createdtime}
              </label>
            </div>
          </div>
        </Link>
      )
    }
  }

  renderLoading = () => {
    return (
      <div className="loading-data">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{backgroundColor: '#ffffff'}}/>
      </div>
    )
  }

  renderResult = data => {
    let leads = data.filter((map) => map._index === 'leadcrm')
    let contacts = data.filter((map) => map._index === 'contactcrm')
    let opportunities = data.filter((map) => map._index === 'potentialcrm')
    return (
      <div className="cards-wrapper">
        {leads.length > 0 && <ListCard data={leads} functionRenderItem={this.renderItemList} name="leads"/>}
        {contacts.length > 0 && <ListCard data={contacts} functionRenderItem={this.renderItemList} name="contacts"/>}
        {opportunities.length > 0 && <ListCard data={opportunities} functionRenderItem={this.renderItemList} name="opportunities"/>}
      </div>
    )
  }

  renderFilter = (data) => {
    let leads = data.filter((map) => map._index === 'leadcrm')
    let contacts = data.filter((map) => map._index === 'contactcrm')
    let opportunities = data.filter((map) => map._index === 'potentialcrm')
    let changeTab = (e) => {
      // active button
      let currentActiveElement = document.getElementsByClassName("filter-search-button active")[0]
      currentActiveElement.classList.remove("active")
      e.target.classList.add("active")
      // hide cards
      const cards = ["leads", "contacts", "opportunities"]
      let id = e.target.id.split('btn-filter-')[1]
      if (id === 'all') {
        cards.forEach((item, index) => {
          let div = document.getElementById('card-wrapper-' + item)
          if (div) div.style.display = 'block'
        })
      }
      else {
        cards.forEach((item, index) => {
          if (item === id) {
            let div = document.getElementById('card-wrapper-' + item)
            if (div) div.style.display = 'block'
          }
          else {
            let div = document.getElementById('card-wrapper-' + item)
            if (div) div.style.display = 'none'
          }
        })
      }
      let div = document.getElementsByClassName('wrapper-search-result')[0]
      if (div) div.scrollIntoView({ block: 'start'}) // to TOP
    }
    return (
      <div className="filter-search-result-wrapper" style={{ display: data.length > 0 ? '' : 'none' }}>
        <div className="filter-search-button-list">
          {data.length > 0 && (<div className="filter-search-button active" id="btn-filter-all" onClick={changeTab}>
            Tất cả
          </div>)}
          {leads.length > 0 && (<div className="filter-search-button" id="btn-filter-leads" onClick={changeTab}>
            Leads
          </div>)}
          {contacts.length > 0 && (<div className="filter-search-button" id="btn-filter-contacts" onClick={changeTab}>
            Contacts
          </div>)}
          {opportunities.length > 0 && (<div className="filter-search-button" id="btn-filter-opportunities" onClick={changeTab}>
            Opportunities
          </div>)}
        </div>
      </div>
    )
  }

  render() {
    if (this.props.expired) {
      localStorage.removeItem('userLoggedInKV')
      toast.error('Session expired', {
        autoClose: 1500,
        draggable: false
      })
      return (
        <Redirect to={'/login'}/>
      )
    } else {
      if (this.props.isLoading) {
        return (
          <div className="wrapper-search-container">
            <div className="loading-data">
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"
                 style={{ position: 'fixed', top: 'calc(50vh - 50.25px)' }}/>
            </div>
          </div>
        )
      } else {
        const dataList = _.get(this.props, 'listSR') || []
        if (dataList.length === 0) {
          return (
            <div className="wrapper-search-result">
              <div className="loading-data">
                Search not found
              </div>
            </div>
          )
        } else {
          return (
            <>
              {this.renderFilter(dataList)}
              <div className="wrapper-search-result">
                {dataList ? this.renderResult(dataList) : this.renderLoading()}
              </div>
            </>
          )
        }
      }
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
