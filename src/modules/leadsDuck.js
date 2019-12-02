import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  REQUEST_GET_LIST_LEAD: 'LEAD/REQUEST_GET_LIST_LEAD',
  SUCCESS_GET_LIST_LEAD: 'LEAD/SUCCESS_GET_LIST_LEAD',
  FAILURE_GET_LIST_LEAD: 'LEAD/FAILURE_GET_LIST_LEAD',
  REQUEST_GET_LIST_LEAD_ELASTIC: 'LEAD/REQUEST_GET_LIST_LEAD_ELASTIC',
  SUCCESS_GET_LIST_LEAD_ELASTIC: 'LEAD/SUCCESS_GET_LIST_LEAD_ELASTIC',
  FAILURE_GET_LIST_LEAD_ELASTIC: 'LEAD/FAILURE_GET_LIST_LEAD_ELASTIC',
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
export const getFilters = state => _.get(state, 'leads.filters') || []
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
  },
  filters: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_LIST_LEAD:
      let isLoading = _.get(action, 'payload.isLoading')
      state['isLoading'] = isLoading
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
      let filters = _.get(action, 'payload.result.filters') || []
      filters.unshift({label: 'Tất cả', value: 'All'})
      state['filters'] = filters
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

/* Elastic */
export const fetchListLeadElastic = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_LEAD, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh, filterStatus } = payload
    bodyFormData.append('_operation', 'fetchLeadsElastic')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Leads')
    if (pageIndex) {
      let actualIndex = pageIndex - 1
      let size = 20;
      bodyFormData.append('from', actualIndex * size)
    }
    else {
      if (refresh) bodyFormData.append('from', '0')
    }
    if (filterStatus) {
      bodyFormData.append('status', filterStatus.value)
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
        let records = result.result.records
        let total = result.total
        let array = []
        if (success) {
          if (total > 0) {
            // console.log(records)
            array = records.map(item => ({
              "assigned_user_id": {"value": '19x' + item._source.smownerid, "label": item._source.asssignto},
              "createdtime": item._source.createdtime,
              "id": '10x' + item._source.crmid,
              "lastname": item._source.label,
              "leadstatus": item._source.status,
              "modifiedtime": item._source.modifiedtime,
              "website": item._source.s_website,
              "mobile": item._source.s_office_phone
            }))
            // console.log(array)
          }
          return dispatch(getListLeadSuccess({result: {records: array, total: total}, refresh}))
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