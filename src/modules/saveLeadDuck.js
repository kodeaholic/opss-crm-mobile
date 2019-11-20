import axios from 'axios'
import _ from 'lodash'

export const types = {
  REQUEST_FETCH_DROPDOWN_DATA: 'SAVE_LEAD/REQUEST_FETCH_DROPDOWN_DATA',
  FETCH_DROPDOWN_DATA_SUCCESS: 'SAVE_LEAD/FETCH_DROPDOWN_DATA_SUCCESS',
  FETCH_DROPDOWN_DATA_FAILED: 'SAVE_LEAD/FETCH_DROPDOWN_DATA_FAILED',
  REQUEST_SAVE_LEAD: 'SAVE_LEAD/SEND_REQUEST_SAVE_LEAD',
  REQUEST_SAVE_LEAD_SUCCESS: 'SAVE_LEAD/REQUEST_SAVE_LEAD_SUCCESS',
  REQUEST_SAVE_LEAD_FAILED: 'SAVE_LEAD/REQUEST_SAVE_LEAD_FAILED',
  REINITIALIZE: 'SAVE_LEAD/REFRESH'
}

// Selector
export const getIndustries = state => _.get(state, 'saveLead.industries') || []
export const getRegion = state => _.get(state, 'saveLead.region') || []
export const getLoadingStatus = state => _.get(state, 'saveLead.isLoading') || false
export const getLeadSources = state => _.get(state, 'saveLead.leadSources') || []
export const getAssignableUsers = state => _.get(state, 'saveLead.assignableUsers') || []
export const getSaveLeadStatus = state => _.get(state, 'saveLead.saveLeadStatus') || "initial"

// Reducer
const initialState = {
  industries: [],
  region: [],
  isLoading: false,
  leadSources: [],
  assignableUsers: [],
  lead: {},
  saveLeadStatus: "initial"
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_FETCH_DROPDOWN_DATA:
      /* request lấy dữ liệu 15 ngành hàng, khu vực, nguồn khách hàng, và user hệ thống có assign = Yes */
      state['isLoading'] = true
      return state
    case types.FETCH_DROPDOWN_DATA_SUCCESS:
      state['isLoading'] = false
      let describe = _.get(action, 'payload.describe')
      let fields = _.get(describe, 'fields')

      let leadSources = fields.find( x => x.name === 'leadsource')
      leadSources = _.get(leadSources, 'type.picklistValues') || []

      let region = fields.find( x => x.name === 'cf_lead_khu_vuc')
      region = _.get(region, 'type.picklistValues') || []


      let industries = fields.find( x => x.name === 'industry')
      industries = _.get(industries, 'type.picklistValues') || []

      let assignableUsers = _.get(describe, 'available_users') || []
      state['leadSources'] = leadSources
      state['region'] = region
      state['industries'] = industries
      state['assignableUsers'] = assignableUsers
      return state
    case types.REQUEST_SAVE_LEAD:
      state['isLoading'] = true
      return state
    case types.REQUEST_SAVE_LEAD_SUCCESS:
      state['isLoading'] = false
      state['saveLeadStatus'] = "success"
      return state
    case types.REQUEST_SAVE_LEAD_FAILED:
      state['isLoading'] = false
      state['saveLeadStatus'] = "failed"
      return state
    case types.REINITIALIZE:
      state['saveLeadStatus'] = "initial"
      return state
    default:
      return state
  }
}

// Action Creators
export const fetchDropdownData = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_FETCH_DROPDOWN_DATA, payload })
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
        //handle success
        const { result, success } = response.data
        if (success) {
          return dispatch(fetchDropdownDataSuccess(result))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(fetchDropdownDataFailed(err))
      })
  }
}
export const requestSaveLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_SAVE_LEAD, payload })
    let {session, data} = payload
    const bodyFormData = new FormData()
    bodyFormData.append("_operation", 'saveRecord')
    bodyFormData.append("_session", session)
    bodyFormData.append("module", 'Leads')
    bodyFormData.append("values", JSON.stringify(data))
    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })

    return request
      .then(response => {
        //handle success
        const { result, success } = response.data
        if (success) {
          return dispatch(saveLeadSuccess(result))
        }
        else {
          return dispatch(saveLeadFailed())
        }
      })
      .catch(err => {
        //handle error
        return dispatch(saveLeadFailed(err))
      })

  }
}
export const fetchDropdownDataSuccess = payload => ({
  type: types.FETCH_DROPDOWN_DATA_SUCCESS,
  payload
})

export const fetchDropdownDataFailed = payload => ({
  type: types.FETCH_DROPDOWN_DATA_FAILED,
  payload
})
export const saveLeadSuccess = payload => ({
  type: types.REQUEST_SAVE_LEAD_SUCCESS,
  payload
})
export const saveLeadFailed = payload => ({
  type: types.REQUEST_SAVE_LEAD_FAILED,
  payload
})

export const reinitializeSaveLeadStatus = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REINITIALIZE, payload })
  }
}