import React, { Component } from 'react'
// import Input from '../../commonComponents/input'

import './view.css'
import _ from 'lodash'

const tabs = ['DETAILS'/*, 'RELATED'*/]

class ContactView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'DETAILS'
    }
  }


  changeTab = tabName => {
    this.setState({ activeTab: tabName })
  }

  renderCustomerInfo = opportunityData => {
    return (
      <div>
        <div className="lead-view-container-info">
          <i className="fa fa-address-book-o icon-lead-view"
            aria-hidden="true"></i>
          <div className="lead-view-wrapper-info">
            <label className="lead-view-information-name">
              {opportunityData.potentialname}
            </label>
            <label className="lead-view-information-phone">
              {opportunityData.cf_mobile}
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

  renderDetails = opportunityData => {
    const leadName = _.get(opportunityData, 'potentialname')
    const leadStatus = _.get(opportunityData, 'sales_stage.label')
    const leadSource = _.get(opportunityData, 'leadsource.label')
    const leadWebsite = _.get(opportunityData, 'cf_pot_website')
    const leadPhone = _.get(opportunityData, 'cf_mobile')
    // const leadSecondaryPhone = _.get(opportunityData, 'phone')
    const leadIndustry = _.get(opportunityData, 'cf_pot_nganh_hang.label')
    const leadRegion = _.get(opportunityData, 'cf_pot_khu_vuc.label')
    const description = _.get(opportunityData, 'description')
    const assignedUser = _.get(opportunityData, 'assigned_user_id.label')
    return (
      <div className="lead-view-feild" val={leadName}>
        <Field label="Họ tên khách hàng" val={leadName} />
        <Field label="Tình trạng" val={leadStatus} />
        <Field label="Tên gian hàng" val={leadWebsite} />
        <Field label="Số điện thoại" val={leadPhone} phone/>
        {/*<Field label="Số điện thoại khác" val={leadSecondaryPhone} phone/>*/}
        <Field label="Ngành hàng" val={leadIndustry} />
        <Field label="Khu vực" val={leadRegion} />
        <Field label="Nguồn khách hàng" val={leadSource} />
        <Field label="Người xử lý" val={assignedUser} />
        <Field label="Mô tả chung" val={description} isMultiLine/>
      </div>
    )
  }

  renderRelated = () => {
    return (
      <div>
        <div className="lead-view-related-wrapper">
          <i
            className="fa fa-sticky-note-o lead-view-related-icon"
            aria-hidden="true"></i>
          <label className="lead-view-related-label">Ticket (3)</label>
        </div>
        <div className="lead-view-related-wrapper">
          <i
            className="fa fa-history lead-view-related-icon"
            aria-hidden="true"></i>
          <label className="lead-view-related-label">Activities (5)</label>
        </div>
        <div className="lead-view-related-wrapper">
          <i
            className="fa fa-tasks lead-view-related-icon"
            aria-hidden="true"></i>
          <label className="lead-view-related-label">Updates (6)</label>
        </div>
      </div>
    )
  }


  render() {
    if(_.isEmpty(this.props.data, true)) {
      return (<div className="lead-view-container"
                   style={{height: 'calc(100vh)', overflow: 'scroll', position: 'absolute', top: '0', width: '100%'}}><div className="loading-data">Permission Denied</div></div>)
    } else {
      return (
        <div className="lead-view-container"
             style={{height: 'calc(100vh)', overflow: 'scroll', position: 'absolute', top: '0', width: '100%'}}>
          {this.renderCustomerInfo(this.props.data)}
          {this.renderTabBelow()}
          {this.state.activeTab !== 'DETAILS'
            ? this.renderRelated({})
            : this.renderDetails(this.props.data)}
        </div>
      )
    }
  }
}

export default ContactView

/* Child component */
class Field extends Component {

  render() {
    const label = _.get(this.props, 'label') || 'noLabel'
    const isMultiLine = _.get(this.props, 'isMultiLine') || false
    const value = _.get(this.props, 'val') || ''
    const readOnly = _.get(this.props, 'isReadOnly') || true
    const phoneCard = _.get(this.props, 'phone') || false
    return (
      <div className="wrapper-field">
        <label className="label-field">
          {label}
        </label>
        {
          isMultiLine ? (<textarea
            className="input-field"
            rows="5"
            readOnly={readOnly}
            defaultValue={value}/>) : (!phoneCard ? (<p className="input-field">{value}</p>) : ( value? (<a className="phoneCard" href={'tel:' + value}><i className="fa fa-phone" aria-hidden="true"></i> {value}
          </a>) : (<p className="input-field">&nbsp;</p>)))
        }
      </div>
    )
  }
}
