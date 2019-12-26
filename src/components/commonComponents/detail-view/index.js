import React, { Component } from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import './index.css'
import _ from 'lodash'

class DetailView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'details'
    }
  }

  changeTab = (e) => {
    this.setState({activeTab: e.target.id})
  }
  renderDetails = (data) => {
    return (
      <DetailsCard data={data} />
    )
  }
  renderRelated = (data) => {
    return (
      <RelatedCard data={data}/>
    )
  }
  render() {
    let activeTab = this.state.activeTab
    let data = this.props.data
    return (
      <div className="wrapper-detail-view">
        <div className="extended-header-detail-view">
        </div>
        <div className="tabs">
          <div className={activeTab === 'details' ? 'tab-item' : 'tab-item inactive'} id="details" key="details" onClick={this.changeTab}>
            Details
          </div>
          <div className={activeTab === 'related' ? 'tab-item' : 'tab-item inactive'} id="related" key="related" onClick={this.changeTab}>
            Related
          </div>
        </div>
        <div className="content">
          { activeTab === 'details' && this.renderDetails(data)}
          { activeTab === 'related' && this.renderRelated(data)}
        </div>
      </div>
    )
  }
}

export default DetailView

class DetailsCard extends Component {

  render() {
    let data = this.props.data.data
    let setype = this.props.data.setype
    if (setype === 'lead') {
      let status = data.leadstatus
      status = status ? _.get(status, 'label') || '' : ''

      let industry = data.industry
      industry = industry ? _.get(industry, 'label') || '' : ''

      let cf_lead_khu_vuc = data.cf_lead_khu_vuc
      cf_lead_khu_vuc = cf_lead_khu_vuc ? _.get(cf_lead_khu_vuc, 'label') || '' : ''
      let city = data.city
      city = city ? _.get(city, 'label') || '' : ''
      let state = data.state
      state = state ? _.get(state, 'label') || '' : ''
      let leadsource = data.leadsource
      leadsource = leadsource ? _.get(leadsource, 'label') || '' : ''
      let assigned_user_id = data.assigned_user_id
      assigned_user_id = assigned_user_id ? _.get(assigned_user_id, 'label') || '' : ''
      return (
        <div className="detail-card">
          <DetailRow label="Họ và tên khách hàng" value={data.lastname}/>
          <DetailRow label="Tình trạng" value={status}/>
          <DetailRow label="Tên gian hàng" value={data.website}/>
          <DetailRow label="Số điện thoại" value={data.mobile} phone={true}/>
          <DetailRow label="Số điện thoại khác" value={data.phone} phone={true}/>
          <DetailRow label="Ngành hàng" value={industry}/>
          <DetailRow label="Khu vực" value={cf_lead_khu_vuc}/>
          <DetailRow label="Tỉnh/ Thành phố" value={city}/>
          <DetailRow label="Quận/ Huyện" value={state}/>
          <DetailRow label="Địa chỉ chi tiết" value={data.lane}/>
          <DetailRow label="Nguồn khách hàng" value={leadsource}/>
          <DetailRow label="Người xử lý" value={assigned_user_id}/>
          <DetailRow label="Mô tả chung" value={data.description} isLongText={data.description && data.description.length > 10}/>
        </div>
      )
    }
    if (setype === 'contact') {
      let status = data.cf_887
      status = status ? _.get(status, 'label') || '' : ''
      let cf_contact_nganh_hang = data.cf_contact_nganh_hang
      cf_contact_nganh_hang = cf_contact_nganh_hang ? _.get(cf_contact_nganh_hang, 'label') || '' : ''
      let cf_contact_khu_vuc = data.cf_contact_khu_vuc
      cf_contact_khu_vuc = cf_contact_khu_vuc ? _.get(cf_contact_khu_vuc, 'label') || '' : ''
      let cf_city = data.cf_city
      cf_city = cf_city ? _.get(cf_city, 'label') || '' : ''
      let cf_state = data.cf_state
      cf_state = cf_state ? _.get(cf_state, 'label') || '' : ''
      let leadsource = data.leadsource
      leadsource = leadsource ? _.get(leadsource, 'label') || '' : ''
      let assigned_user_id = data.assigned_user_id
      assigned_user_id = assigned_user_id ? _.get(assigned_user_id, 'label') || '' : ''
      return (
        <div className="detail-card">
          <DetailRow label="Họ và tên khách hàng" value={data.lastname}/>
          <DetailRow label="Tình trạng" value={status}/>
          <DetailRow label="Tên gian hàng" value={data.cf_contact_website}/>
          <DetailRow label="Số điện thoại" value={data.mobile} phone={true}/>
          <DetailRow label="Số điện thoại khác" value={data.phone} phone={true}/>
          <DetailRow label="Ngành hàng" value={cf_contact_nganh_hang}/>
          <DetailRow label="Khu vực" value={cf_contact_khu_vuc}/>
          <DetailRow label="Tỉnh/ Thành phố" value={cf_city}/>
          <DetailRow label="Quận/ Huyện" value={cf_state}/>
          <DetailRow label="Địa chỉ chi tiết" value={data.cf_contact_street}/>
          <DetailRow label="Nguồn khách hàng" value={leadsource}/>
          <DetailRow label="Người xử lý" value={assigned_user_id}/>
          <DetailRow label="Mô tả chung" value={data.description} isLongText={data.description && data.description.length > 10}/>
        </div>
      )
    }
    if (setype === 'opportunity'){
      let sales_stage = data.sales_stage
      sales_stage = sales_stage ? _.get(sales_stage, 'label') || '' : ''
      let cf_pot_nganh_hang = data.cf_pot_nganh_hang
      cf_pot_nganh_hang = cf_pot_nganh_hang ? _.get(cf_pot_nganh_hang, 'label') || '' : ''
      let cf_pot_khu_vuc = data.cf_pot_khu_vuc
      cf_pot_khu_vuc = cf_pot_khu_vuc ? _.get(cf_pot_khu_vuc, 'label') || '' : ''
      let leadsource = data.leadsource
      leadsource = leadsource ? _.get(leadsource, 'label') || '' : ''
      let assigned_user_id = data.assigned_user_id
      assigned_user_id = assigned_user_id ? _.get(assigned_user_id, 'label') || '' : ''
      return (
        <div className="detail-card">
          <DetailRow label="Họ và tên khách hàng" value={data.potentialname}/>
          <DetailRow label="Tình trạng" value={sales_stage}/>
          <DetailRow label="Tên gian hàng" value={data.cf_pot_website}/>
          <DetailRow label="Số điện thoại" value={data.cf_mobile} phone={true}/>
          <DetailRow label="Ngành hàng" value={cf_pot_nganh_hang}/>
          <DetailRow label="Khu vực" value={cf_pot_khu_vuc}/>
          <DetailRow label="Nguồn khách hàng" value={leadsource}/>
          <DetailRow label="Người xử lý" value={assigned_user_id}/>
          <DetailRow label="Mô tả chung" value={data.description} isLongText={data.description && data.description.length > 10}/>
        </div>
      )
    }
    return (
      <div>Default</div>
    )
  }
}
class RelatedCard extends Component {
  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        {/*<div className="rainbow" style={{textAlign: 'center', marginTop: '50%', fontSize: '16px'}}>*/}
        {/*  Tính năng đang trong quá trình phát triển*/}
        {/*</div>*/}
        <iframe src="/coming-soon-no-footer" frameBorder="0" title="Coming soon" width='100%' height="100%" style={{border: 'none'}}/>
      </div>
    )
  }
}

class DetailRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }
  renderValue = (props) => {
    let phone = props.phone
    let value = props.value
    let isLongText = props.isLongText
    if (phone && value) {
      return (
        <a className="detail-row-phone-card" href={'tel:' + value}><i className="fa fa-phone" aria-hidden="true"/> {value}</a>
      )
    }
    // if (isLongText) {
    //   return (
    //     <p style={{height: '30px'}}>
    //       <OverlayTrigger trigger="click" placement="top" overlay={<Tooltip id="tooltip">
    //         {value}
    //       </Tooltip>}>
    //         <button className="btn-show-tooltip"
    //                 style={{
    //                   cursor: 'default',
    //                   border: 'none',
    //                 }}
    //         >
    //           Chạm để xem
    //         </button>
    //       </OverlayTrigger>
    //     </p>
    //   )
    // }
    return (
      value
    )
  }
  render() {
    let label = this.props.label
    let value = this.props.value
    let isLongText = this.props.isLongText
    if(!isLongText) {
      return (
        <div className="detail-row">
          <div className="detail-label">
            {label}
          </div>
          <div className="detail-value" style={isLongText ? {textAlign: 'left'} : {}}>
            {this.renderValue(this.props)}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="detail-row-long-text">
          <div className="detail-label-long-text">
            {label}
          </div>
          <div className="detail-value-long-text">
            <textarea
              readOnly={true}
              className="detail-text-area"
              rows="5" defaultValue={value}/>
          </div>
        </div>
      )
    }
  }
}