import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

/* Form components */
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

/* CSS */
import './form.css'
import axios from 'axios'
import { toast } from 'react-toastify'

class ContactForm extends Component {
  constructor(props) {
    super(props)
    let initialFormData = {
      record: props.data.record
    }
    let city = _.get(props, 'data.cf_city') || undefined
    let state = _.get(props, 'data.cf_state') || undefined
    this.state = {
      formData: initialFormData,
      currentCity: city,
      currentState: state,
      cities: _.get(props, 'data.cities'),
      mapCityState: _.get(props, 'data.mapCityState')
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.fetchIndustries = this.fetchIndustries.bind(this)
    this.fetchLeadSources = this.fetchLeadSources.bind(this)
    this.fetchRegions = this.fetchRegions.bind(this)
    this.fetchContactStatus = this.fetchContactStatus.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
  }

  addError = (name, content) => {
    if (!document.getElementById(name + '-error')) {
      let nameField = document.getElementById(name + '-wrapper')
      let error = document.createElement('label')
      error.setAttribute('class', 'form-create-or-update-label-error')
      error.setAttribute('id', name + '-error')
      let node = document.createTextNode(content)
      error.appendChild(node)
      nameField.appendChild(error)
    }
    return false
  }
  clearError = (name) => {
    let labelError = document.getElementById(name + '-error')
    if (labelError) labelError.remove()
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.data.allowed_to_edit_contact && this.props.option === 'edit') {
      toast.error('Permission denied', {
        autoClose: 1500,
        draggable: false
      })
      return false
    }
    let session = this.props.session
    let formData = this.state.formData
    /* validation - edit */
    let phoneRegex = /^[0-9]{1,255}$/g
    let error = 0
    if (formData.lastname === '') {
      error++
      this.addError('lastname', 'Vui lòng không để trống')
    }
    if (formData.mobile && !formData.mobile.match(phoneRegex)) {
      error++
      this.addError('mobile', 'Vui lòng nhập đúng định dạng')
    }
    if (formData.phone && !formData.phone.match(phoneRegex)) {
      error++
      this.addError('phone', 'Vui lòng nhập đúng định dạng')
    }
    if (formData.cf_pot_nganh_hang && formData.cf_pot_nganh_hang === {}) {
      error++
      this.addError('cf_pot_nganh_hang', 'Vui lòng không để trống')
    }
    if (formData.cf_pot_khu_vuc && formData.cf_pot_khu_vuc === {}) {
      error++
      this.addError('cf_pot_khu_vuc', 'Vui lòng không để trống')
    }
    if (formData.leadsource && formData.leadsource === {}) {
      error++
      this.addError('leadsource', 'Vui lòng không để trống')
    }
    let websiteRegex = /[^a-zA-Z0-9]/g
    if (formData.website && websiteRegex.test(formData.website)) {
      error++
      this.addError('website', 'Vui lòng không nhập khoảng trắng và kí tự đặc biệt')
    }
    if (error > 0) {
      toast.error('Vui lòng hoàn thiện các trường chưa đúng', {
        autoClose: 1500,
        draggable: false
      })
      return false
    }
    this.props.submit({ session, data: formData })
  }

  addChangeToURL = () => {
    // CMB-81
    let href = window.location.href
    if (href.indexOf('form-changed') === -1) window.location.href = href + '#form-changed'
  }

  handleChange(e) {
    const { name, value } = e.target
    let data = this.state.formData
    data[name] = value
    this.clearError(name)
    this.setState({ formData: data })
    this.addChangeToURL()
  }

  onSelectChange(name, value) {
    let data = this.state.formData
    data[name] = value
    this.clearError(name)
    if (name === 'cf_city') {
      data.state = undefined
      this.setState({ formData: data, currentCity: value, currentState: null })
    } else if (name === 'cf_state') {
      this.setState({ formData: data, currentState: value })
    }
    this.setState({ formData: data })
    this.addChangeToURL()
  }

