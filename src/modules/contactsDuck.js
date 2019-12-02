import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  REQUEST_GET_LIST_CONTACT: 'LEAD/REQUEST_GET_LIST_CONTACT',
  SUCCESS_GET_LIST_CONTACT: 'LEAD/SUCCESS_GET_LIST_CONTACT',
  FAILURE_GET_LIST_CONTACT: 'LEAD/FAILURE_GET_LIST_CONTACT',
  REQUEST_GET_LIST_CONTACT_ELASTIC: 'LEAD/REQUEST_GET_LIST_CONTACT_ELASTIC',
  SUCCESS_GET_LIST_CONTACT_ELASTIC: 'LEAD/SUCCESS_GET_LIST_CONTACT_ELASTIC',
  FAILURE_GET_LIST_CONTACT_ELASTIC: 'LEAD/FAILURE_GET_LIST_CONTACT_ELASTIC',
}

// Selector
export const getContactsData = state => _.get(state, 'contacts.listContacts') || []
export const getContactsLoading = state => _.get(state, 'contacts.isLoading') || false
export const getContactsPageIndex = state => _.get(state, 'contacts.pageIndex') || 0
export const getContactsHasMoreData = state =>
  _.get(state, 'contacts.hasMoreData') || false
export const getFilterStatus = state => _.get(state, 'contacts.filterStatus') || {
  label: 'Tất cả',
  value: 'All'
}
export const getFilters = state => _.get(state, 'contacts.filters') || []
// Reducer
const initialState = {
  listContacts: [],
  pageIndex: 1,
  isLoading: false,
  hasMoreData: false,
  detailsContact: {},
  isLoadingDetail: false,
  filterStatus: {
    label: 'Tất cả',
    value: 'All'
  },
  filters: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_LIST_CONTACT:
      let isLoading = _.get(action, 'payload.isLoading')
      if (isLoading !== undefined) state['isLoading'] = isLoading
      let filterStatus = _.get(action, 'payload.filterStatus')
      if(filterStatus) state['filterStatus'] = filterStatus
      return state
    case types.SUCCESS_GET_LIST_CONTACT: {
      state['isLoading'] = false

      const lstContacts = _.get(state, 'listContacts') || []
      const newContacts = _.get(action, 'payload.result.records') || []
      const refresh = _.get(action, 'payload.refresh') || undefined
      let list = []
      if(refresh === undefined){
        list = _.concat(list, lstContacts)
        list = _.concat(list, newContacts)
      }
      else list = newContacts
      state['listContacts'] = list
      if (newContacts) {
        if (newContacts.length >= 20) {
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
    case types.FAILURE_GET_LIST_CONTACT: {
      state['isLoading'] = false
      return state
    }

    default:
      return state
  }
}

// Action Creators
export const getListContact = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_CONTACT, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh, filterStatus } = payload
    bodyFormData.append('_operation', 'listModuleRecords')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Contacts')
    if (pageIndex) bodyFormData.append('page', pageIndex)
    if (filterStatus) {
      let option = {
        contactstatus: filterStatus.value
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
          return dispatch(getListContactSuccess({result, refresh}))
        }
        else {
          const { error } = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(getListContactFailure())
      })
      .catch(err => {
        return dispatch(getListContactFailure(err))
      })
  }
}

/* Elastic */
export const fetchListContactElastic = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_CONTACT, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh, filterStatus } = payload
    bodyFormData.append('_operation', 'fetchContactsElastic')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Contacts')
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
              "contactstatus": item._source.status,
              "modifiedtime": item._source.modifiedtime,
              "website": item._source.s_website,
              "mobile": item._source.s_office_phone
            }))
            // console.log(array)
          }
          return dispatch(getListContactSuccess({result: {records: array, total: total}, refresh}))
        }
        else {
          const { error } = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(getListContactFailure())
      })
      .catch(err => {
        return dispatch(getListContactFailure(err))
      })
  }
}
/* action definition */
export const getListContactSuccess = payload => ({
  type: types.SUCCESS_GET_LIST_CONTACT,
  payload
})

export const getListContactFailure = error => ({
  type: types.FAILURE_GET_LIST_CONTACT,
  error
})