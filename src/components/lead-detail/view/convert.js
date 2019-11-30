import React, { Component } from 'react'
import _ from 'lodash'
import { Link, Redirect, withRouter } from 'react-router-dom'

/* Form components */
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

/* CSS */
import './convert.css'
import axios from 'axios'
import { toast } from 'react-toastify'

class LeadConvertForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        record: _.get(props, 'data.record').split('x')[1],
        assigned_user_id: _.get(props, 'data.assigned_user_id'),
        lastname: _.get(props, 'data.lastname'),
        email: _.get(props, 'data.email'),
        cf_mobile: _.get(props, 'data.mobile'),
        cf_email: _.get(props, 'data.cf_email'),
        cf_pot_khu_vuc: _.get(props, 'data.cf_lead_khu_vuc'),
        potentialname: _.get(props, 'data.potentialname'),
        cf_pot_industry: _.get(props, 'data.industry'),
        customer_type: _.get(props, 'data.customer_type'),
        amount: _.get(props, 'data.amount'),
        cf_contact_street: _.get(props, 'data.cf_contact_street'),
        cf_city: _.get(props, 'data.cf_city'),
        cf_state: _.get(props, 'data.cf_state'),
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.fetchIndustries = this.fetchIndustries.bind(this)
    this.fetchRegions = this.fetchRegions.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.fetchCities = this.fetchCities.bind(this)
    this.fetchState = this.fetchState.bind(this)
  }

  addError = (name, content) => {
    if (!document.getElementById(name + '-error')) {
      let nameField = document.getElementById(name + '-wrapper')
      let error = document.createElement('label')
      error.setAttribute('class', 'form-convert-label-error')
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
    // if (!this.props.allowedToEditLead && this.props.option === 'edit') {
    //   toast.error('Permission denied', {
    //     autoClose: 1500,
    //     draggable: false
    //   })
    //   return false
    // }
    let session = this.props.session
    let formData = this.state.formData
    /* validation - edit */
    let phoneRegex = /^[0-9]{10,12}$/g
    let error = 0
    let mobile = formData.cf_mobile
    let lastname = formData.lastname
    if (lastname === '') return this.addError('lastname', 'Required')
    if (mobile !== undefined && (!mobile.match(phoneRegex) || _.isEmpty(mobile))) {
      error++
      this.addError('cf_mobile', 'Invalid')
    }
    if (_.isEmpty(formData.cf_email)) return this.addError('cf_email', 'Required')
    console.log(formData)
    if (error > 0) return false
    // this.props.submit({ session, data: formData })
  }

  handleChange(e) {
    const { name, value } = e.target
    let data = this.state.formData
    data[name] = value
    this.clearError(name)
    this.setState({ formData: data })
  }

  onSelectChange(name, value) {
    let data = this.state.formData
    data[name] = value
    this.clearError(name)
    this.setState({ formData: data })
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
      <div className="wrapper-button-form-convert">
        <div className="form-convert-button">
          {/*<Link to={pathToGoBack}>*/}
          <button type="button" className="btn-add-new-lead" onClick={() => {
            window.history.back()
          }}>
            Back
          </button>
          {/*</Link>*/}
        </div>
        <div className="form-convert-button">
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
    return this.getOptions('cf_pot_nganh_hang', inputValue)
  }
  fetchCities = (inputValue) => {
    return this.getOptions('cf_city', inputValue)
  }
  fetchState = (inputValue) => {
    return this.getOptions('cf_state', inputValue)
  }
  fetchPotentialName = (inputValue) => {
    return this.getOptions('potentialname', inputValue)
  }
  fetchUsers = (inputValue) => {
    return this.getOptions('users', inputValue)
  }
  fetchRegions = (inputValue) => {
    return this.getOptions('cf_pot_khu_vuc', inputValue)
  }
  fetchCustomerType = (inputValue) => {
    return this.getOptions('customer_type', inputValue)
  }
  renderForm = () => {
    let defaultAssignedUser = this.props.data.assigned_user_id
    if (!defaultAssignedUser) {
      // option = 'create'
      defaultAssignedUser = this.props.data.defaultAssignedUser
    }
    return (
      <div className="form-convert-field">
        <fieldset className="field-group">
          <legend><b>Contact</b></legend>
          <Field label="Họ tên khách hàng" isRequired name="lastname" val={this.props.data.lastname}
                 changeHandler={this.handleChange}/>
          <Field label="Email" name="email" val={this.props.data.email} changeHandler={this.handleChange}/>
        </fieldset>
        <fieldset className="field-group">
          <legend><b>Opportunity</b></legend>
          <Field label="Số điện thoại" name="cf_mobile" val={this.props.data.mobile} isRequired
                 changeHandler={this.handleChange}/>
          <Field label="Primary Email" name="cf_email" val={this.props.data.cf_email} changeHandler={this.handleChange}
                 isRequired/>
          <div className="form-convert-wrapper-field" id="cf_pot_khu_vuc-wrapper">
            <label className="form-convert-label-field">
              Khu vực<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.cf_lead_khu_vuc}
              loadOptions={this.fetchRegions}
              placeholder="Khu vực"
              onChange={this.onSelectChange.bind(this, 'cf_pot_khu_vuc')}
              isSearchable={true}
            />
          </div>
          <div className="form-convert-wrapper-field" id="potentialname-wrapper">
            <label className="form-convert-label-field">
              Cơ hội<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.potentialname}
              loadOptions={this.fetchPotentialName}
              placeholder="Loại hợp đồng"
              onChange={this.onSelectChange.bind(this, 'potentialname')}
              isSearchable={true}
            />
          </div>
          <div className="form-convert-wrapper-field" id="cf_pot_nganh_hang-wrapper">
            <label className="form-convert-label-field">
              Ngành hàng<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.industry}
              loadOptions={this.fetchIndustries}
              placeholder="Ngành hàng"
              onChange={this.onSelectChange.bind(this, 'cf_pot_nganh_hang')}
              isSearchable={true}
            />
          </div>
          <div className="form-convert-wrapper-field" id="customer_type-wrapper">
            <label className="form-convert-label-field">
              Loại khách<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.customer_type}
              loadOptions={this.fetchCustomerType}
              placeholder="Loại khách"
              onChange={this.onSelectChange.bind(this, 'customer_type')}
              isSearchable={true}
            />
          </div>
          <Field label="Thành tiền" name="amount" val="" changeHandler={this.handleChange}/>
          <Field label="Địa chỉ chi tiết" name="cf_contact_street" val={this.props.data.cf_contact_street} isMultiLine={true}
                 changeHandler={this.handleChange} isRequired/>
          <div className="form-convert-wrapper-field" id="cf_city-wrapper">
            <label className="form-convert-label-field">
              Tỉnh/Thành phố<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.cf_city}
              loadOptions={this.fetchCities}
              placeholder="Tỉnh/Thành phố"
              onChange={this.onSelectChange.bind(this, 'cf_city')}
              isSearchable={true}
            />
          </div>
          <div className="form-convert-wrapper-field" id="state-wrapper">
            <label className="form-convert-label-field">
              Quận/ Huyện<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.cf_state}
              loadOptions={this.fetchCities}
              placeholder="Quận/ Huyện"
              onChange={this.onSelectChange.bind(this, 'cf_state')}
              isSearchable={true}
            />
          </div>
          <div className="form-convert-wrapper-field" id="assigned_user_id-wrapper">
            <label className="form-convert-label-field">
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
        </fieldset>
      </div>
    )
  }

  render() {
    return (
      <div className="container-form-convert">
        {this.renderButton()}
        {this.renderForm()}
      </div>
    )
  }
}

export default withRouter(LeadConvertForm)

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
      <div className="form-convert-wrapper-field" id={this.props.name + '-wrapper'}>
        <label className="form-convert-label-field">
          {label} {isRequired ? (<span className="require-input-common-component"> (*)</span>) : null}
        </label>
        {
          isMultiLine ? (<textarea
              name={name}
              className="form-convert-input-field"
              rows="5" defaultValue={value}
              onChange={handler}/>) :
            (<input
              name={name}
              type="text"
              className="form-convert-input-field"
              defaultValue={value}
              onChange={handler}
              readOnly={readOnly}/>)
        }
      </div>
    )
  }
}
