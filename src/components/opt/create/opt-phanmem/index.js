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

class OptPhanMemComponent extends Component {
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
    let pathName = props.location.pathname
    let array = pathName.split('/')
    let record = array.length > 2 ? array[2] : undefined
    let city = _.get(props, 'contactData.cf_city') || undefined
    let state = _.get(props, 'contactData.cf_state') || undefined
    this.state = {
      record: record,
      session: undefined,
      formData: {
        record: record,
        potentialname: 'Hợp đồng phần mềm',
        contact_id: undefined
      },
      currentCity: city,
      currentState: state,
      cities: _.get(props, 'contactData.cities'),
      mapCityState: _.get(props, 'contactData.mapCityState'),
      cityChanged: false
    }
  }

  focusParentDateInput = (e) => {
    let input = e.target.previousSibling
    if (input) {
      input.click() /* For mobile users */
      input.focus() /* For pc users */
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    let session = this.props.session
    let formData = this.state.formData
    formData['contact_id'] = this.props.contactData.lastname
    /* validation - edit */
    // let phoneRegex = /^[0-9]{1,255}$/g
    // let error = 0
    // if (formData.lastname === '') {
    //   error++
    //   this.addError('lastname', 'Vui lòng không để trống')
    // }
    // if (formData.mobile && !formData.mobile.match(phoneRegex)) {
    //   error++
    //   this.addError('cf_mobile', 'Vui lòng nhập đúng định dạng')
    // }
    // if (formData.phone && !formData.phone.match(phoneRegex)) {
    //   error++
    //   this.addError('cf_phone', 'Vui lòng nhập đúng định dạng')
    // }
    // if (formData.cf_pot_nganh_hang && formData.cf_pot_nganh_hang === {}) {
    //   error++
    //   this.addError('cf_pot_nganh_hang', 'Vui lòng không để trống')
    // }
    // if (formData.cf_pot_khu_vuc && formData.cf_pot_khu_vuc === {}) {
    //   error++
    //   this.addError('cf_pot_khu_vuc', 'Vui lòng không để trống')
    // }
    // if (formData.leadsource && formData.leadsource === {}) {
    //   error++
    //   this.addError('leadsource', 'Vui lòng không để trống')
    // }
    // let websiteRegex = /[^a-zA-Z0-9]/g
    // if (formData.website && websiteRegex.test(formData.website)) {
    //   error++
    //   this.addError('website', 'Vui lòng không nhập khoảng trắng và kí tự đặc biệt')
    // }
    // if (error > 0) {
    //   toast.error('Vui lòng hoàn thiện các trường chưa đúng', {
    //     autoClose: 1500,
    //     draggable: false
    //   })
    //   return false
    // }
    // this.props.actions.requestSaveOpportunity({ session, data: formData })
    console.log(formData)
  }

  componentWillMount() {
    let { currentUser } = this.props
    let session = null
    if (currentUser) session = currentUser.session
    if (_.isEmpty(session)) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.setState({ session: session })
    let record = this.state.record
    this.props.actions.fetchContactRecord({ session, record })
  }

  handleChange(e) {
    const { name, value } = e.target
    let data = this.state.formData
    data[name] = value
    // this.clearError(name)
    this.setState({ formData: data })
    // this.addChangeToURL()
  }

  onSelectChange(name, value) {
    let data = this.state.formData
    data[name] = value
    // this.clearError(name)
    if (name === 'cf_city') {
      data.cf_state = undefined
      this.setState({ formData: data, currentCity: value, currentState: null, cityChanged: true })
    } else if (name === 'cf_state') {
      this.setState({ formData: data, currentState: value })
    }
    this.setState({ formData: data })
    // this.addChangeToURL()
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
        toast.success('Success', {
          autoClose: 2000,
          draggable: false
        })
        return pathBack ? (<Redirect to={'/' + pathBack}/>) : (
          <Redirect to={'/contact-view/' + this.props.contactData.record}/>)
      } else {
        let contactData = this.props.contactData
        let currentCity = this.state.currentCity ? this.state.currentCity : contactData.cf_city
        let currentState = this.state.cityChanged ? this.state.currentState : contactData.cf_state
        let cityOptions = this.props.cities
        let mapCityStateOptions = this.props.mapCityState
        let filterStateOptions = []
        if (currentCity && currentCity.value) {
          filterStateOptions = mapCityStateOptions.filter((map) => map.city === currentCity.value)[0].states
        } else {
          filterStateOptions = []
        }
        let assignedUserId = contactData.assigned_user_id
        return (
          <div className="form-add-opt-container">
            <ExpandableFormComponent title="Thông tin cơ bản" expanded={true}>
              <div className="expandable-form-wrapper-field" id="potentialname-wrapper">
                <label className="expandable-form-label-field">Cơ hội <span className="require-field"> *</span></label>
                <input name="potentialname" type="text" className="expandable-form-input-field"
                       defaultValue="Hợp đồng phần mềm" disabled
                       style={{ border: 'none', marginBottom: '0' }}/>
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
                      'label': 'Xác nhận',
                      'value': 'Xác nhận'
                    },
                    {
                      'label': 'Từ chối',
                      'value': 'Từ chối'
                    }
                  ]}
                  onChange={() => {
                    return false
                  }}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
                <label className="expandable-form-label-field">
                  Tình trạng <span className="require-field"> *</span>
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  defaultValue={contactData.cf_887}
                  loadOptions={this.fetchContactStatus}
                  placeholder="Tình trạng"
                  onChange={this.onSelectChange.bind(this, 'sales_stage')}
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="lastname-wrapper">
                <label className="expandable-form-label-field">Họ tên khách hàng</label>
                <input name="lastname" type="text" className="expandable-form-input-field"
                       value={this.props.contactData.lastname} disabled
                       style={{ border: 'none', marginBottom: '0' }}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Tên gian hàng </label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập tên gian hàng"/>
              </div>
              <div className="expandable-form-wrapper-field" id="customer_type-wrapper">
                <label className="expandable-form-label-field">
                  Loại khách <span className="require-field"> *</span>
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  defaultValue={{ 'label': 'Cá nhân', 'value': 'Cá nhân' }}
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
                  onChange={() => {
                    return false
                  }}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label className="expandable-form-label-field">Ngày sinh </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}
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
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Số CMT/MST </label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập CMT/MST"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label className="expandable-form-label-field">Ngày cấp </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="description-wrapper">
                <label className="expandable-form-label-field">Mô tả chung về khách hàng </label>
                <textarea name="description" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập mô tả chung về khách hàng"/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin liên hệ">
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Số điện thoại <span
                  className="require-field"> *</span></label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập số điện thoại" defaultValue={contactData.mobile}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ chi tiết <span
                  className="require-field"> *</span></label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ chi tiết" defaultValue={contactData.cf_contact_street}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Primary Email <span
                  className="require-field"> *</span></label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ email" defaultValue={contactData.email}/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
              <div className="expandable-form-wrapper-field" id="description-wrapper">
                <label className="expandable-form-label-field">Mô tả nguồn khách hàng </label>
                <textarea name="description" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập mô tả nguồn khách hàng"/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin hợp đồng">
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Số hợp đồng</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập số hợp đồng"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Mã khuyến mãi</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập mã khuyến mãi"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Người đại diện</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập người đại diện"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
                <label className="expandable-form-label-field">
                  Gói hợp đồng
                </label>
                <AsyncSelect
                  classNamePrefix="expandable-form-react-select"
                  cacheOptions
                  defaultOptions
                  loadOptions={this.fetchListGoiHD}
                  placeholder="Lựa chọn gói"
                  onChange={this.onSelectChange.bind(this, 'cf_pot_goihd')}
                  isSearchable={true}
                />
              </div>
              <div className="row-col-2">
                <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                  <label className="expandable-form-label-field">Ngày bắt đầu </label>
                  <div className="expandable-form-input-date-wrapper">
                    <input name="cf_contact_website" type="date" className="expandable-form-input-field"
                           style={{ width: '88%' }}/>
                    <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
                  </div>
                </div>
                <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                  <label className="expandable-form-label-field">Ngày kết thúc </label>
                  <div className="expandable-form-input-date-wrapper">
                    <input name="cf_contact_website" type="date" className="expandable-form-input-field"
                           style={{ width: '88%' }}/>
                    <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
                  </div>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Thời hạn (số tháng)</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập thời hạn"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Khuyến mãi (số tháng)</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập khuyến mãi"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
                  isSearchable={true}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Thanh toán</label>
                <span className="input-vnd-unit">
              <input name="cf_contact_website" type="text" className="expandable-form-input-field"
                     placeholder="Nhập số tiền thanh toán" defaultValue="0"/>
            </span>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label className="expandable-form-label-field">Ngày kí hợp đồng </label>
                <div className="expandable-form-input-date-wrapper">
                  <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
                  <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Số lượng cửa hàng</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập số lượng cửa hàng"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Địa chỉ chi nhánh</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"
                       placeholder="Nhập địa chỉ chi nhánh"/>
              </div>
              <div className="expandable-form-wrapper-field" id="description-wrapper">
                <label className="expandable-form-label-field">Ghi chú </label>
                <textarea name="description" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập ghi chú"/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Thông tin CSKH">
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
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
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
                <label className="expandable-form-label-field">
                  Gọi CSKH
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  defaultValue={{ label: 'Chưa gọi', value: 'Chưa gọi' }}
                  options={[
                    {
                      "label": "Chưa gọi",
                      "value": "Chưa gọi"
                    },
                    {
                      "label": "Đã gọi",
                      "value": "Đã gọi"
                    }
                  ]
                  }
                />
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
                <label className="expandable-form-label-field">
                  Đánh giá
                </label>
                <Select
                  classNamePrefix="expandable-form-react-select"
                  isSearchable={false}
                  placeholder="Chọn đánh giá"
                  options={[
                    {
                      "label": "Rất quan tâm",
                      "value": "Rất quan tâm"
                    },
                    {
                      "label": "Quan tâm",
                      "value": "Quan tâm"
                    },
                    {
                      "label": "Ít quan tâm",
                      "value": "Ít quan tâm"
                    }
                  ]}
                />
              </div>
              <div className="expandable-form-wrapper-field" id="description-wrapper">
                <label className="expandable-form-label-field">Phản hồi CSKH </label>
                <textarea name="description" className="expandable-form-input-field" rows="5"
                          placeholder="Nhập phản hồi CSKH"/>
              </div>
            </ExpandableFormComponent>
            <ExpandableFormComponent title="Câu hỏi thường gặp">
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Tình hình kinh doanh hiện nay của khách hàng ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Hình thức công cụ quản lý hiện nay ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Tính năng của Kiot Việt là yếu tố quyết định ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Điểm yếu nào của Kiot Việt khiến khách hàng cân nhắc ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Khó khăn khách hàng đang gặp phải ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Tính chủ động của khách hàng ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Yếu tố nào ngăn cản khách hàng quyết định ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
                <label
                  className="expandable-form-label-field">Đối thủ nào đã tiếp cận khách hàng ?</label>
                <input name="cf_contact_website" type="text"
                       className="expandable-form-input-field"/>
              </div>
            </ExpandableFormComponent>
            <button className="create-opt-button" onClick={this.handleSubmit}>Tạo</button>
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
)(OptPhanMemComponent)
