import React, { Component } from 'react'
import axios from 'axios'
import withAuth from '../../../withAuth'
import withLayout from '../../../withLayout'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  fetchContactRecord,
  getContactData,
  getLoadingStatus,
  getCities,
  getMapCityState
} from '../../../../modules/contactDuck'
import {
  requestSaveOpportunity,
  getFormSubmittingStatus,
  getFormSubmitResponseStatus
} from '../../../../modules/opportunityDuck'
import { getSessionStatus, getUserLoggedIn } from '../../../../modules/loginDuck'
import ExpandableFormComponent from '../expandable-form'

import './index.css'
import Select from 'react-select'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import {
  checkConditionalRequiredFields,
  focusParentDateInput,
  validateMaxLength,
  validateOnlyNumbers,
  validateRequiredField,
  clearError,
  addError,
  emailRegex,
  websiteRegex,
  getSessionFromLocalStorage, customAddError
} from '../common/index'
import ProductForm from '../expandable-form/child-form-component/product'

const mapStateToProps = (state) => ({
  expired: getSessionStatus(state),
  currentUser: getUserLoggedIn(state),
  contactData: getContactData(state),
  loading: getLoadingStatus(state),
  formSubmitResponseStatus: getFormSubmitResponseStatus(state),
  formSubmittingStatus: getFormSubmittingStatus(state),
  cities: getCities(state),
  mapCityState: getMapCityState(state)
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchContactRecord,
      requestSaveOpportunity
    },
    dispatch
  )
})

