import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './sessionDuck'

export const types = {
  SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID: 'LEAD/FETCH',
  GET_LEAD_SUCCESS: 'LEAD/FETCH_SUCCESS',
  GET_LEAD_FAILED: 'LEAD/FETCH_FAILED',
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'lead.loading') || false
export const getCurrentOption = state => _.get(state, 'lead.option') || undefined
export const getLeadData = state => _.get(state, 'lead.data') || {}

/* Initial state */
const initialState = {
  option: undefined, /* view, create, or update */
  loading: false,
  data: {}
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_LEAD_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || 'view'
      state['loading'] = true
      state['option'] = option
      return state
    case types.GET_LEAD_SUCCESS:
      state['loading'] = false
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
      state['data'] = data
      return state
    case types.GET_LEAD_FAILED:
      state['loading'] = false
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


/* Action declaration */
export const fetchLeadSuccess = payload => ({
  type: types.GET_LEAD_SUCCESS,
  payload
})

export const fetchLeadFailed = payload => ({
  type: types.GET_LEAD_FAILED,
  payload
})