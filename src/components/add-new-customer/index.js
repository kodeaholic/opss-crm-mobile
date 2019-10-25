import React, { Component } from 'react'
import Button from '../commonComponents/button'
import Input from '../commonComponents/input'
import './index.css'

export default class AddNewCustomer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderButton = () => {
    const pathToGoBack = '/lead'

    return (
      <div className="wrapper-button-addnewcustomer">
        <div className="addnewcustomer-button">
          <Button label="Hủy" path={pathToGoBack}></Button>
        </div>
        <div className="addnewcustomer-button">
          <Button label="Lưu" path={pathToGoBack}></Button>
        </div>
      </div>
    )
  }

  renderListField = () => {
    return (
      <div className="addnewcustomer-feild">
        <Input label="Họ tên khách hàng" isRequire />
        <Input label="Số điện thoại" isRequire />
        <Input label="Ngành hàng" isRequire />
        <Input label="Khu vực" isRequire />
        <Input label="Nguồn khách hàng" isRequire />
        <Input label="Người xử lý" isRequire />
        <Input label="Số điện thoại khác" />
        <Input label="Mô tả chung" isMultiLine/>
      </div>
    )
  }

  render() {
    return (
      <div className="container-addnewcust">
        {this.renderButton()}
        {this.renderListField()}
      </div>
    )
  }
}
