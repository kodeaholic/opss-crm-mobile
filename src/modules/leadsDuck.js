import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './sessionDuck'

export const types = {
  REQUEST_GET_LIST_LEAD: 'LEAD/REQUEST_GET_LIST_LEAD',
  SUCCESS_GET_LIST_LEAD: 'LEAD/SUCCESS_GET_LIST_LEAD',
  FAILURE_GET_LIST_LEAD: 'LEAD/FAILURE_GET_LIST_LEAD',
}

// Selector
export const getLeadsData = state => _.get(state, 'leads.listLeads') || []
export const getLeadsLoading = state => _.get(state, 'leads.isLoading') || false
export const getLeadsPageIndex = state => _.get(state, 'leads.pageIndex') || 0
export const getLeadsHasMoreData = state =>
  _.get(state, 'leads.hasMoreData') || false
export const getFilterStatus = state => _.get(state, 'leads.filterStatus') || {
  label: 'Tất cả',
  value: 'All'
}
// Reducer
const initialState = {
  listLeads: [],
  pageIndex: 1,
  isLoading: false,
  hasMoreData: false,
  detailsLead: {},
  isLoadingDetail: false,
  filterStatus: {
    label: 'Tất cả',
    value: 'All'
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_LIST_LEAD:
      state['isLoading'] = true
      let filterStatus = _.get(action, 'payload.filterStatus')
      if(filterStatus) state['filterStatus'] = filterStatus
      return state
    case types.SUCCESS_GET_LIST_LEAD: {
      state['isLoading'] = false

      const lstLeads = _.get(state, 'listLeads') || []
      const newLeads = _.get(action, 'payload.result.records') || []
      const refresh = _.get(action, 'payload.refresh') || undefined
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

    default:
      return state
  }
}

// Action Creators
export const getListLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_LEAD, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh, filterStatus } = payload
    bodyFormData.append('_operation', 'listModuleRecords')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')
    if (pageIndex) bodyFormData.append('page', pageIndex)
    if (filterStatus) {
      let option = {
        leadstatus: filterStatus.value
      }
      bodyFormData.append("option", JSON.stringify(option))
    }

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
        else {
          const { error } = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(getListLeadFailure())
      })
      .catch(err => {
        return dispatch(getListLeadFailure(err))
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