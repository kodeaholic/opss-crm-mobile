import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID: 'LEAD/FETCH',
  GET_LEAD_SUCCESS: 'LEAD/FETCH_SUCCESS',
  GET_LEAD_FAILED: 'LEAD/FETCH_FAILED',
  SEND_REQUEST_SAVE_RECORD: 'LEAD/SAVE_RECORD',
  SAVE_RECORD_SUCCESS: 'LEAD/SAVE_RECORD_SUCCESS',
  SAVE_RECORD_FAILED: 'LEAD/SAVE_RECORD_FAILED',
  SHOW_FORM_ADD_LEAD: 'SHOW_FORM_ADD_LEAD',
  SHOW_FORM_ADD_LEAD_SUCCESS: 'SHOW_FORM_ADD_LEAD_SUCCESS',
  SHOW_FORM_ADD_LEAD_FAILED: 'SHOW_FORM_ADD_LEAD_FAILED',
  SEND_REQUEST_CONVERT_LEAD: 'LEAD/REQUEST_CONVERT',
  CONVERT_LEAD_SUCCESS: 'LEAD/CONVERT_LEAD_SUCCESS',
  CONVERT_LEAD_FAILED: 'LEAD/CONVERT_LEAD_FAILED'
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'lead.loading') || false
export const getCurrentOption = state => _.get(state, 'lead.option') || undefined
export const getLeadData = state => _.get(state, 'lead.data') || {}
export const getFormSubmitResponseStatus = state => _.get(state, 'lead.formSubmitResponseStatus')
export const getViewPermission = state => _.get(state, 'lead.view_permission')
export const getPhoneExists = state => _.get(state, 'lead.phoneExists') || undefined
export const getErrorMsg = state => _.get(state, 'lead.errorMsg') || undefined
export const getCities = state => _.get(state, 'lead.cities') || []
export const getMapCityState = state => _.get(state, 'lead.mapCityState') || undefined

