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
  getLeadsHasMoreData
} from '../../modules/leadsDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import InfiniteScroll from 'react-infinite-scroll-component'

const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  leads: getLeadsData(state),
  pageIndex: getLeadsPageIndex(state),
  isLoading: getLeadsLoading(state),
  hasMoreData: getLeadsHasMoreData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getListLead
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
    const session = '381c27de5db93c66c6461'
    this.props.actions.getListLead({ session })
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
    const { assigned_user_id, website, mobile, leadstatus, createdtime } = item
    const { label } = assigned_user_id
    return (
      <Link
        className="link-on-lead-list"
        key={key}
        to={'/customer-details/' + item.id}>
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

  fetchMoreData = () => {
    const session = '381c27de5db93c66c6461'
    const { pageIndex } = this.props
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
      <div className="wrapper-list-lead">
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={this.fetchMoreData}
          hasMore={hasMoreData}
          loader={this.renderLoading()}>
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
    return (
      <div className="wrapper-lead">
        {this.renderFilter()}
        {dataLeads ? this.renderList(dataLeads) : this.renderLoading()}
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
