import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import './view.css'
import _ from 'lodash'
import DetailView from '../../commonComponents/detail-view'

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

  renderCustomerInfo = contactData => {
    return (
      <div>
        <div className="contact-view-container-info">
          <i className="fa fa-address-book-o icon-lead-view"
             aria-hidden="true"/>
          <div className="contact-view-wrapper-info">
            <label className="contact-view-information-name">
              {contactData.lastname}
            </label>
            <label className="contact-view-information-phone">
              {contactData.mobile}
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

  renderDetails = contactData => {
    const contactName = _.get(contactData, 'lastname')
    const contactStatus = _.get(contactData, 'cf_887.label')
    const leadSource = _.get(contactData, 'leadsource.label')
    const website = _.get(contactData, 'cf_contact_website')
    const phone = _.get(contactData, 'mobile')
    const secondaryPhone = _.get(contactData, 'phone')
    const industry = _.get(contactData, 'cf_contact_nganh_hang.label')
    const region = _.get(contactData, 'cf_contact_khu_vuc.label')
    const description = _.get(contactData, 'description')
    const assignedUser = _.get(contactData, 'assigned_user_id.label')
    const city = _.get(contactData, 'cf_city.value')
    const state = _.get(contactData, 'cf_state.value')
    const address = _.get(contactData, 'cf_contact_street')
    return (
      <div
        className="wrapper-view"
        id="scrollableView"
      >
        <InfiniteScroll
          dataLength={0} //This is important field to render the next data
          next={() => {
            return false
          }}
          hasMore={false}
          scrollableTarget="scrollableView"
          refreshFunction={() => {
            return false
          }}
          pullDownToRefresh
          pullDownToRefreshContent={
            ''
          }
          releaseToRefreshContent={
            ''
          }
        >
          {<div className="contact-view-field" val={contactName}>
            <Field label="Họ tên khách hàng" val={contactName}/>
            <Field label="Tình trạng" val={contactStatus}/>
            <Field label="Tên gian hàng" val={website}/>
            <Field label="Số điện thoại" val={phone} phone/>
            <Field label="Số điện thoại khác" val={secondaryPhone} phone/>
            <Field label="Ngành hàng" val={industry}/>
            <Field label="Khu vực" val={region}/>
            <Field label="Tỉnh/Thành phố" val={city}/>
            <Field label="Quận/Huyện" val={state}/>
            <Field label="Địa chỉ chi tiết" val={address}/>
            <Field label="Nguồn khách hàng" val={leadSource}/>
            <Field label="Người xử lý" val={assignedUser}/>
            {/*<Field label="Mô tả chung" val={description} isMultiLine/>*/}
            <div className="wrapper-field-description">
              <p><b className="label-description">
                Mô tả chung
              </b></p>
              <textarea
                className="description-field"
                rows="5"
                readOnly={true}
                defaultValue={description}/>
            </div>
          </div>
          }
        </InfiniteScroll>
      </div>
    )
  }

  renderRelated = () => {
    return (
      <div>
        <div className="contact-view-related-wrapper">
          <i
            className="fa fa-sticky-note-o lead-view-related-icon"
            aria-hidden="true"/>
          <label className="contact-view-related-label">Ticket (3)</label>
        </div>
        <div className="contact-view-related-wrapper">
          <i
            className="fa fa-history lead-view-related-icon"
            aria-hidden="true"/>
          <label className="contact-view-related-label">Activities (5)</label>
        </div>
        <div className="contact-view-related-wrapper">
          <i
            className="fa fa-tasks lead-view-related-icon"
            aria-hidden="true"/>
          <label className="contact-view-related-label">Updates (6)</label>
        </div>
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.data, true)) {
      return (<div className="contact-view-container"
                   style={{ height: 'calc(100vh)', overflow: 'scroll', position: 'absolute', top: '0', width: '100%' }}>
        <div className="loading-data">Permission Denied</div>
      </div>)
    } else {
      return (
        <DetailView data={{data: this.props.data, setype: 'contact'}}/>
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
            defaultValue={value}/>) : (!phoneCard ? (!_.isEmpty(value) ? (<p className="input-field">{value}</p>) : (<p className="input-field">&nbsp;</p>)) : ( value? (<a className="phoneCard" href={'tel:' + value}><i className="fa fa-phone" aria-hidden="true"/> {value}
          </a>) : (<p className="input-field">&nbsp;</p>)))
        }
      </div>
    )
  }
}