/* Initial state */
const initialState = {
  option: undefined, /* view, create, or update */
  loading: false,
  data: {
    defaultAssignedUser: {},
    phoneExists: undefined
  },
  formSubmitResponseStatus: undefined,
  view_permission: undefined,
  errorMsg: undefined,
  cities: [],
  mapCityState: []
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      state['formSubmitResponseStatus'] = undefined
      state['view_permission'] = undefined
      return state
    case types.SEND_REQUEST_CONVERT_LEAD:
      option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      state['formSubmitResponseStatus'] = undefined
      state['view_permission'] = undefined
      return state
    case types.GET_LEAD_SUCCESS:
      state['loading'] = false
      state['formSubmitResponseStatus'] = undefined
      state['view_permission'] = undefined
      let data = {}
      let result = _.get(action, 'payload')
      data.lastname = result.lastname
      data.leadstatus = result.leadstatus
      data.website = result.website
      data.phone = result.phone
      data.mobile = result.mobile
      data.industry = result.industry
      data.cf_lead_khu_vuc = result.cf_lead_khu_vuc
      data.leadsource = result.leadsource
      data.assigned_user_id = result.assigned_user_id
      data.description = result.description
      data.allowed_to_edit_lead_source = result.allowed_to_edit_lead_source
      data.allowed_to_edit_lead = result.allowed_to_edit_lead
      data.lane = result.lane
      data.record = result.id
      data['city'] = result.city ? {label: result.city, value: result.city} : {label: "Hà Nội", value: "Hà Nội"}
      data['state'] = result.state ? {label: result.state, value: result.state} : {label: "Ba Đình", value: "Ba Đình"}
      /*additional info for converting lead*/
      if (state['option'] === 'convert') {
        data['email'] = result.email
        data['cf_city'] = result.city ? {label: result.city, value: result.city} : {label: "Hà Nội", value: "Hà Nội"}
        data['cf_state'] = result.state ? {label: result.state, value: result.state} : {label: "Ba Đình", value: "Ba Đình"}
        data['potentialname'] = result.potentialname ? {label: result.potentialname, value: result.potentialname} : {label: "Hợp đồng phần mềm", value: "Hợp đồng phần mềm"}
        data['industry'] = result.industry ? result.industry : {label: "Thời trang", value: "77"}
        data['cf_pot_khu_vuc'] = result.cf_lead_khu_vuc ? result.cf_lead_khu_vuc : {label: "Hà Nội", value: "10"}
        data['customer_type'] = result.customer_type ? {label: result.customer_type, value: result.customer_type} : {label: "Cá nhân", value: "Cá nhân"}
        data['cf_contact_street'] = result.lane
        data['cities'] = result.cities
        data['mapCityState'] = result.mapCityState
        data['phoneExists'] = result.phoneExists
      }
      state['data'] = data
      state['cities'] = result.cities
      state['mapCityState'] = result.mapCityState
      return state
    case types.GET_LEAD_FAILED:
      state['loading'] = false
      state['view_permission'] = _.get(action, 'payload')
      return state
    case types.SEND_REQUEST_SAVE_RECORD:
      state['loading'] = true
      state['formSubmitResponseStatus'] = undefined
      state['view_permission'] = undefined
      return state
    case types.SAVE_RECORD_SUCCESS:
      state['view_permission'] = undefined
      state['loading'] = false
      let newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['formSubmitResponseStatus'] = 'success'
      state['data'] = newState
      return state
    case types.SAVE_RECORD_FAILED:
      state['view_permission'] = undefined
      state['loading'] = false
      state['formSubmitResponseStatus'] = 'failed'
      return state
    case types.SHOW_FORM_ADD_LEAD:
      state['view_permission'] = undefined
      state = initialState
      state['option'] = _.get(action, 'payload.option')
      state['data'] = {defaultAssignedUser: _.get(action, 'payload.defaultAssignedUser')}
      state['loading'] = false
      state['formSubmitResponseStatus'] = undefined
      return state
    case types.CONVERT_LEAD_SUCCESS:
      state['loading'] = false
      newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['data'] = newState
      state['formSubmitResponseStatus'] = 'success'
      return state
    case types.CONVERT_LEAD_FAILED:
      state['loading'] = false
      let response = _.get(action, 'payload')
      let errorMsg = _.get(response, 'error.message')
      state['errorMsg'] = errorMsg
      state['formSubmitResponseStatus'] = 'failed'
      return state
    case types.SHOW_FORM_ADD_LEAD_SUCCESS:
      state['loading'] = false
      let cities = _.get(action, 'payload.cities')
      let mapCityState = _.get(action, 'payload.mapCityState')
      state['cities'] = cities
      state['mapCityState'] = mapCityState
      return state
    default:
      return state
  }
}


/* Action creators */
export const fetchLeadRecord = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID, payload })
    const bodyFormData = new FormData()
    const { session, record } = payload

    bodyFormData.append('_operation', 'fetchRecord')
    bodyFormData.append('_session', session)
    bodyFormData.append('record', record)

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
          return dispatch(fetchLeadSuccess(result))
        }
        else {
          let error = response.data.error
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
          return dispatch(fetchLeadFailed(error))
        }
      })
      .catch(err => {
        console.log(err)
        return dispatch(fetchLeadSuccess(err))
      })
  }
}

