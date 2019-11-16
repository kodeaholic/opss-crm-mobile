import React, { Component } from 'react'
import { connect } from 'react-redux'
import faker from 'faker/locale/vi'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import { getLeadDetailsByID, getDetailsLead, getSelectedLeadId } from '../../modules/leadsDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import Input from '../commonComponents/input'

import './index.css'

const tabs = ['DETAILS', 'RELATED']

const mapStateToProps = (state, ownProps) => ({
  leadDetails: getDetailsLead(state, ownProps),
  userLoggedIn: getUserLoggedIn(state),
  selectedLeadId: getSelectedLeadId(state, ownProps),
  isLoadingDetail: state => state.leads.isLoadingDetail
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getLeadDetailsByID
    },
    dispatch
  )
})

class CustomerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'DETAILS',
      details: {
        name: '',
        status: '',
        website: '',
        phone: '',
        secondaryPhone: '',
        industry: '',
        region: '',
        leadSource: '',
        assignedUser: '',
        generalDescription: ''
      }
    }
  }

  componentWillMount() {
    const { userLoggedIn, selectedLeadId } = this.props
    const record = selectedLeadId
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.props.actions.getLeadDetailsByID({ session, record })
  }

  changeTab = tabName => {
    this.setState({ activeTab: tabName })
  }

  renderCustomerInfo = userDetails => {
    return (
      <div>
        <div className="customer-details-container-infor">
          <i
            className="fa fa-address-book-o icon-customer-details"
            aria-hidden="true"></i>
          <div className="customer-details-wrapper-infor">
            <label className="customer-details-informations-name">
              {userDetails.name}
            </label>
            <label className="customer-details-informations-phone">
              {userDetails.secondaryPhone}
            </label>
          </div>
        </div>
      </div>
    )
  }

  renderTabBelow = () => {
    return (
      <div className="tabs">
        {_.map(tabs, (item, key) => (
          <div
            key={key}
            id={item}
            className={
              item === this.state.activeTab ? 'tab tab-active' : 'tab'
            }
            onClick={() => this.changeTab(item)}>
            <label className="label-tab-name">{item}</label>
          </div>
        ))}
      </div>
    )
  }

  renderDetails = userDetails => {
    const leadName = _.get(userDetails, 'name')
    const leadStatus = _.get(userDetails, 'status')
    const leadSource = _.get(userDetails, 'leadSource')
    const leadWebsite = _.get(userDetails, 'website')
    const leadPhone = _.get(userDetails, 'phone')
    const leadSecondaryPhone = _.get(userDetails, 'secondaryPhone')
    const leadIndustry = _.get(userDetails, 'industry')
    const leadRegion = _.get(userDetails, 'region')
    const description = _.get(userDetails, 'generalDescription')
    const assignedUser = _.get(userDetails, 'assignedUser')
    return (
      <div className="customer-details-feild" val={leadName}>
        <Input label="Họ tên khách hàng" val={leadName} readOnly />
        <Input label="Tình trạng" val={leadStatus} readOnly />
        <Input label="Tên gian hàng" val={leadWebsite} readOnly />
        <Input label="Số điện thoại" val={leadSecondaryPhone} readOnly />
        <Input label="Số điện thoại khác" val={leadPhone} readOnly />
        <Input label="Ngành hàng" val={leadIndustry} readOnly />
        <Input label="Khu vực" val={leadRegion} readOnly />
        <Input label="Nguồn khách hàng" val={leadSource} readOnly />
        <Input label="Người xử lý" val={assignedUser} readOnly />
        <Input label="Mô tả chung" val={description} readOnly />
      </div>
    )
  }

  renderRelated = () => {
    return (
      <div>
        <div className="cust-details-related-wrapper">
          <i
            className="fa fa-sticky-note-o cust-details-related-icon"
            aria-hidden="true"></i>
          <label className="cust-details-related-label">Ticket (3)</label>
        </div>
        <div className="cust-details-related-wrapper">
          <i
            className="fa fa-history cust-details-related-icon"
            aria-hidden="true"></i>
          <label className="cust-details-related-label">Activities (5)</label>
        </div>
        <div className="cust-details-related-wrapper">
          <i
            className="fa fa-tasks cust-details-related-icon"
            aria-hidden="true"></i>
          <label className="cust-details-related-label">Updates (6)</label>
        </div>
      </div>
    )
  }

  render() {
    const { leadDetails } = this.props
    if(this.state.isLoadingDetail) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    }
    else
    return (
      <div className="customer-details-container" style={{ height: 'calc(100vh)', overflow: 'auto', position: 'absolute', top: '0', width: '100%'}}>
        {this.renderCustomerInfo(leadDetails)}
        {this.renderTabBelow()}
        {this.state.activeTab !== 'DETAILS'
          ? this.renderRelated({})
          : this.renderDetails(leadDetails)}
      </div>
    )
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails)
export default compose(
  withLayout(),
  withAuth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CustomerDetails)
