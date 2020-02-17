import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID: 'OPPORTUNITY/FETCH',
  GET_OPPORTUNITY_SUCCESS: 'OPPORTUNITY/FETCH_SUCCESS',
  GET_OPPORTUNITY_FAILED: 'OPPORTUNITY/FETCH_FAILED',
  SEND_REQUEST_SAVE_RECORD: 'OPPORTUNITY/SAVE_RECORD',
  SAVE_RECORD_SUCCESS: 'OPPORTUNITY/SAVE_RECORD_SUCCESS',
  SAVE_RECORD_FAILED: 'OPPORTUNITY/SAVE_RECORD_FAILED',
  SHOW_FORM_ADD_OPPORTUNITY: 'SHOW_FORM_ADD_OPPORTUNITY',
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'opportunity.loading') || false
export const getFormSubmittingStatus = state => _.get(state, 'opportunity.formSubmittingStatus') || false
export const getOpportunityData = state => _.get(state, 'opportunity.data') || {}
export const getFormSubmitResponseStatus = state => _.get(state, 'opportunity.formSubmitResponseStatus')
export const getCurrentOption = state => _.get(state, 'opportunity.option')

/* Initial state */
const initialState = {
  loading: false,
  data: {},
  formSubmitResponseStatus: false,
  formSubmittingStatus: false,
  option: undefined
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      return state
    case types.GET_OPPORTUNITY_SUCCESS:
      state['loading'] = false
      state['formSubmitResponseStatus'] = false
      let data = {}
      let result = _.get(action, 'payload')
      data.potentialname = result.potentialname
      data.sales_stage = result.sales_stage
      data.cf_pot_website = result.cf_pot_website
      data.cf_mobile = result.cf_mobile
      data.mobile = result.mobile
      data.cf_pot_nganh_hang = result.cf_pot_nganh_hang
      data.cf_pot_khu_vuc = result.cf_pot_khu_vuc
      data.leadsource = result.leadsource
      data.assigned_user_id = result.assigned_user_id
      data.description = result.description
      data.record = result.id
      state['data'] = data
      return state
    case types.GET_OPPORTUNITY_FAILED:
      state['loading'] = false
      return state
    case types.SEND_REQUEST_SAVE_RECORD:
      state['option'] = _.get(action, 'payload.option')
      state['loading'] = true
      state['formSubmittingStatus'] = true
      state['formSubmitResponseStatus'] = false
      return state
    case types.SAVE_RECORD_SUCCESS:
      state['loading'] = false
      state['formSubmittingStatus'] = false
      let newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['formSubmitResponseStatus'] = true
      state['data'] = newState
      return state
    case types.SAVE_RECORD_FAILED:
      state['loading'] = true
      state['formSubmittingStatus'] = false
      state['formSubmitResponseStatus'] = false
      return state
    case types.SHOW_FORM_ADD_OPPORTUNITY:
      state = initialState
      state['option'] = _.get(action, 'payload.option')
      return state
    default:
      return state
  }
}


/* Action creators */
export const fetchOpportunityRecord = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID, payload })
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
          return dispatch(fetchOpportunitySuccess(result))
        }
        else {
          let error = response.data.error
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
          return dispatch(fetchOpportunityFailed(error))
        }
      })
      .catch(err => {
        console.log(err)
        return dispatch(fetchOpportunitySuccess(err))
      })
  }
}

export const requestSaveOpportunity = payload => {
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
    bodyFormData.append("module", 'Potentials')
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
          return dispatch(saveOpportunitySuccess(data))
        }
        else {
          console.log(response.data)
          return dispatch(saveOpportunityFailed(response.data))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(saveOpportunityFailed(err))
      })

  }
}
export const showFormAddOpportunity = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SHOW_FORM_ADD_OPPORTUNITY, payload })
  }
}



/* Action declaration */
export const fetchOpportunitySuccess = payload => ({
  type: types.GET_OPPORTUNITY_SUCCESS,
  payload
})

export const fetchOpportunityFailed = payload => ({
  type: types.GET_OPPORTUNITY_FAILED,
  payload
})

export const saveOpportunitySuccess = payload => ({
  type: types.SAVE_RECORD_SUCCESS,
  payload
})

export const saveOpportunityFailed = payload => ({
  type: types.SAVE_RECORD_FAILED,
  payload
})
