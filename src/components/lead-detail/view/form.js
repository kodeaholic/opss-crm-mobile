import React, { Component } from 'react'
import _ from 'lodash'
import { Link, Redirect, withRouter } from 'react-router-dom'

/* Form components */
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

/* CSS */
import './form.css'
import axios from 'axios'
import { toast } from 'react-toastify'

class LeadForm extends Component {
  constructor(props) {
    super(props)
    let initialFormData = {
      record: props.data.record
    }
    if (props.option === 'create') {
      initialFormData['leadstatus'] = {
        'label': 'Mới tạo',
        'value': 'New'
      }
    }
    this.state = {
      formData: initialFormData
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.fetchIndustries = this.fetchIndustries.bind(this)
    this.fetchLeadSources = this.fetchLeadSources.bind(this)
    this.fetchRegions = this.fetchRegions.bind(this)
    this.fetchLeadStatus = this.fetchLeadStatus.bind(this)
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
    if (!this.props.allowedToEditLead && this.props.option === 'edit') {
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
    if (this.props.option === 'edit') {
      let mobile = formData.mobile
      let phone = formData.phone
      let lastname = formData.lastname
      if (lastname === '') return this.addError('lastname', 'Required')
      if (mobile !== undefined && (!mobile.match(phoneRegex) || _.isEmpty(mobile))) {
        error++
        this.addError('mobile', 'Invalid')
      }
      if (!_.isEmpty(phone) && !phone.match(phoneRegex)) {
        error++
        this.addError('phone', 'Invalid')
      }
    } else if (this.props.option === 'create') {
      if (_.isEmpty(formData.lastname)) {
        error++
        this.addError('lastname', 'Required')
      }
      if (_.isEmpty(formData.leadstatus)) {
        error++
        this.addError('leadstatus', 'Required')
      }
      if (_.isEmpty(formData.mobile) || !formData.mobile.match(phoneRegex)) {
        error++
        this.addError('mobile', 'Invalid')
      }
      if (!_.isEmpty(formData.phone) && !formData.phone.match(phoneRegex)) {
        error++
        this.addError('phone', 'Invalid')
      }
      if (_.isEmpty(formData.industry)) {
        error++
        this.addError('industry', 'Required')
      }
      if (_.isEmpty(formData.cf_lead_khu_vuc)) {
        error++
        this.addError('cf_lead_khu_vuc', 'Required')
      }
      if (_.isEmpty(formData.leadsource)) {
        error++
        this.addError('leadsource', 'Required')
      }
    }

    if (error > 0) {
      toast.error('Vui lòng hoàn thiện các trường chưa đúng', {
        autoClose: 1500,
        draggable: false
      })
      return false
    }
    if (this.props.option === 'create') {
      if (!this.state.formData.assigned_user_id) formData.assigned_user_id = this.props.data.defaultAssignedUser
    }
    this.props.submit({ session, data: formData })
  }

  conditionalBack = () => {
    // CMB-81
    if (window.location.href.indexOf('form-changed') !== -1) {
      let r = window.confirm('Bạn có muốn rời đi?')
      if (r === true) {
        window.history.go(-2)
      } else {
        return false
      }
    } else {
      window.history.back()
    }
  }
  addChangeToURL = () => {
    // CMB-81
    let href = window.location.href
    if (href.indexOf('form-changed') === -1) window.location.href = href + '#form-changed'
  }
  removeChangeFromURL = () => {
    // CMB-81
    window.location.href = window.location.href.replace('#form-changed', '')
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
    this.setState({ formData: data })
    this.addChangeToURL()
  }

  renderButton = () => {
    /* create -> back to lead list */
    /* update -> back to lead-view */
    let pathToGoBack = '/lead'
    if (this.props.option === 'edit') {
      // back to view
      pathToGoBack += '-view/' + this.state.formData.record
    } else {
      pathToGoBack = '/lead'
    }
    return (
      <div className="wrapper-button-form-create-or-update">
        <div className="form-create-or-update-button">
          {/*<Link to={pathToGoBack}>*/}
          <button type="button" className="btn-add-new-lead" onClick={() => {
            // window.history.back()
            this.conditionalBack()
          }}>
            Back
          </button>
          {/*</Link>*/}
        </div>
        <div className="form-create-or-update-button">
          <button type="button" className="btn-add-new-lead" onClick={this.handleSubmit}>
            Lưu
          </button>
        </div>
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
    return this.getOptions('cf_lead_khu_vuc', inputValue)
  }
  fetchLeadStatus = (inputValue) => {
    return this.getOptions('leadstatus', inputValue)
  }

  renderForm = () => {
    let defaultAssignedUser = this.props.data.assigned_user_id
    if (!defaultAssignedUser) {
      // option = 'create'
      defaultAssignedUser = this.props.data.defaultAssignedUser
    }
    return (
      <div className="form-create-or-update-field">
        <Field label="Họ tên khách hàng" isRequired name="lastname" val={this.props.data.lastname}
               changeHandler={this.handleChange}/>
        <Field label="Tên gian hàng" name="website" val={this.props.data.website} changeHandler={this.handleChange}/>
        <div className="form-create-or-update-wrapper-field" id="leadstatus-wrapper">
          <label className="form-create-or-update-label-field">
            Tình trạng<span className="require-field"> (*)</span>
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            defaultValue={this.props.option === 'edit' ? this.props.data.leadstatus : {
              'label': 'Mới tạo',
              'value': 'New'
            }}
            loadOptions={this.fetchLeadStatus}
            placeholder="Tình trạng"
            onChange={this.onSelectChange.bind(this, 'leadstatus')}
            isSearchable={true}
          />
        </div>
        {this.props.allowedToEditPhone ? (
          <Field label="Số điện thoại" name="mobile" val={this.props.data.mobile} isRequired
                 changeHandler={this.handleChange} isReadOnly={!this.props.allowedToEditPhone}/>
        ) : ('')}
        {/*{this.props.allowedToEditPhone ? (*/}
        {/*  <Field label="Số điện thoại khác" name="phone" val={this.props.data.phone} changeHandler={this.handleChange} isReadOnly={!this.props.allowedToEditPhone}/>*/}
        {/*) : ('')}*/}
        <Field label="Số điện thoại khác" name="phone" val={this.props.data.phone} changeHandler={this.handleChange}/>
        <div className="form-create-or-update-wrapper-field" id="industry-wrapper">
          <label className="form-create-or-update-label-field">
            Ngành hàng<span className="require-field"> (*)</span>
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            defaultValue={this.props.data.industry}
            loadOptions={this.fetchIndustries}
            placeholder="Ngành hàng"
            onChange={this.onSelectChange.bind(this, 'industry')}
            isSearchable={true}
          />
        </div>
        <div className="form-create-or-update-wrapper-field" id="cf_lead_khu_vuc-wrapper">
          <label className="form-create-or-update-label-field">
            Khu vực<span className="require-field"> (*)</span>
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            defaultValue={this.props.data.cf_lead_khu_vuc}
            loadOptions={this.fetchRegions}
            placeholder="Khu vực"
            onChange={this.onSelectChange.bind(this, 'cf_lead_khu_vuc')}
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
        {this.renderButton()}
        {this.renderForm()}
      </div>
    )
  }
}

export default withRouter(LeadForm)

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
          {label} {isRequired ? (<span className="require-input-common-component"> (*)</span>) : null}
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
        {/*<label className="form-create-or-update-label-error">Không được để trống</label>*/}
        {/*<label className="form-create-or-update-label-error">Không đúng định dạng</label>*/}
      </div>
    )
  }
}
