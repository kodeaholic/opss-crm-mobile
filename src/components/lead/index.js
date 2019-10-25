import React, { Component } from 'react'
import { Link } from 'react-router-dom'


import './index.css'

import _ from 'lodash'
import moment from 'moment'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Button from '../commonComponents/button'

import { getListLead, getUserData } from '../../modules/userDuck'

const mapStateToProps = state => ({
  users: getUserData(state)
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
    this.props.actions.getListLead()
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
    const date = moment(item.date).format('DD-MM-YYYY hh:mm')
    return (
      <Link
        className="link-on-lead-list"
        key={key}
        to={'/customer-details/' + item.id}>
        <div className="wrapper-list-lead-item">
          <div className="wrapper-item-row">
            <label className="label-item-list lead-item-name big-size">
              {item.name}
            </label>
            <label className="label-item-list">{item.phone}</label>
          </div>
          <div className="wrapper-item-row">
            <label className="label-item-list">{date}</label>
            <label className="lead-item-status big-size label-item-list">
              {item.transactionType}
            </label>
          </div>
        </div>
      </Link>
    )
  }

  renderList = data => {
    return (
      <div className="wrapper-list-lead">
        {data
          ? _.map(data, (item, key) => {
              return this.renderItemList(item, key)
            })
          : null}
      </div>
    )
  }

  render() {
    const dataUsers = _.get(this.props, 'users') || {}
    return (
      <div className="wrapper-lead">
        {this.renderFilter()}
        {dataUsers ? this.renderList(dataUsers) : null}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lead)