class OptPhanCungComponent extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.fetchContactStatus = this.fetchContactStatus.bind(this)
    this.fetchIndustries = this.fetchIndustries.bind(this)
    this.fetchRegions = this.fetchRegions.bind(this)
    this.fetchLeadSources = this.fetchLeadSources.bind(this)
    this.fetchListGoiHD = this.fetchListGoiHD.bind(this)
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.addProductForm = this.addProductForm.bind(this)
    this.deleteProductForm = this.deleteProductForm.bind(this)
    let pathName = props.location.pathname
    let array = pathName.split('/')
    let record = array.length > 2 ? array[2] : undefined
    let city = _.get(props, 'contactData.cf_city') || undefined
    let state = _.get(props, 'contactData.cf_state') || undefined
    this.state = {
      record: record,
      session: undefined,
      formData: {
        contactRecordId: record,
        potentialname: 'Hợp đồng phần cứng',
        contact_id: undefined
      },
      currentCity: city,
      currentState: state,
      cities: _.get(props, 'contactData.cities'),
      mapCityState: _.get(props, 'contactData.mapCityState'),
      cityChanged: false,
      stateChanged: false,
      productIDs: [new Date().valueOf()]
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    let contactData = this.props.contactData
    let formData = this.state.formData

    /* default fields - cannot change */
    formData['contact_id'] = {
      label: this.props.contactData.lastname,
      value: formData.contactRecordId
    }
    formData['potentialname'] = 'Hợp đồng phần cứng'

    /* Required fields with default values from contact data */
    /**
     * sales_stage
     * cf_pot_nganh_hang
     * cf_mobile
     * cf_contact_street
     * cf_email
     * cf_city
     * cf_state
     * cf_pot_khu_vuc
     * leadsource
     */
    /* Check neu undefined, tuc la user khong dong den, khong thay doi gi, thi lay du lieu tu contact */
    if (!formData.hasOwnProperty('sales_stage')) formData['sales_stage'] = {
      'label': 'Bán hàng',
      'value': 'Sell'
    }
    if (!formData.hasOwnProperty('customer_type')) formData['customer_type'] = {
      'label': 'Cá nhân',
      'value': 'Cá nhân'
    }
    if (!formData.hasOwnProperty('cf_pot_nganh_hang')) formData['cf_pot_nganh_hang'] = contactData.cf_contact_nganh_hang
    if (!formData.hasOwnProperty('cf_mobile')) formData['cf_mobile'] = contactData.mobile
    if (!formData.hasOwnProperty('cf_contact_street')) formData['cf_contact_street'] = contactData.cf_contact_street
    if (!formData.hasOwnProperty('cf_email')) formData['cf_email'] = contactData.email
    if (!this.state.cityChanged && !this.state.stateChanged) {
      formData['cf_city'] = contactData.cf_city
      formData['cf_state'] = contactData.cf_state
    }
    if (!formData.hasOwnProperty('cf_pot_khu_vuc')) formData['cf_pot_khu_vuc'] = contactData.cf_contact_khu_vuc
    if (!formData.hasOwnProperty('leadsource')) formData['leadsource'] = contactData.leadsource
    if (!formData.hasOwnProperty('assigned_user_id')) formData['assigned_user_id'] = contactData.assigned_user_id

    /* validation - edit */
    let error = 0

    // Required combobox
    if (!validateRequiredField(formData.sales_stage, 'sales_stage')) error++
    if (!validateRequiredField(formData.cf_pot_nganh_hang, 'cf_pot_nganh_hang')) error++
    if (!validateRequiredField(formData.customer_type, 'customer_type')) error++
    if (!validateRequiredField(formData.leadsource, 'leadsource')) error++
    if (!validateRequiredField(formData.cf_city, 'cf_city')) error++
    if (!validateRequiredField(formData.cf_state, 'cf_state')) error++
    if (!validateRequiredField(formData.cf_pot_khu_vuc, 'cf_pot_khu_vuc')) error++
    if (!validateRequiredField(formData.assigned_user_id, 'assigned_user_id')) error++
    if (!validateRequiredField(formData.cf_mobile, 'cf_mobile')) error++
    if (!validateRequiredField(formData.cf_contact_street, 'cf_contact_street')) error++
    if (!validateRequiredField(formData.cf_email, 'cf_email')) error++

    let checkAdditionalFields = checkConditionalRequiredFields(formData)
    if (checkAdditionalFields === 'BREAKPOINT') return false
    // website
    if (formData.cf_pot_website && (websiteRegex.test(formData.cf_pot_website) || formData.cf_pot_website.length >= 255)) {
      error++
      addError('cf_pot_website', 'Chỉ nhập số và chữ, không quá 255 kí tự')
    }

    if (formData.cf_email && !emailRegex.test(formData.cf_email)) {
      error++
      addError('cf_email', 'Vui lòng nhập đúng định dạng email')
    }
    if (formData.cf_pot_contractid && /\s/.test(formData.cf_pot_contractid)) {
      error++
      addError('cf_pot_contractid', 'Vui lòng không nhập dấu cách')
    }

    // only numbers
    // if (formData.cf_passport && !validateOnlyNumbers(formData.cf_passport, 'cf_passport')) error++ // bo chan, cho nhap text thoai mai CMB-155#comment
    if (formData.cf_mobile && !validateOnlyNumbers(formData.cf_mobile, 'cf_mobile')) error++
    if (formData.cf_pot_thoihan && !validateOnlyNumbers(formData.cf_pot_thoihan, 'cf_pot_thoihan')) error++
    if (formData.cf_pot_khuyenmai && !validateOnlyNumbers(formData.cf_pot_khuyenmai, 'cf_pot_khuyenmai')) error++
    if (formData.amount && !validateOnlyNumbers(formData.amount, 'amount')) error++
    if (formData.cf_pot_sochinhanh && !validateOnlyNumbers(formData.cf_pot_sochinhanh, 'cf_pot_sochinhanh')) error++

    // max length
    if (formData.cf_passport && !validateMaxLength(formData.cf_passport, 'cf_passport')) error++
    if (formData.cf_pot_website && !validateMaxLength(formData.cf_pot_website, 'cf_pot_website')) error++
    if (formData.cf_passport_location && !validateMaxLength(formData.cf_passport_location, 'cf_passport_location')) error++
    if (formData.cf_pot_motachung && !validateMaxLength(formData.cf_pot_motachung, 'cf_pot_motachung')) error++
    if (formData.cf_mobile && !validateMaxLength(formData.cf_mobile, 'cf_mobile')) error++
    if (formData.cf_contact_street && !validateMaxLength(formData.cf_contact_street, 'cf_contact_street')) error++
    if (formData.cf_email && !validateMaxLength(formData.cf_email, 'cf_email')) error++
    if (formData.cf_pot_lead_source_des && !validateMaxLength(formData.cf_pot_lead_source_des, 'cf_pot_lead_source_des')) error++
    if (formData.cf_pot_thoihan && !validateMaxLength(formData.cf_pot_thoihan, 'cf_pot_thoihan')) error++
    if (formData.cf_pot_khuyenmai && !validateMaxLength(formData.cf_pot_khuyenmai, 'cf_pot_khuyenmai')) error++
    if (formData.cf_pot_contractid && !validateMaxLength(formData.cf_pot_contractid, 'cf_pot_contractid')) error++

    if (formData.cf_pot_contractid && !validateMaxLength(formData.cf_pot_contractid, 'cf_pot_contractid')) error++
    if (formData.cf_pot_ma_voucer && !validateMaxLength(formData.cf_pot_ma_voucer, 'cf_pot_ma_voucer')) error++
    if (formData.represent && !validateMaxLength(formData.represent, 'represent')) error++
    if (formData.amount && !validateMaxLength(formData.amount, 'amount')) error++
    if (formData.cf_branch_address && !validateMaxLength(formData.cf_branch_address, 'cf_branch_address')) error++
    if (formData.cf_pot_diachich && !validateMaxLength(formData.cf_pot_diachich, 'cf_pot_diachich')) error++
    if (formData.cf_pot_note && !validateMaxLength(formData.cf_pot_note, 'cf_pot_note')) error++
    if (formData.cf_871 && !validateMaxLength(formData.cf_871, 'cf_871')) error++
    if (formData.cf_pot_tinhhinhkinhdoanh && !validateMaxLength(formData.cf_pot_tinhhinhkinhdoanh, 'cf_pot_tinhhinhkinhdoanh')) error++
    if (formData.cf_pot_tinhnang && !validateMaxLength(formData.cf_pot_tinhnang, 'cf_pot_tinhnang')) error++
    if (formData.cf_pot_hinhthuccongcu && !validateMaxLength(formData.cf_pot_hinhthuccongcu, 'cf_pot_hinhthuccongcu')) error++
    if (formData.cf_pot_diemyeu && !validateMaxLength(formData.cf_pot_diemyeu, 'cf_pot_diemyeu')) error++
    if (formData.cf_pot_khokhan && !validateMaxLength(formData.cf_pot_khokhan, 'cf_pot_khokhan')) error++
    if (formData.cf_pot_tinhchudong && !validateMaxLength(formData.cf_pot_tinhchudong, 'cf_pot_tinhchudong')) error++
    if (formData.cf_pot_ngancankh && !validateMaxLength(formData.cf_pot_ngancankh, 'cf_pot_ngancankh')) error++
    if (formData.cf_pot_doithunao && !validateMaxLength(formData.cf_pot_doithunao, 'cf_pot_doithunao')) error++

    let checkHardware = this.validateProducts()
    if (checkHardware === 'EMPTY_FIELD_HARDWARE') {
      return false
    }
    else {
      if (!checkHardware) error++
    }
    if (error > 0) {
      toast.error('Vui lòng hoàn thiện các trường chưa đúng', {
        autoClose: 3000,
        draggable: false
      })
      return false
    } else {
      e.target.disabled = true
      let session = this.props.currentUser.session

      /* Get products data*/
      let products = this.getProductsDataForSubmit()
      this.props.actions.requestSaveOpportunity({ session, data: formData, productsOptPhanCung: products })
    }
  }

  getProductsDataForSubmit = () => {
    let productFormIDs = this.getProductFormIDs()
    let products = []
    let n = productFormIDs.length
    for (let i = 0; i < n; i++) {
      let id = productFormIDs[i]
      let name = document.getElementById('prd_id_' + id).value
      let serial = document.getElementById('serial_' + id).value
      let price = document.getElementById('price_' + id).value
      let discount = document.getElementById('discount_' + id).value
      let quantity = document.getElementById('quantity_' + id).value
      let warranty = document.getElementById('warranty_' + id).value
      let total = document.getElementById('total_' + id).value
      products.push({ name, serial, price, discount, quantity, warranty, total })
    }
    return products
  }

  getProductFormIDs = () => {
    let productWrappers = document.getElementsByClassName('product-wrapper')
    let n = productWrappers.length
    let array = []
    for (let i = 0; i < n; i++) {
      let id = productWrappers[i].id
      id = id.replace('prdWrapper_', '')
      array.push(id)
    }
    return array
  }

  validateSingleProduct = (id) => {
    let error = 0
    let serial = document.getElementById('serial_' + id).value
    let price = document.getElementById('price_' + id).value
    let discount = document.getElementById('discount_' + id).value
    let quantity = document.getElementById('quantity_' + id).value
    let warranty = document.getElementById('warranty_' + id).value
    let prdId = document.getElementById('prd_id_' + id).value
    if (!serial || !price || !quantity) {
      return 'EMPTY_FIELD_HARDWARE'
    }
    if (!prdId) {
      error++
      validateRequiredField(prdId, 'prdName_' + id)
    }
    if (serial && !validateOnlyNumbers(serial, 'serial_' + id) && !validateMaxLength(serial, 'serial_' + id)) error++
    if (price && !validateOnlyNumbers(price, 'price_' + id) && !validateMaxLength(price, 'price_' + id)) error++
    if (discount && !validateOnlyNumbers(discount, 'discount_' + id) && !validateMaxLength(discount, 'discount_' + id)) error++
    if (quantity && !validateOnlyNumbers(quantity, 'quantity_' + id) && !validateMaxLength(quantity, 'quantity_' + id)) error++
    if (warranty && !validateMaxLength(warranty, 'warranty_' + id)) error++
    if (discount && parseInt(discount) > 100) {
      error++
      customAddError('discount_' + id, 'Vui lòng không nhập nhiều hơn 100%')
    }
    return error === 0
  }

  validateProducts = () => {
    let error = 0
    let productFormIDs = this.getProductFormIDs()
    if (productFormIDs.length === 0) return true
    let n = productFormIDs.length
    for (let i = 0; i < n; i++) {
      let check = this.validateSingleProduct(productFormIDs[i])
      if (check === 'EMPTY_FIELD_HARDWARE') {
        alert('Vui lòng hoàn thiện thông tin phần cứng')
        return "EMPTY_FIELD_HARDWARE"
      } else if (!check) error++
    }
    return error === 0
  }

  componentWillMount() {
    let { currentUser } = this.props
    let session = null
    if (currentUser) session = currentUser.session
    if (_.isEmpty(session)) {
      session = getSessionFromLocalStorage()
    }
    this.setState({ session: session })
    let record = this.state.record
    this.props.actions.fetchContactRecord({ session, record })
  }

  handleChange(e) {
    const { name, value } = e.target
    let data = this.state.formData
    data[name] = value
    clearError(name)

    /* CMB-162: tinh ngay ket thuc */
    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1 // getMonth() is zero-based
      var dd = this.getDate()

      return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
      ].join('-')
    }
    if (name === 'cf_pot_startdate' || name === 'cf_pot_thoihan' || name === 'cf_pot_khuyenmai') {
      let end = undefined
      if (name === 'cf_pot_startdate') {
        if (_.isEmpty(value)) {
          document.getElementById('cf_pot_enddate').value = ''
          delete data['cf_pot_enddate']
        } else {
          end = new Date(value)
        }
      } else if (name === 'cf_pot_thoihan' || name === 'cf_pot_khuyenmai') {
        let startDate = document.getElementById('cf_pot_startdate').value
        if (!_.isEmpty(startDate)) end = new Date(startDate)
        else end = undefined
      }
      if (end > 0) {
        let duration = document.getElementById('cf_pot_thoihan').value
        let bonus = document.getElementById('cf_pot_khuyenmai').value
        duration = parseInt(duration)
        bonus = parseInt(bonus)
        if (isNaN(duration)) duration = 0
        if (isNaN(bonus)) bonus = 0
        let temp = end.setMonth(end.getMonth() + duration + bonus)
        if ((duration + bonus) > 0) {
          temp = end.setDate(end.getDate() - 1)
        }
        let endDateString = end.yyyymmdd()
        document.getElementById('cf_pot_enddate').value = endDateString
        data['cf_pot_enddate'] = endDateString
      }
    }
    /* end CMB-162 */
    this.setState({ formData: data })
  }

  onSelectChange(name, value) {
    let data = this.state.formData
    data[name] = value
    clearError(name)
    if (name === 'cf_city') {
      data.cf_state = undefined
      this.setState({ formData: data, currentCity: value, currentState: null, cityChanged: true })
    } else if (name === 'cf_state') {
      this.setState({ formData: data, currentState: value, stateChanged: true })
    }

    /* CMB-153 */
    if (name === 'customer_type') {
      // if 'congty', hide: cf_birthday, cf_gender, cf_passport_date, cf_passport_location
      let birthday = document.getElementById('cf_birthday-wrapper')
      let gender = document.getElementById('cf_gender-wrapper')
      let passport_date = document.getElementById('cf_passport_date-wrapper')
      let passport_location = document.getElementById('cf_passport_location-wrapper')
      let company_name = document.getElementById('company_name-wrapper')
      if (value.value === 'Công ty') {
        if (company_name) company_name.classList.remove('display-none')
        if (birthday) birthday.classList.add('display-none')
        if (gender) gender.classList.add('display-none')
        if (passport_date) passport_date.classList.add('display-none')
        if (passport_location) passport_location.classList.add('display-none')

        if (data['cf_birthday']) delete data['cf_birthday']
        if (data['cf_gender']) delete data['cf_gender']
        if (data['cf_passport_date']) delete data['cf_passport_date']
        if (data['cf_passport_location']) delete data['cf_passport_location']
      } else {
        if (value.value === 'Cá nhân') {
          // hide company_name
          if (company_name) company_name.classList.add('display-none')
          if (birthday) birthday.classList.remove('display-none')
          if (gender) gender.classList.remove('display-none')
          if (passport_date) passport_date.classList.remove('display-none')
          if (passport_location) passport_location.classList.remove('display-none')

          if (data['company_name']) delete data['company_name']
        }
      }
    }
    /* end CMB-153 */
    this.setState({ formData: data })
  }

  /*
  * Fetch data from API for dropdown select
  */
  getOptions = (source, search) => {
    let { currentUser } = this.props
    let session = null
    if (currentUser) session = currentUser.session
    if (_.isEmpty(session)) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    const bodyFormData = new FormData()
    bodyFormData.append('_operation', 'fetchDataList')
    bodyFormData.append('_session', session)
    bodyFormData.append('source', source)
    bodyFormData.append('search', search)

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
          return result
        } else {
          return []
        }
      })
      .catch(err => {
        return []
      })
  }

  fetchContactStatus = (inputValue) => {
    return this.getOptions('contactstatus', inputValue)
  }
  fetchIndustries = (inputValue) => {
    return this.getOptions('industry', inputValue)
  }
  fetchRegions = (inputValue) => {
    return this.getOptions('cf_pot_khu_vuc', inputValue)
  }
  fetchLeadSources = (inputValue) => {
    return this.getOptions('leadsource', inputValue)
  }
  fetchListGoiHD = (inputValue) => {
    return this.getOptions('cf_pot_goihd', inputValue)
  }
  fetchPaymentMethods = (inputValue) => {
    return this.getOptions('cf_pot_hinhthuctt', inputValue)
  }
  fetchUsers = (inputValue) => {
    return this.getOptions('users', inputValue)
  }

  addProductForm = () => {
    let productIDs = this.state.productIDs
    let id = new Date().valueOf()
    productIDs.push(id)
    this.setState({ productIDs: productIDs })
  }
  deleteProductForm = (id = '') => {
    let productIDs = this.state.productIDs
    if (id) {
      let find = productIDs.findIndex((element) => {
        return element === id
      })
      if (find > -1) {
        productIDs.splice(find, 1)
        this.setState({ productIDs: productIDs })
      }
    }
  }

  render() {
    /* For navigation back purpose */
    let pathBack = this.props.location.search
    pathBack = pathBack.substring(pathBack.indexOf('pathBack=') + 9)
    /* Session expired handler */
    if (this.props.expired) {
      localStorage.removeItem('userLoggedInKV')
      toast.error('Session expired', {
        autoClose: 1500,
        draggable: false
      })
      return (
        <Redirect to={'/login'}/>
      )
    }
    if (this.props.loading) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"
               style={{ position: 'fixed', top: 'calc(50vh - 50.25px)' }}/>
          </div>
        </div>
      )
    } else {
      /* Contact data loaded */
      if (this.props.formSubmitResponseStatus) {
        toast.success('Tạo thành công', {
          autoClose: 2000,
          draggable: false
        })
        return pathBack ? (<Redirect to={'/' + pathBack}/>) : (
          <Redirect to={'/contact-view/' + this.props.contactData.record}/>)
      } else {
        let contactData = this.props.contactData
        let currentCity = this.state.currentCity ? this.state.currentCity : contactData.cf_city
        let currentState = (this.state.cityChanged || this.state.stateChanged) ? this.state.currentState : contactData.cf_state
        let cityOptions = this.props.cities
        let mapCityStateOptions = this.props.mapCityState
        let filterStateOptions = []
        if (currentCity && currentCity.value) {
          filterStateOptions = mapCityStateOptions.filter((map) => map.city === currentCity.value)[0].states
        } else {
          filterStateOptions = []
        }
        const products = []
        const productIDs = this.state.productIDs
        for (let i = 0; i < productIDs.length; i++) {
          products.push(<ProductForm key={productIDs[i]} id={productIDs[i]}
                                     onDelete={this.deleteProductForm.bind(this, productIDs[i])}/>)
        }
        return (
          <div className="form-add-opt-container">
            <ExpandableFormComponent title="Thông tin cơ bản">
              <div className="expandable-form-wrapper-field" id="potentialname-wrapper">
                <label className="expandable-form-label-field">Cơ hội <span className="require-field"> *</span></label>
                <input name="potentialname" type="text" className="expandable-form-input-field"
                       defaultValue="Hợp đồng phần cứng" disabled
                       style={{ border: 'none', marginBottom: '0', color: '#000000' }}/>
              </div>
              <div className="expandable-form-wrapper-field" id="approval_status-wrapper">
                <label className="expandable-form-label-field">
                  Kế toán/ Admin xác nhận
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  defaultValue={{ 'label': 'Chờ xác nhận', 'value': 'Chờ xác nhận' }}
                  options={[
                    {
                      'label': 'Chờ xác nhận',
                      'value': 'Chờ xác nhận'
                    },
                    {
                      'label': 'Từ chối',
                      'value': 'Từ chối'
                    }
                  ]}
                  onChange={this.onSelectChange.bind(this, 'approval_status')}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="sales_stage-wrapper">
                <label className="expandable-form-label-field">
                  Tình trạng <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={{
                    'label': 'Bán hàng',
                    'value': 'Sell'
                  }}
                  loadOptions={this.fetchContactStatus}
                  placeholder="Tình trạng"
                  onChange={this.onSelectChange.bind(this, 'sales_stage')}
                  isSearchable={false}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="lastname-wrapper">
                <label className="expandable-form-label-field">Họ tên khách hàng</label>
                <input name="lastname" type="text" className="expandable-form-input-field"
                       value={this.props.contactData.lastname} disabled
                       style={{ border: 'none', marginBottom: '0', color: '#000000' }}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_nganh_hang-wrapper">
                <label className="expandable-form-label-field">
                  Ngành hàng <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={contactData.cf_contact_nganh_hang}
                  loadOptions={this.fetchIndustries}
                  placeholder="Ngành hàng"
                  onChange={this.onSelectChange.bind(this, 'cf_pot_nganh_hang')}
                  isSearchable={false}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_website-wrapper">
                <label
                  className="expandable-form-label-field">Tên gian hàng </label>
                <input name="cf_pot_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập tên gian hàng" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="customer_type-wrapper">
                <label className="expandable-form-label-field">
                  Loại khách <span className="require-field"> *</span>
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  defaultValue={
                    {
                      'label': 'Cá nhân',
                      'value': 'Cá nhân'
                    }
                  }
                  options={[
                    {
                      'label': 'Cá nhân',
                      'value': 'Cá nhân'
                    },
                    {
                      'label': 'Công ty',
                      'value': 'Công ty'
                    }
                  ]}
                  onChange={this.onSelectChange.bind(this, 'customer_type')}
                  placeholder="Loại khách hàng"
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_birthday-wrapper">
                <label className="expandable-form-label-field">Ngày sinh </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="cf_birthday" type="date" className="expandable-form-input-field"
                         onChange={this.handleChange}/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={focusParentDateInput}
                     style={{ color: '#1492E6' }}/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_gender-wrapper">
                <label className="expandable-form-label-field">
                  Giới tính
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  placeholder="Lựa chọn giới tính"
                  options={[
                    {
                      'label': 'Nam',
                      'value': 'Nam'
                    },
                    {
                      'label': 'Nữ',
                      'value': 'Nữ'
                    }
                  ]}
                  onChange={this.onSelectChange.bind(this, 'cf_gender')}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_passport-wrapper">
                <label
                  className="expandable-form-label-field">Số CMT/MST </label>
                <input name="cf_passport" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập CMT/MST" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_passport_date-wrapper">
                <label className="expandable-form-label-field">Ngày cấp </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="cf_passport_date" type="date" className="expandable-form-input-field"
                         onChange={this.handleChange}/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={focusParentDateInput}/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_passport_location-wrapper">
                <label className="expandable-form-label-field">Nơi cấp </label>
                <input name="cf_passport_location" type="text" className="expandable-form-input-field"
                       onChange={this.handleChange} placeholder="Nhập nơi cấp CMT/MST"/>
              </div>
              <div className="expandable-form-wrapper-field display-none" id="company_name-wrapper">
                <label className="expandable-form-label-field">Tên công ty </label>
                <input name="company_name" type="text" className="expandable-form-input-field"
                       onChange={this.handleChange} placeholder="Nhập tên công ty"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_motachung-wrapper">
                <label className="expandable-form-label-field">Mô tả chung về khách hàng </label>
                <textarea name="cf_pot_motachung" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập mô tả chung về khách hàng" onChange={this.handleChange}/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin liên hệ">
              <div className="expandable-form-wrapper-field" id="cf_mobile-wrapper">
                <label
                  className="expandable-form-label-field">Số điện thoại <span
                  className="require-field"> *</span></label>
                <input name="cf_mobile" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập số điện thoại" defaultValue={contactData.mobile} onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_street-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ chi tiết <span
                  className="require-field"> *</span></label>
                <input name="cf_contact_street" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ chi tiết" defaultValue={contactData.cf_contact_street}
                       onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_email-wrapper">
                <label
                  className="expandable-form-label-field">Primary Email <span
                  className="require-field"> *</span></label>
                <input name="cf_email" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ email" defaultValue={contactData.email} onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_city-wrapper">
                <label className="expandable-form-label-field">
                  Thàng phố/ Tỉnh <span className="require-field"> *</span>
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  value={currentCity}
                  options={cityOptions}
                  placeholder="Tỉnh/ Thành phố"
                  onChange={this.onSelectChange.bind(this, 'cf_city')}
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_state-wrapper">
                <label className="expandable-form-label-field">
                  Quận/ Huyện <span className="require-field"> *</span>
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  value={currentState}
                  options={filterStateOptions}
                  placeholder="Quận/ Huyện"
                  onChange={this.onSelectChange.bind(this, 'cf_state')}
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_khu_vuc-wrapper">
                <label className="expandable-form-label-field">
                  Khu vực <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={contactData.cf_contact_khu_vuc}
                  loadOptions={this.fetchRegions}
                  placeholder="Khu vực"
                  onChange={this.onSelectChange.bind(this, 'cf_pot_khu_vuc')}
                  isSearchable={false}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="leadsource-wrapper">
                <label className="expandable-form-label-field">
                  Nguồn khách hàng <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={contactData.leadsource}
                  loadOptions={this.fetchLeadSources}
                  placeholder="Nguồn khách hàng"
                  onChange={this.onSelectChange.bind(this, 'leadsource')}
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_lead_source_des-wrapper">
                <label className="expandable-form-label-field">Mô tả nguồn khách hàng </label>
                <textarea name="cf_pot_lead_source_des" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập mô tả nguồn khách hàng" onChange={this.handleChange}/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin phần cứng" expanded={true} noMarginBottom={true}>
              {productIDs.length > 0 ? products : ''}
              <div className="btn-add-product-wrapper">
                <button className="btn-add-product" onClick={this.addProductForm}>Thêm sản phẩm</button>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin hợp đồng">
              <div className="expandable-form-wrapper-field" id="cf_pot_contractid-wrapper">
                <label
                  className="expandable-form-label-field">Số hợp đồng</label>
                <input name="cf_pot_contractid" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập số hợp đồng" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="represent-wrapper">
                <label
                  className="expandable-form-label-field">Người đại diện</label>
                <input name="represent" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập người đại diện" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_hinhthuctt-wrapper">
                <label className="expandable-form-label-field">
                  Hình thức thanh toán
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  loadOptions={this.fetchPaymentMethods}
                  placeholder="Lựa chọn hình thức thanh toán"
                  onChange={this.onSelectChange.bind(this, 'cf_pot_hinhthuctt')}
                  isSearchable={false}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="amount-wrapper">
                <label
                  className="expandable-form-label-field">Thành tiền</label>
                <span className="input-vnd-unit">
              <input name="amount" type="text" className="expandable-form-input-field"
                     placeholder="Nhập thành tiền" defaultValue="0" onChange={this.handleChange}
                     onKeyDown={(e) => {
                       let key = e.nativeEvent.key
                       if (isNaN(key) && key !== 'Backspace') e.preventDefault()
                     }}/>
            </span>
              </div>
              <div className="expandable-form-wrapper-field" id="closedwon_date-wrapper">
                <label className="expandable-form-label-field">Ngày ký hợp đồng </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="closedwon_date" type="date" className="expandable-form-input-field"
                         onChange={this.handleChange}/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={focusParentDateInput}/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="hardware_type-wrapper">
                <label className="expandable-form-label-field">
                  Loại phần cứng
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  options={[
                    {
                      'label': 'Phần cứng tặng',
                      'value': 'Phần cứng tặng'
                    },
                    {
                      'label': 'Phần cứng bán',
                      'value': 'Phần cứng bán'
                    },
                    {
                      'label': 'Phần cứng giảm giá',
                      'value': 'Phần cứng giảm giá'
                    }
                  ]
                  }
                  onChange={this.onSelectChange.bind(this, 'hardware_type')}
                  placeholder="Loại phần cứng"
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_diachich-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ</label>
                <input name="cf_pot_diachich" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_branch_address-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ chi nhánh</label>
                <input name="cf_branch_address" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ chi nhánh" onChange={this.handleChange}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_note-wrapper">
                <label className="expandable-form-label-field">Ghi chú </label>
                <textarea name="cf_pot_note" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập ghi chú" onChange={this.handleChange}/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin CSKH">
              <div className="expandable-form-wrapper-field" id="assigned_user_id-wrapper">
                <label className="expandable-form-label-field">
                  Người xử lý <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={contactData.assigned_user_id}
                  loadOptions={this.fetchUsers}
                  placeholder="Chọn người xử lý"
                  onChange={this.onSelectChange.bind(this, 'assigned_user_id')}
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_869-wrapper">
                <label className="expandable-form-label-field">
                  Gọi CSKH
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  defaultValue={{ label: 'Chưa gọi', value: 'Chưa gọi' }}
                  options={[
                    {
                      'label': 'Chưa gọi',
                      'value': 'Chưa gọi'
                    },
                    {
                      'label': 'Đã gọi',
                      'value': 'Đã gọi'
                    }
                  ]
                  }
                  onChange={this.onSelectChange.bind(this, 'cf_869')}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_967-wrapper">
                <label className="expandable-form-label-field">
                  Đánh giá
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  placeholder="Chọn đánh giá"
                  options={[
                    {
                      'label': 'Rất quan tâm',
                      'value': 'Rất quan tâm'
                    },
                    {
                      'label': 'Quan tâm',
                      'value': 'Quan tâm'
                    },
                    {
                      'label': 'Ít quan tâm',
                      'value': 'Ít quan tâm'
                    }
                  ]}
                  onChange={this.onSelectChange.bind(this, 'cf_967')}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_871-wrapper">
                <label className="expandable-form-label-field">Phản hồi CSKH </label>
                <textarea name="cf_871" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập phản hồi CSKH" onChange={this.handleChange}/>
              </div>
            </ExpandableFormComponent>
            <button className="create-opt-button" onClick={this.handleSubmit}>
              {
                !this.props.formSubmittingStatus && 'Tạo'
              }
              {
                this.props.formSubmittingStatus && (<i className="fa fa-spinner fa-pulse fa-2x fa-fw"/>)
              }
            </button>
          </div>
        )
      }
    }
  }
}

export default compose(
  withAuth(),
  withLayout(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OptPhanCungComponent)
