import React, { Component } from 'react'
import compose from 'recompose/compose';
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderCircleChart = this.renderCircleChart.bind(this)
    this.renderInfor = this.renderInfor.bind(this)
  }

  renderInfor() {
    return (
      <div className="wapper-contract">
        <div className="wapper-contract-infor">
          <div className="total-contract-value">3,000,000</div>
          <label>15 hợp đồng mới</label>
        </div>
        <div className="wapper-contract-infor">
          <div className="total-contract-value">25,000,000</div>
          <label>50 hợp đồng gia hạn</label>
        </div>
      </div>
    )
  }

  renderCircleChart() {
    return (
      <div className="container-chart">
        <div className="wrapper-circle-chart">
          <div className="wrapper-circle">
            <div
              className="circle"
              style={{
                backgroundColor: '#ae49c7'
              }}>
              <label className="label-value-inside-circle">10000</label>
              <label className="label-value-inside-circle">1934834</label>
            </div>
            <label>Tái Ký</label>
          </div>
          <div className="wrapper-circle" style={{ marginLeft: 20 }}>
            <div
              className="circle"
              style={{
                backgroundColor: 'green'
              }}>
              <label className="label-value-inside-circle">10000</label>
              <label className="label-value-inside-circle">232434234</label>
            </div>
            <label>Thêm CN</label>
          </div>
        </div>
        <div className="wrapper-circle-chart">
          <div className="wrapper-circle">
            <div
              className="circle"
              style={{
                backgroundColor: '#c2a945'
              }}>
              <label className="label-value-inside-circle">11111</label>
              <label className="label-value-inside-circle">2222222</label>
            </div>
            <label>Nâng gói</label>
          </div>
          <div className="wrapper-circle" style={{ marginLeft: 20 }}>
            <div
              className="circle"
              style={{
                backgroundColor: '#2c0880'
              }}>
              <label className="label-value-inside-circle">10000</label>
              <label className="label-value-inside-circle">232434234</label>
            </div>
            <label>Phần cứng</label>
          </div>
        </div>
      </div>
    )
  }

  render() {
    console.log('thailog props dashboard', this.props)

    return (
      <div className="container-dashboard">
        {this.renderInfor()}
        {this.renderCircleChart()}
      </div>
    )
  }
}

export default compose(
  withLayout(),
  withAuth(),
)(Dashboard);