export const requestSaveLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_SAVE_RECORD, payload })
    let {session, data} = payload
    let formData = {...data} /* clone */
    if (formData.industry) formData.industry = formData.industry.value
    if (formData.leadsource) formData.leadsource = formData.leadsource.value
    if (formData.assigned_user_id) formData.assigned_user_id = formData.assigned_user_id.value
    if (formData.leadstatus) formData.leadstatus = formData.leadstatus.value
    if (formData.cf_lead_khu_vuc) formData.cf_lead_khu_vuc = formData.cf_lead_khu_vuc.value
    const bodyFormData = new FormData()
    bodyFormData.append("_operation", 'saveRecord')
    bodyFormData.append("_session", session)
    bodyFormData.append("module", 'Leads')
    if (data.record) bodyFormData.append("record", formData.record)
    bodyFormData.append("values", JSON.stringify(formData))
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
          let record = _.get(result, 'record_id')
          if (record) data["record"] = record
          return dispatch(saveLeadSuccess(data))
        }
        else {
          console.log(response.data)
          return dispatch(saveLeadFailed(response.data))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(saveLeadFailed(err))
      })

  }
}
export const requestConvertLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_CONVERT_LEAD, payload })
    let {session, data, option} = payload
    let formData = {...data}
    if (formData.cf_pot_khu_vuc) formData.cf_pot_khu_vuc = formData.cf_pot_khu_vuc.value
    if (formData.potentialname) formData.potentialname = formData.potentialname.value
    if (formData.cf_pot_nganh_hang) formData.cf_pot_nganh_hang = formData.cf_pot_nganh_hang.value
    if (formData.customer_type) formData.customer_type = formData.customer_type.value
    if (formData.cf_city) formData.cf_city = formData.cf_city.value
    if (formData.cf_state) formData.cf_state = formData.cf_state.value
    if (formData.cf_pot_industry) formData.cf_pot_industry = formData.cf_pot_industry.value
    if (formData.assigned_user_id) {
      let assigned_user_id = formData.assigned_user_id.value
      formData.assigned_user_id = assigned_user_id.split('x')[1]
    }
    const bodyFormData = new FormData()
    bodyFormData.append("_operation", 'convertLead')
    bodyFormData.append("_session", session)
    let values = JSON.stringify(formData)
    bodyFormData.append("values", values)
    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    return request
      .then(response => {
        const { success, result } = response.data
        console.log(response.data)
        if (success) {
          let record = _.get(result, 'record_id')
          if (record) data["record"] = record
          return dispatch(convertLeadSuccess(data))
        }
        else {
          // console.log(response.data)
          // {
          //   "success": false,
          //   "error": {
          //   "code": 1501,
          //     "message": "Values cannot be empty!"
          // }
          // }
          return dispatch(convertLeadFailed(response.data))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(convertLeadFailed(err))
      })

  }
}
export const showFormAddLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SHOW_FORM_ADD_LEAD, payload })
    const bodyFormData = new FormData()
    const { session } = payload

    bodyFormData.append('_operation', 'describe')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })

    return request
      .then(response => {
        const { success, result } = response.data
        let {cities, mapCityState} = response.data
        if (success) {
          return dispatch(fetchCitiesSuccess(result, cities, mapCityState))
        }
        else {
          let error = response.data.error
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
          return dispatch(fetchCitiesFailed(error))
        }
      })
      .catch(err => {
        console.log(err)
        return dispatch(fetchCitiesFailed(err))
      })
  }
}



/* Action declaration */
export const fetchLeadSuccess = payload => ({
  type: types.GET_LEAD_SUCCESS,
  payload
})

export const fetchLeadFailed = payload => ({
  type: types.GET_LEAD_FAILED,
  payload
})

export const saveLeadSuccess = payload => ({
  type: types.SAVE_RECORD_SUCCESS,
  payload
})

export const saveLeadFailed = payload => ({
  type: types.SAVE_RECORD_FAILED,
  payload
})
export const convertLeadSuccess = payload => ({
  type: types.CONVERT_LEAD_SUCCESS,
  payload
})
export const convertLeadFailed = payload => ({
  type: types.CONVERT_LEAD_FAILED,
  payload
})

export const fetchCitiesSuccess = payload => ({
  type: types.SHOW_FORM_ADD_LEAD_SUCCESS,
  payload
})
export const fetchCitiesFailed = payload => ({
  type: types.SHOW_FORM_ADD_LEAD_FAILED,
  payload
})