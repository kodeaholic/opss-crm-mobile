import axios from 'axios'
import _ from 'lodash'

export const types = {
  REQUEST_FETCH_DROPDOWN_DATA: 'ADD_LEAD/REQUEST_FETCH_DROPDOWN_DATA',
  FETCH_DROPDOWN_DATA_SUCCESS: 'ADD_LEAD/FETCH_DROPDOWN_DATA_SUCCESS',
  FETCH_DROPDOWN_DATA_FAILED: 'ADD_LEAD/FETCH_DROPDOWN_DATA_FAILED',
}

// Selector
export const getIndustries = state => _.get(state, 'addLead.industries') || []
export const getRegion = state => _.get(state, 'addLead.region') || []
export const getLoadingStatus = state => _.get(state, 'addLead.isLoading') || []
export const getLeadSources = state => _.get(state, 'addLead.leadSources') || []
export const getAssignableUsers = state => _.get(state, 'addLead.assignableUsers') || []

// Reducer
const initialState = {
  industries: [],
  region: [],
  isLoading: false,
  leadSources: [],
  assignableUsers: [],
  lead: {}
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
      return {
        ...state,
        leadSources,
        region,
        industries,
        assignableUsers
      }
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

export const fetchDropdownDataSuccess = payload => ({
  type: types.FETCH_DROPDOWN_DATA_SUCCESS,
  payload
})

export const fetchDropdownDataFailed = payload => ({
  type: types.FETCH_DROPDOWN_DATA_FAILED,
  payload
})