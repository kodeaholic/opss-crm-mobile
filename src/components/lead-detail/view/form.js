import React, { Component } from 'react'
import _ from 'lodash'
import { Link, Redirect, withRouter } from 'react-router-dom'

/* Form components */
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

/* CSS */
import './form.css'
import axios from 'axios'
import { toast } from 'react-toastify'
class LeadForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        record: props.data.record
      }
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
  handleSubmit(e) {
    e.preventDefault()
    if(!this.props.allowedToEditLead && this.props.option === 'edit') {
      toast.error("Permission denied", {
        autoClose: 1500,
        draggable: false,
      })
      return false
    }
    let session = this.props.session
    let formData = this.state.formData
    if(this.props.option === 'create') {
      if (!this.state.formData.assigned_user_id) formData.assigned_user_id = this.props.data.defaultAssignedUser
    }
    this.props.submit({session, data: formData})
  }
  handleChange(e) {
    const { name, value } = e.target
    let data = this.state.formData
    data[name] = value
    this.setState({ formData: data })
  }
  onSelectChange(name, value) {
    let data = this.state.formData
    data[name] = value
    this.setState({formData: data});
  }
  renderButton = () => {
    /* create -> back to lead list */
    /* update -> back to lead-view */
    let pathToGoBack = '/lead'
    if(this.props.option === 'edit') {
      // back to view
      pathToGoBack += '-view/' + this.state.formData.record
    }
    else {
      pathToGoBack = '/lead'
    }
    return (
      <div className="wrapper-button-form-create-or-update">
        <div className="form-create-or-update-button">
          <Link to={pathToGoBack}>
            <button type="button" className="btn-add-new-lead">
              Back
            </button>
          </Link>
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
        }
        else {
          return []
        }
      })
      .catch(err => {
        return []
      })
  };

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
          <Field label="Họ tên khách hàng" isRequired name="lastname" val={this.props.data.lastname} changeHandler={this.handleChange}/>
          <Field label="Tên gian hàng" name="website" val={this.props.data.website} changeHandler={this.handleChange}/>
          <div className="form-create-or-update-wrapper-field">
            <label className="form-create-or-update-label-field">
              Tình trạng<span className="require-field"> (*)</span>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              defaultValue={this.props.data.leadstatus}
              loadOptions={this.fetchLeadStatus}
              placeholder="Tình trạng"
              onChange={this.onSelectChange.bind(this, 'leadstatus')}
              isSearchable={true}
            />
          </div>
          {this.props.allowedToEditPhone ? (
            <Field label="Số điện thoại" name="mobile" val={this.props.data.mobile} isRequired changeHandler={this.handleChange} isReadOnly={!this.props.allowedToEditPhone}/>
          ) : ('')}
          {/*{this.props.allowedToEditPhone ? (*/}
          {/*  <Field label="Số điện thoại khác" name="phone" val={this.props.data.phone} changeHandler={this.handleChange} isReadOnly={!this.props.allowedToEditPhone}/>*/}
          {/*) : ('')}*/}
          <Field label="Số điện thoại khác" name="phone" val={this.props.data.phone} changeHandler={this.handleChange} />
          <div className="form-create-or-update-wrapper-field">
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
          <div className="form-create-or-update-wrapper-field">
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
          {this.props.data.allowed_to_edit_lead_source || this.props.option === 'create' ? (<div className="form-create-or-update-wrapper-field">
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
          <div className="form-create-or-update-wrapper-field">
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
          <Field label="Mô tả chung" name="description" val={this.props.data.description} isMultiLine={true} changeHandler={this.handleChange}/>
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
      <div className="form-create-or-update-wrapper-field">
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
      </div>
    )
  }
}
