import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  SEND_REQUEST_GET_CONTACT_DETAIL_BY_RECORD_ID: 'CONTACT/FETCH',
  GET_CONTACT_SUCCESS: 'CONTACT/FETCH_SUCCESS',
  GET_CONTACT_FAILED: 'CONTACT/FETCH_FAILED',
  SEND_REQUEST_SAVE_CONTACT_RECORD: 'CONTACT/REQUEST_SAVE_RECORD',
  SAVE_CONTACT_RECORD_SUCCESS: 'CONTACT/SAVE_CONTACT_RECORD_SUCCESS',
  SAVE_CONTACT_RECORD_FAILED: 'CONTACT/SAVE_CONTACT_RECORD_FAILED',
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'contact.loading') || false
export const getCurrentOption = state => _.get(state, 'contact.option') || undefined
export const getContactData = state => _.get(state, 'contact.data') || {}
export const getFormSubmitResponseStatus = state => _.get(state, 'contact.formSubmitResponseStatus')
export const getCities = state => _.get(state, 'contact.cities') || []
export const getMapCityState = state => _.get(state, 'contact.mapCityState') || undefined

/* Initial state */
const initialState = {
  option: undefined, /* view, update */
  loading: false,
  data: {},
  formSubmitResponseStatus: false,
  cities: [],
  mapCityState: []
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_CONTACT_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      return state
    case types.GET_CONTACT_SUCCESS:
      state['loading'] = false
      state['formSubmitResponseStatus'] = false
      let data = {}
      let result = _.get(action, 'payload')
      data.lastname = result.lastname
      data.cf_887 = result.cf_887 //status
      data.cf_contact_website = result.cf_contact_website
      data.phone = result.phone
      data.mobile = result.mobile
      data.cf_contact_nganh_hang = result.cf_contact_nganh_hang
      data.cf_contact_khu_vuc = result.cf_contact_khu_vuc
      data.leadsource = result.leadsource
      data.assigned_user_id = result.assigned_user_id
      data.description = result.description
      data.record = result.id
      data.cf_contact_street = result.cf_contact_street
      data['cf_city'] = result.cf_city ? {label: result.cf_city, value: result.cf_city} : {label: "Hà Nội", value: "Hà Nội"}
      data['cf_state'] = result.cf_state ? {label: result.cf_state, value: result.cf_state} : {label: "Ba Đình", value: "Ba Đình"}
      data['allowed_to_edit_lead_source'] = result.allowed_to_edit_lead_source
      data['allowed_to_edit_contact'] = result.allowed_to_edit_contact
      data['allowed_to_edit_phone'] = result.allowed_to_edit_phone
      data['email'] = result.email
      state['cities'] = result.cities
      state['mapCityState'] = result.mapCityState
      state['data'] = data
      return state
    case types.GET_CONTACT_FAILED:
      state['loading'] = false
      return state
    case types.SEND_REQUEST_SAVE_CONTACT_RECORD:
      state['loading'] = true
      state['formSubmitResponseStatus'] = false
      return state
    case types.SAVE_CONTACT_RECORD_SUCCESS:
      state['loading'] = false
      let newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['formSubmitResponseStatus'] = true
      state['data'] = newState
      return state
    case types.SAVE_CONTACT_RECORD_FAILED:
      state['loading'] = true
      state['formSubmitResponseStatus'] = false
      return state
    default:
      return state
  }
}


/* Action creators */
export const fetchContactRecord = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_GET_CONTACT_DETAIL_BY_RECORD_ID, payload })
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
          return dispatch(fetchContactSuccess(result))
        }
        else {
          let error = response.data.error
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
          return dispatch(fetchContactFailed(error))
        }
      })
      .catch(err => {
        console.log(err)
        return dispatch(fetchContactFailed(err))
      })
  }
}

export const requestSaveContact = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_SAVE_CONTACT_RECORD, payload })
    let {session, data} = payload
    let formData = {...data} /* clone */
    if (formData.industry) formData.industry = formData.industry.value
    if (formData.assigned_user_id) formData.assigned_user_id = formData.assigned_user_id.value
    if (formData.cf_contact_khu_vuc) formData.cf_contact_khu_vuc = formData.cf_contact_khu_vuc.value
    if (formData.cf_city) formData.cf_city = formData.cf_city.value
    if (formData.cf_state) formData.cf_state = formData.cf_state.value
    if (formData.leadsource) formData.leadsource = formData.leadsource.value
    const bodyFormData = new FormData()
    bodyFormData.append("_operation", 'saveRecord')
    bodyFormData.append("_session", session)
    bodyFormData.append("record", formData.record)
    let jsonString = JSON.stringify(formData)
    bodyFormData.append("values", jsonString)
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
          return dispatch(saveContactSuccess(data))
        }
        else {
          console.log(response.data)
          return dispatch(saveContactFailed(response.data))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(saveContactFailed(err))
      })

  }
}

/* Action declaration */
export const fetchContactSuccess = payload => ({
  type: types.GET_CONTACT_SUCCESS,
  payload
})

export const fetchContactFailed = payload => ({
  type: types.GET_CONTACT_FAILED,
  payload
})

export const saveContactSuccess = payload => ({
  type: types.SAVE_CONTACT_RECORD_SUCCESS,
  payload
})

export const saveContactFailed = payload => ({
  type: types.SAVE_CONTACT_RECORD_FAILED,
  payload
})
