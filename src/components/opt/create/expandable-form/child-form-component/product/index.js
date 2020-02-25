import React, { Component } from 'react'
import axios from 'axios'
import './index.css'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { addError, clearError} from '../../../common'
export default class ProductForm extends Component {
  constructor(props) {
    super(props)
    this.deleteProduct = this.deleteProduct.bind(this)
  }
  deleteProduct = () => {
    this.props.onDelete()
  }

  customAddError = (name, content) => {

  }

  handleChange = (event) => {
    const {value, name} = event.target
    if (name.indexOf('price_') !== -1 || name.indexOf('quantity_') !== -1 || name.indexOf('discount_') !== -1) {
      /* Check only number */
      let regex = /[^0-9]/gm
      if (regex.test(value)) {
        if (name.indexOf('quantity_') !== -1 || name.indexOf('discount_') !== -1) {
          // do nothing
        }
        else {
          addError(name, 'Vui lòng chỉ nhập số')
        }
      }
      else {
        clearError(name)
      }
      let elementID = name.replace(/.*_/g, '')
      this.updateTotalPrice(elementID)
    }
  }

  updateStockPrice(id, price) {
    let priceInput = document.getElementById('price_'+id)
    if (priceInput) {
      priceInput.value = price
    }
  }

  updateTotalPrice(id){
    let totalInput = document.getElementById("total_"+id)
    let price = document.getElementById("price_"+id).value
    let quantity = document.getElementById("quantity_"+id).value
    let discount = document.getElementById("discount_"+id).value
    if (isNaN(price)) price = 0
    if (isNaN(quantity)) quantity = 0
    if (isNaN(discount)) discount = 0
    if (isNaN(price) || isNaN(quantity) || isNaN(discount)) {
      // do nothing
    }
    else {
      let total = price * quantity * (100 - discount)
      total = parseFloat(total) / 100
      if (isNaN(total)) total = 0
      totalInput.value = total
    }
  }

  onSelectProductChange = (name, option) => {
    let elementID = name.replace('prdName_', '')
    const { value, label, price } = option
    this.updateStockPrice(elementID, price)
    this.updateTotalPrice(elementID)
  }

  /*
  * Fetch data from API for dropdown select
  */
  fetchHardwareProducts = (inputValue) => {
    let userLoginData = localStorage.getItem('userLoggedInKV')
    userLoginData = JSON.parse(userLoginData).result.login
    let session = userLoginData.session
    const bodyFormData = new FormData()
    bodyFormData.append('_operation', 'fetchHardwareProducts')
    bodyFormData.append('_session', session)
    bodyFormData.append('search', inputValue)
    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })

    return request
      .then(response => {
        const { success, result } = response.data
        if (success) {
          return result.products
        } else {
          return []
        }
      })
      .catch(err => {
        return []
      })
  }
  render() {
    const id = this.props.id
    return (
      <div className="product-wrapper" id={"prdWrapper_"+id}>
        <div className="horizontal-separated-div">
        </div>
        <div className="expandable-form-wrapper-field" id={"prdName_" + id + "-wrapper"} style={{marginTop: '10px'}}>
          <label
            className="expandable-form-label-field">Tên sản phẩm <span className="float-right delete-product-button" id={"btnDelete_"+id} onClick={this.deleteProduct}>Xóa</span></label>
          <AsyncSelect
            classNamePrefix="expandable-form-react-select"
            cacheOptions
            defaultOptions
            loadOptions={this.fetchHardwareProducts}
            placeholder="Nhập tên sản phẩm"
            isSearchable={true}
            onChange={this.onSelectProductChange.bind(this, "prdName_" +id)}
          />
          <input type="hidden" name={"prd_id_" +id} id={"prd_id_" +id}/>
        </div>
        <div className="expandable-form-wrapper-field" id={"serial_" + id + "-wrapper"}>
          <label
            className="expandable-form-label-field">Serial</label>
          <input name={"serial_" +id} id={"serial_" +id} type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập số serial" onChange={this.handleChange}/>
        </div>
        <div className="expandable-form-wrapper-field" id={"price_" + id +"-wrapper"}>
          <label
            className="expandable-form-label-field">Đơn giá</label>
          <input name={"price_" + id} id={"price_" + id} type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập đơn giá" onChange={this.handleChange}/>
        </div>
        <div className="row-col-2">
          <div className="expandable-form-wrapper-field" id={"discount_" +id+"-wrapper"}
               style={{ marginRight: '5px' }}>
            <label className="expandable-form-label-field">Chiết khấu (%) </label>
            <div className="expandable-form-input-wrapper">
              <input name={"discount_" +id} id={"discount_" +id} type="text" className="expandable-form-input-field"
                     onChange={this.handleChange} style={{ width: '100%' }}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id={"quantity_"+id+"-wrapper"}
               style={{ marginLeft: '5px' }}>
            <label className="expandable-form-label-field">Số lượng </label>
            <div className="expandable-form-input-wrapper">
              <input name={"quantity_"+id} id={"quantity_"+id} type="text" className="expandable-form-input-field"
                     onChange={this.handleChange} style={{ width: '100%' }}/>
            </div>
          </div>
        </div>
        <div className="expandable-form-wrapper-field" id={"total_"+id+"-wrapper"}>
          <label
            className="expandable-form-label-field">Thành tiền</label>
          <span className="input-vnd-unit">
              <input name={"total_"+id} id={"total_"+id} type="text" className="expandable-form-input-field"
                     placeholder="Nhập thành tiền" defaultValue="0" disabled/>
            </span>
        </div>
        <div className="expandable-form-wrapper-field" id={"warranty_" + id+"-wrapper"}>
          <label
            className="expandable-form-label-field">Bảo hành</label>
          <input name={"warranty_" + id} id={"warranty_" + id} type="text"
                 className="expandable-form-input-field"
                 placeholder="Nhập thời gian bảo hành" onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
}
