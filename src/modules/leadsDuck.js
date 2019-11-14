import axios from 'axios'
import _ from 'lodash'
import { forEach } from 'react-bootstrap/cjs/utils/ElementChildren'

export const types = {
  REQUEST_GET_LIST_LEAD: 'LEAD/REQUEST_GET_LIST_LEAD',
  SUCCESS_GET_LIST_LEAD: 'LEAD/SUCCESS_GET_LIST_LEAD',
  FAILURE_GET_LIST_LEAD: 'LEAD/FAILURE_GET_LIST_LEAD',
  REQUEST_GET_LEAD_DETAILS: 'LEAD/REQUEST_GET_LEAD_DETAILS',
  SUCCESS_GET_LEAD_DETAILS: 'LEAD/SUCCESS_GET_LEAD_DETAILS',
  FAILURE_GET_LEAD_DETAILS: 'LEAD/FAILURE_GET_LEAD_DETAILS'
}

// Selector

export const getLeadsData = state => _.get(state, 'leads.listLeads') || []
export const getLeadsLoading = state => _.get(state, 'leads.isLoading') || false
export const getLeadsPageIndex = state => _.get(state, 'leads.pageIndex') || 0
export const getLeadsHasMoreData = state =>
  _.get(state, 'leads.hasMoreData') || false
export const getDetailsLead = state => _.get(state, 'leads.detailsLead') || {}

export const getSelectedLeadId = (state, ownProps) => ownProps.match.params.custID || null
// Reducer
const initialState = {
  listLeads: [],
  pageIndex: 1,
  isLoading: false,
  hasMoreData: false,
  detailsLead: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_LIST_LEAD:
      state['isLoading'] = true
      return state
    case types.SUCCESS_GET_LIST_LEAD: {
      state['isLoading'] = false

      const lstLeads = _.get(state, 'listLeads') || []
      const newLeads = _.get(action, 'payload.records') || []

      let merge = (a, b, p) => a.filter( aa => ! b.find ( bb => aa[p] === bb[p]) ).concat(b) // Hàm merge 2 objects array
      let list = merge(lstLeads, newLeads, "id")
      // list.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
      state['listLeads'] = _.isEmpty(list) ? [] : list
      if (newLeads) {
        if (newLeads.length >= 20) {
          state['pageIndex'] = state.pageIndex + 1
          state['hasMoreData'] = true
        } else {
        }
      }
      return state
    }
    case types.FAILURE_GET_LIST_LEAD: {
      state['isLoading'] = false
      return state
    }

    case types.REQUEST_GET_LEAD_DETAILS: {
      state['detailsLead'] = {}
      return state
    }
    case types.SUCCESS_GET_LEAD_DETAILS: {
      const details = {}
      details.name = _.get(action, 'payload.lastname')
      details.phone = _.get(action, 'payload.phone')
      details.secondaryPhone = _.get(action, 'payload.mobile')
      details.status = _.get(action, 'payload.leadstatus')
      details.website = _.get(action, 'payload.website')
      details.industry = _.get(action, 'payload.industry')
      details.region = _.get(action, 'payload.cf_lead_khu_vuc')
      details.leadSource = _.get(action, 'payload.leadsource')
      details.assignedUser = _.get(action, 'payload.assigned_user_id.label')
      details.generalDescription = _.get(action, 'payload.description')
      state['detailsLead'] = details
      return state
    }
    default:
      return state
  }
}

// Action Creators
export const getListLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_LEAD, payload })
    const bodyFormData = new FormData()
    // console.log('thailog action getlist payload', payload)

    const { session, pageIndex } = payload

    bodyFormData.append('_operation', 'listModuleRecords')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')
    bodyFormData.append('page', pageIndex)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    // console.log('thailog pageIndex payload', pageIndex)

    return request
      .then(response => {
        //handle success
        const { result, success } = response.data
        if (success) {
          return dispatch(getListLeadSuccess(result))
        }
        return dispatch(getListLeadFailure())
      })
      .catch(err => {
        //handle error
        console.log('thailog error', err)
        return dispatch(getListLeadFailure(err))
      })
  }
}

export const getListLeadSuccess = payload => ({
  type: types.SUCCESS_GET_LIST_LEAD,
  payload
})

export const getListLeadFailure = error => ({
  type: types.FAILURE_GET_LIST_LEAD,
  error
})

// Action Creators
export const getLeadDetailsByID = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LEAD_DETAILS, payload })
    const bodyFormData = new FormData()
    const { session, record } = payload

    /* đoạn này là thằng action creator này, nó fetch dữ liệu từ api về, kết quả trả về từ fetch chính là payload cho action SUCCESS_GET_LEAD_DETAILS. Xem đoạn cuối sẽ hiểu */
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
        //handle success
        const { result, success } = response.data
        if (success) {
          return dispatch(getDetailsLeadSuccess(result))
          /* câu lệnh trên thực chất là: return dispatch({type: types.SUCCESS_GET_LEAD_DETAILS, result}) */
          /* sau khi dispatch, thằng store sẽ biết được là vừa có action SUCCESS_GET_LEAD_DETAILS gửi lên, với content là result kia. Sau đó thằng Store sẽ gọi đến reducer tương ứng */
        }
        return dispatch(getDetailsLeadFailure())
      })
      .catch(err => {
        //handle error
        console.log('Error', err)
        return dispatch(getDetailsLeadFailure(err))
      })
  }
}

export const getDetailsLeadSuccess = payload => ({
  type: types.SUCCESS_GET_LEAD_DETAILS,
  payload
})

export const getDetailsLeadFailure = error => ({
  type: types.FAILURE_GET_LIST_LEAD,
  error
})
