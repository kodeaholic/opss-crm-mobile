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

import Button from '../commonComponents/button'
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
import InfiniteScroll from 'react-infinite-scroll-component'
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

    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior = 'contain'
  }

  componentWillReceiveProps(newProps) {
    if (newProps.keyword !== this.props.keyword) {
      let { userLoggedIn, keyword } = newProps
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
    }
  }

  componentWillUnmount() {
    document.body.style.overscrollBehavior = 'auto'
  }

  renderItemList = (item, key) => {
    let basePath = this.props.location.pathname
    basePath = basePath.substring(basePath.indexOf('/') + 1)
    let pathBack = basePath + this.props.location.search
    item = item._source
    if (item) {
      const { label, s_website, crmid, status, _createdtime, sales_user, asssignto, setype } = item
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
              <label className="label-item-list">{s_website}</label>
              <label className="label-item-list">{status}</label>
            </div>
            <div className="wrapper-item-row">
              <label className="label-item-list">{asssignto}</label>
              <label className="label-item-list closedwon-sale">{sales_user}</label>
              <label className="lead-item-status label-item-list">
                {_createdtime}
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
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
      </div>
    )
  }

  renderResult = data => {
    let leads = data.filter((map) => map._index === 'leadcrm')
    let contacts = data.filter((map) => map._index === 'contactcrm')
    let opportunities = data.filter((map) => map._index === 'potentialcrm')
    return (
      <div className="cards-wrapper">
        <ListCard data={leads} functionRenderItem={this.renderItemList} name="Leads"/>
        <ListCard data={contacts} functionRenderItem={this.renderItemList} name="Contacts"/>
        <ListCard data={opportunities} functionRenderItem={this.renderItemList} name="Opportunities"/>
      </div>
    )
  }

  render() {
    const dataList = _.get(this.props, 'listSR') || []
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
            <div className="wrapper-search-result">
              {dataList ? this.renderResult(dataList) : this.renderLoading()}
            </div>
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
