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
      return (
        <div className="detail-card">
          <DetailRow label="Họ và tên khách hàng" value={data.lastname}/>
          <DetailRow label="Tình trạng" value={data.leadstatus.label}/>
          <DetailRow label="Tên gian hàng" value={data.website}/>
          <DetailRow label="Số điện thoại" value={data.mobile} phone={true}/>
          <DetailRow label="Số điện thoại khác" value={data.phone} phone={true}/>
          <DetailRow label="Ngành hàng" value={data.industry.label}/>
          <DetailRow label="Khu vực" value={data.cf_lead_khu_vuc.label}/>
          <DetailRow label="Tỉnh/ Thành phố" value={data.city.label}/>
          <DetailRow label="Quận/ Huyện" value={data.state.label}/>
          <DetailRow label="Địa chỉ chi tiết" value={data.lane}/>
          <DetailRow label="Nguồn khách hàng" value={data.leadsource.label}/>
          <DetailRow label="Người xử lý" value={data.assigned_user_id.label}/>
          <DetailRow label="Mô tả chung" value={data.description} isLongText={data.description && data.description.length > 10}/>
        </div>
      )
    }
    if (setype === 'contact') {
      return (
        <div className="detail-card">
          <DetailRow label="Họ và tên khách hàng" value={data.lastname}/>
          <DetailRow label="Tình trạng" value={data.cf_887.label}/>
          <DetailRow label="Tên gian hàng" value={data.cf_contact_website}/>
          <DetailRow label="Số điện thoại" value={data.mobile} phone={true}/>
          <DetailRow label="Số điện thoại khác" value={data.phone} phone={true}/>
          <DetailRow label="Ngành hàng" value={data.cf_contact_nganh_hang.label}/>
          <DetailRow label="Khu vực" value={data.cf_contact_khu_vuc.label}/>
          <DetailRow label="Tỉnh/ Thành phố" value={data.cf_city.value}/>
          <DetailRow label="Quận/ Huyện" value={data.cf_state.value}/>
          <DetailRow label="Địa chỉ chi tiết" value={data.cf_contact_street}/>
          <DetailRow label="Nguồn khách hàng" value={data.leadsource.label}/>
          <DetailRow label="Người xử lý" value={data.assigned_user_id.label}/>
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
    if (isLongText) {
      return (
        <p>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">
            {value}
          </Tooltip>}>
            <button className="btn-show-tooltip"
                    style={{
                      cursor: 'default',
                      border: 'none',
                    }}
            >
              Chạm để xem
            </button>
          </OverlayTrigger>
        </p>
      )
    }
    return (
      value
    )
  }
  render() {
    let label = this.props.label
    let isLongText = this.props.isLongText
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
}