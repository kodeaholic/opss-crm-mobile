import React, { Component } from 'react'
import './index.css'
export default class ProductForm extends Component {
  constructor(props) {
    super(props)
    this.deleteProduct = this.deleteProduct.bind(this)
  }
  deleteProduct = () => {
    this.props.onDelete()
  }
  render() {
    const id = this.props.id
    return (
      <div className="product-wrapper" id={"prdWrapper_"+id}>
        <div className="horizontal-separated-div">
        </div>
        <div className="expandable-form-wrapper-field" id="-wrapper" style={{marginTop: '10px'}}>
          <label
            className="expandable-form-label-field">Tên sản phẩm <span className="float-right delete-product-button" id={"btnDelete_"+id} onClick={this.deleteProduct}>Xóa</span></label>
          <input name="" type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập tên sản phẩm" onChange={this.handleChange}/>
        </div>
        <div className="expandable-form-wrapper-field" id="-wrapper">
          <label
            className="expandable-form-label-field">Serial</label>
          <input name="" type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập số serial" onChange={this.handleChange}/>
        </div>
        <div className="expandable-form-wrapper-field" id="product[price][]-wrapper">
          <label
            className="expandable-form-label-field">Đơn giá</label>
          <input name="product[price][]" type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập đơn giá" onChange={this.handleChange} id="cf_pot_thoihan"/>
        </div>
        <div className="row-col-2">
          <div className="expandable-form-wrapper-field" id="product[discount][]-wrapper"
               style={{ marginRight: '5px' }}>
            <label className="expandable-form-label-field">Chiết khấu (%) </label>
            <div className="expandable-form-input-wrapper">
              <input name="product[discount][]" type="text" className="expandable-form-input-field"
                     onChange={this.handleChange} id="cf_pot_startdate" style={{ width: '100%' }}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="product[quantity][]-wrapper"
               style={{ marginLeft: '5px' }}>
            <label className="expandable-form-label-field">Số lượng </label>
            <div className="expandable-form-input-wrapper">
              <input name="product[quantity][]" type="text" className="expandable-form-input-field"
                     onChange={this.handleChange} id="cf_pot_enddate" style={{ width: '100%' }}/>
            </div>
          </div>
        </div>
        <div className="expandable-form-wrapper-field" id="product[total][]-wrapper">
          <label
            className="expandable-form-label-field">Thành tiền</label>
          <span className="input-vnd-unit">
              <input name="product[total][]" type="text" className="expandable-form-input-field"
                     placeholder="Nhập thành tiền" defaultValue="0" disabled/>
            </span>
        </div>
        <div className="expandable-form-wrapper-field" id="-wrapper">
          <label
            className="expandable-form-label-field">Bảo hành</label>
          <input name="" type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập thời gian bảo hành" onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
}
