import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './sessionDuck'

export const types = {
  SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID: 'LEAD/FETCH',
  GET_LEAD_SUCCESS: 'LEAD/FETCH_SUCCESS',
  GET_LEAD_FAILED: 'LEAD/FETCH_FAILED',
  SEND_REQUEST_SAVE_RECORD: 'LEAD/SAVE_RECORD',
  SAVE_RECORD_SUCCESS: 'LEAD/SAVE_RECORD_SUCCESS',
  SAVE_RECORD_FAILED: 'LEAD/SAVE_RECORD_FAILED',
  SHOW_FORM_ADD_LEAD: 'SHOW_FORM_ADD_LEAD',
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'lead.loading') || false
export const getCurrentOption = state => _.get(state, 'lead.option') || undefined
export const getLeadData = state => _.get(state, 'lead.data') || {}
export const getFormSubmitResponseStatus = state => _.get(state, 'lead.formSubmitResponseStatus')

/* Initial state */
const initialState = {
  option: undefined, /* view, create, or update */
  loading: false,
  data: {},
  formSubmitResponseStatus: false
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      return state
    case types.GET_LEAD_SUCCESS:
      state['loading'] = false
      state['formSubmitResponseStatus'] = false
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
      data.record = result.id
      state['data'] = data
      return state
    case types.GET_LEAD_FAILED:
      state['loading'] = false
      return state
    case types.SEND_REQUEST_SAVE_RECORD:
      state['loading'] = true
      state['formSubmitResponseStatus'] = false
      return state
    case types.SAVE_RECORD_SUCCESS:
      state['loading'] = false
      let newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['formSubmitResponseStatus'] = true
      state['data'] = newState
      return state
    case types.SAVE_RECORD_FAILED:
      state['loading'] = true
      state['formSubmitResponseStatus'] = false
      return state
    case types.SHOW_FORM_ADD_LEAD:
      state = initialState
      state['option'] = _.get(action, 'payload.option')
      state['data'] = {}
      state['loading'] = false
      state['formSubmitResponseStatus'] = false
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
export const showFormAddLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SHOW_FORM_ADD_LEAD, payload })
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