import React, { Component } from 'react'
import { connect } from 'react-redux'
import faker from 'faker/locale/vi'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import { getLeadDetailsByID, getDetailsLead } from '../../modules/leadsDuck'
import { getUserLoggedIn } from '../../modules/loginDuck'
import Input from '../commonComponents/input'

import './index.css'

const tabs = ['DETAILS', 'RELATED']

const mapStateToProps = (state, ownProps) => ({
  leadDetails: getDetailsLead(state, ownProps),
  userLoggedIn: getUserLoggedIn(state)
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
      activedTab: 'DETAILS',
      details: {
        address: '54742 Steuber Falls',
        date: 'Fri Mar 13 2020 01:14:23 GMT+0700 (Giờ Đông Dương)',
        email: 'Casimer_Weissnat@yahoo.com',
        id: '12197',
        name: 'Bechtelar LLC',
        phone: '653.756.5788 x1657',
        transactionType: 'payment'
      }
    }
  }

  changeTab = tabName => {
    this.setState({ activedTab: tabName })
  }

  renderCustomerInfor = userDetails => {
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
              {userDetails.phone}
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
              item === this.state.activedTab ? 'tab tab-active' : 'tab'
            }
            onClick={() => this.changeTab(item)}>
            <label className="label-tab-name">{item}</label>
          </div>
        ))}
      </div>
    )
  }

  renderDetails = userDetails => {
    var randomCard = faker.helpers.createCard()
    const custName = _.get(randomCard, 'name') || ''
    const custStatus = _.get(randomCard, 'username') || {}
    const custCatchPhrase = _.get(randomCard, 'company.catchPhrase') || {}
    const custPhone = _.get(randomCard, 'phone') || {}
    const custPhone1 = _.get(randomCard, 'username') || {}
    const custIndustry = _.get(randomCard, 'website') || {}
    const custLocate = _.get(randomCard, 'address.city') || {}
    return (
      <div className="customer-details-feild" val={custName}>
        <Input label="Họ tên khách hàng" val={custName} readOnly />
        <Input label="Tình trạng" val={custStatus} readOnly />
        <Input label="So dien thoai" val={custPhone} readOnly />
        <Input label="So dien thoai khac" val={custPhone1} readOnly />
        <Input label="Nganh hang" val={custIndustry} readOnly />
        <Input label="Khu vuc" val={custLocate} readOnly />
        <Input label="Nguon khach hang" val={custCatchPhrase} readOnly />
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
    const { leadDetails, userLoggedIn } = this.props
    // console.log('thailog leadDetails', leadDetails)
    // console.log('thailog userLoggedIn', userLoggedIn)
    // const leadDetails = _.get(this.props, 'userDetails') || {}
    const userDetails = this.state.details
    // if (_.isEmpty(userDetails)) return null
    // console.log('thailog props', userDetails)
    return (
      <div className="customer-details-container">
        {this.renderCustomerInfor(userDetails)}
        {this.renderTabBelow()}
        {this.state.activedTab !== 'DETAILS'
          ? this.renderRelated(userDetails)
          : this.renderDetails(userDetails)}
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