  renderSaveButton = () => {
    return (
      <div className="wrapper-save-btn">
        <button className="save-btn" onClick={this.handleSubmit}>
          Lưu
        </button>
      </div>
    )
  }
  /*
  * Fetch data from API for dropdown select
  */
  getOptions = (source, search) => {
    let session = this.props.session
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

  fetchIndustries = (inputValue) => {
    return this.getOptions('industry', inputValue)
  }
  fetchLeadSources = (inputValue) => {
    return this.getOptions('leadsource', inputValue)
  }
  fetchUsers = (inputValue) => {
    return this.getOptions('users', inputValue)
  }
  fetchRegions = (inputValue) => {
    return this.getOptions('cf_pot_khu_vuc', inputValue)
  }
  fetchContactStatus = (inputValue) => {
    return this.getOptions('contactstatus', inputValue)
  }

  renderForm = () => {
    let currentCity = this.state.currentCity
    let currentState = this.state.currentState
    let cityOptions = this.props.cities
    let mapCityStateOptions = this.props.mapCityState
    let filterStateOptions = []
    if (currentCity && currentCity.value) {
      filterStateOptions = mapCityStateOptions.filter((map) => map.city === currentCity.value)[0].states
    } else {
      filterStateOptions = []
    }
    let defaultAssignedUser = this.props.data.assigned_user_id
    if (!defaultAssignedUser) {
      // option = 'create'
      defaultAssignedUser = this.props.data.defaultAssignedUser
    }
    return (
      <div className="form-create-or-update-field">
        <Field label="Họ tên khách hàng" isRequired={true} name="lastname" val={this.props.data.lastname}
               changeHandler={this.handleChange}/>
        <Field label="Tên gian hàng" name="cf_contact_website" val={this.props.data.cf_contact_website} changeHandler={this.handleChange}/>
        {/*{*/}
        {/*  <div className="form-create-or-update-wrapper-field" id="cf_887-wrapper">*/}
        {/*    <label className="form-create-or-update-label-field">*/}
        {/*      Tình trạng*/}
        {/*    </label>*/}
        {/*    <Select*/}
        {/*      defaultValue={this.props.option === 'edit' ? this.props.data.cf_887 : {*/}
        {/*        'value': 'Sell',*/}
        {/*        'label': 'Bán hàng'*/}
        {/*      }}*/}
        {/*      placeholder="Tình trạng"*/}
        {/*      isDisabled={true}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*}*/}
        {this.props.data.allowed_to_edit_phone && <Field label="Số điện thoại" name="cf_mobile" val={this.props.data.mobile} isRequired={true}
               changeHandler={this.handleChange} />}

        {this.props.data.allowed_to_edit_lead_source && <div className="form-create-or-update-wrapper-field" id="cf_pot_industry-wrapper">
          <label className="form-create-or-update-label-field">
            Ngành hàng<span className="require-field"> (*)</span>
          </label>
          <Select
            defaultValue={this.props.data.cf_contact_nganh_hang}
            placeholder="Ngành hàng"
            isDisabled={true}
          />
        </div>}
        <div className="form-create-or-update-wrapper-field" id="cf_pot_khu_vuc-wrapper">
          <label className="form-create-or-update-label-field">
            Khu vực<span className="require-field"> (*)</span>
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            defaultValue={this.props.data.cf_contact_khu_vuc}
            loadOptions={this.fetchRegions}
            placeholder="Khu vực"
            onChange={this.onSelectChange.bind(this, 'cf_contact_khu_vuc')}
            isSearchable={true}
          />
        </div>
        {this.props.data.allowed_to_edit_lead_source || this.props.option === 'create' ? (
          <div className="form-create-or-update-wrapper-field" id="leadsource-wrapper">
            <label className="form-create-or-update-label-field">
              Nguồn khách hàng<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.leadsource}
              loadOptions={this.fetchLeadSources}
              placeholder="Nguồn khách hàng"
              onChange={this.onSelectChange.bind(this, 'leadsource')}
              isSearchable={true}
            />
          </div>) : ('')}
        <div className="form-convert-wrapper-field" id="cf_city-wrapper">
          <label className="form-convert-label-field">
            Tỉnh/Thành phố
          </label>
          <Select
            value={currentCity}
            options={cityOptions}
            placeholder="Tỉnh/ Thành phố"
            onChange={this.onSelectChange.bind(this, 'cf_city')}
            isSearchable={true}
          />
        </div>
        <div className="form-convert-wrapper-field" id="cf_state-wrapper">
          <label className="form-convert-label-field">
            Quận/ Huyện
          </label>
          <Select
            value={currentState}
            options={filterStateOptions}
            placeholder="Quận/ Huyện"
            onChange={this.onSelectChange.bind(this, 'cf_state')}
            isSearchable={true}
          />
        </div>
        <Field label="Địa chỉ chi tiết" name="cf_contact_street" val={this.props.data.cf_contact_street} changeHandler={this.handleChange}/>
        <div className="form-create-or-update-wrapper-field" id="assigned_user_id-wrapper">
          <label className="form-create-or-update-label-field">
            Người xử lý<span className="require-field"> (*)</span>
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            defaultValue={defaultAssignedUser}
            loadOptions={this.fetchUsers}
            placeholder="Người xử lý"
            onChange={this.onSelectChange.bind(this, 'assigned_user_id')}
            isSearchable={true}
          />
        </div>
        <Field label="Mô tả chung" name="description" val={this.props.data.description} isMultiLine={true}
               changeHandler={this.handleChange}/>
      </div>
    )
  }

  render() {
    return (
      <div className="container-form-create-or-update">
        {this.renderSaveButton()}
        {this.renderForm()}
      </div>
    )
  }
}

export default withRouter(ContactForm)

/* Child component */
class Field extends Component {
  /* Use for input/textarea rendering */

  render() {
    const label = _.get(this.props, 'label') || 'Field Name'
    const isMultiLine = _.get(this.props, 'isMultiLine') || false
    const value = this.props.val
    const readOnly = _.get(this.props, 'isReadOnly') || false
    const name = _.get(this.props, 'name')
    const isRequired = _.get(this.props, 'isRequired') || false
    const handler = _.get(this.props, 'changeHandler')
    return (
      <div className="form-create-or-update-wrapper-field" id={this.props.name + '-wrapper'}>
        <label className="form-create-or-update-label-field">
          {label} {isRequired ? (<span className="require-field"> (*)</span>) : null}
        </label>
        {
          isMultiLine ? (<textarea
              name={name}
              className="form-create-or-update-input-field"
              rows="5" defaultValue={value}
              onChange={handler}/>) :
            (<input
              name={name}
              type="text"
              className="form-create-or-update-input-field"
              defaultValue={value}
              onChange={handler}
              readOnly={readOnly}/>)
        }
      </div>
    )
  }
}
