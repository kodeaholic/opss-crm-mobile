import axios from 'axios'
import _ from 'lodash'

export const types = {
  REQUEST_GET_LIST_LEAD: 'LEAD/REQUEST_GET_LIST_LEAD',
  SUCCESS_GET_LIST_LEAD: 'LEAD/SUCCESS_GET_LIST_LEAD',
  FAILURE_GET_LIST_LEAD: 'LEAD/FAILURE_GET_LIST_LEAD',
  REQUEST_GET_LEAD_DETAILS: 'LEAD/REQUEST_GET_LEAD_DETAILS',
  SUCCESS_GET_LEAD_DETAILS: 'LEAD/SUCCESS_GET_LEAD_DETAILS',
  FAILURE_GET_LEAD_DETAILS: 'LEAD/FAILURE_GET_LEAD_DETAILS',
  REQUEST_CHECK_IF_LEAD_IS_DELETED: 'LEAD/REQUEST_CHECK_IF_LEAD_IS_DELETED',
  LEAD_IS_DELETED: 'LEAD/LEAD_IS_DELETED',
  LEAD_IS_NOT_DELETED: 'LEAD/LEAD_IS_NOT_DELETED',
  REQUEST_CHECK_IF_LEAD_IS_DELETED_FAILED: 'LEAD/REQUEST_CHECK_IF_LEAD_IS_DELETED_FAILED',
}

// Selector
export const getLeadsData = state => _.get(state, 'leads.listLeads') || []
export const getLeadsLoading = state => _.get(state, 'leads.isLoading') || false
export const getLeadsPageIndex = state => _.get(state, 'leads.pageIndex') || 0
export const getLeadsHasMoreData = state =>
  _.get(state, 'leads.hasMoreData') || false
export const getDetailsLead = state => _.get(state, 'leads.detailsLead') || {}
export const getSelectedLeadId = (state, ownProps) => ownProps.match.params.custID || null
export const getDetailsLeadLoadingStatus = state => _.get(state, 'leads.isLoadingDetail') || false

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
      const newLeads = _.get(action, 'payload.result.records') || []
      const refresh = _.get(action, 'payload.refresh') || undefined
      console.log("Refresh = " + refresh)
      let list = []
      if(refresh === undefined){
        list = _.concat(list, lstLeads)
        list = _.concat(list, newLeads)
      }
      else list = newLeads
      state['listLeads'] = list
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
      state['isLoadingDetail'] = true
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
      state['isLoadingDetail'] = false
      state['detailsLead'] = details
      return state
    }

    case types.LEAD_IS_DELETED:
      let id = _.get(action, 'payload')
      let list = state['listLeads']
      let index = list.findIndex(found => found.id === id)
      list.splice(index, 1)
      state['listLeads'] = list
      return state
    case types.LEAD_IS_NOT_DELETED:
      return state
    default:
      return state
  }
}

// Action Creators
export const getListLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_LEAD, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh } = payload
    bodyFormData.append('_operation', 'listModuleRecords')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')
    if (pageIndex) bodyFormData.append('page', pageIndex)

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
          return dispatch(getListLeadSuccess({result, refresh}))
        }
        return dispatch(getListLeadFailure())
      })
      .catch(err => {
        return dispatch(getListLeadFailure(err))
      })
  }
}
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
        console.log(err)
        return dispatch(getDetailsLeadFailure(err))
      })
  }
}
export const actionCheckDeletedItem = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_CHECK_IF_LEAD_IS_DELETED, payload })
    const bodyFormData = new FormData()

    const { session, item } = payload
    let record_id = item ? item.id : '-1x-1'
    bodyFormData.append('_operation', 'fetchRecord')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')
    bodyFormData.append('record', record_id)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    return request
      .then(response => {
        const { success } = response.data
        if (!success) {
          return dispatch(removeItemFromList(item.id))
        }
        else {
          return dispatch(keepItemInList(item.id))
        }
      })
      .catch(err => {
        return dispatch(pingCheckDeletedRecordFailed(err))
      })
  }
}

/* action definition */
export const getListLeadSuccess = payload => ({
  type: types.SUCCESS_GET_LIST_LEAD,
  payload
})

export const getListLeadFailure = error => ({
  type: types.FAILURE_GET_LIST_LEAD,
  error
})

export const getDetailsLeadSuccess = payload => ({
  type: types.SUCCESS_GET_LEAD_DETAILS,
  payload
})

export const getDetailsLeadFailure = error => ({
  type: types.FAILURE_GET_LIST_LEAD,
  error
})

export const pingCheckDeletedRecord = payload => ({
  type: types.REQUEST_CHECK_IF_LEAD_IS_DELETED,
  payload
})

export const removeItemFromList = payload => ({
  type: types.LEAD_IS_DELETED,
  payload
})

export const keepItemInList = payload => ({
  type: types.LEAD_IS_NOT_DELETED,
  payload
})

export const pingCheckDeletedRecordFailed = payload => ({
  type: types.REQUEST_CHECK_IF_LEAD_IS_DELETED_FAILED,
  payload
})