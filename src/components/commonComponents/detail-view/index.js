import React, { Component } from 'react'

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
    let data = this.props.data
    return (
      <div className="detail-card">
        <DetailRow label="Họ và tên khách hàng" value={data.lastname}/>
        <DetailRow label="Tình trạng" value={data.leadstatus.label}/>
        <DetailRow label="Tên gian hàng" value={data.website}/>
        <DetailRow label="Số điện thoại" value={data.mobile}/>
        <DetailRow label="Số điện thoại khác" value={data.phone}/>
        <DetailRow label="Ngành hàng" value={data.industry.label}/>
        <DetailRow label="Khu vực" value={data.cf_lead_khu_vuc.label}/>
        <DetailRow label="Nguồn khách hàng" value={data.leadsource.label}/>
        <DetailRow label="Người xử lý" value={data.assigned_user_id.label}/>
        <DetailRow label="Mô tả chung" value={data.description}/>
      </div>
    )
  }
}
class RelatedCard extends Component {
  render() {
    return (
      <div>
        Related
      </div>
    )
  }
}

class DetailRow extends Component {
  render() {
    let label = this.props.label
    let value = this.props.value
    return (
      <div className="detail-row">
        <div className="detail-label">
          {label}
        </div>
        <div className="detail-value">
          {value}
        </div>
      </div>
    )
  }
}