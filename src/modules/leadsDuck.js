import axios from 'axios'
import _ from 'lodash'

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
// export const getUserDataByID = (state, ownProps) => {
//   const custID = _.get(ownProps, 'match.params.custID') || ''
//   const usersInfor = getUserData(state)
//   return custID ? _.find(usersInfor, ['id', custID]) : {}
// }

// Reducer
const initialState = {
  listLeads: [],
  pageIndex: 0,
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
      // const other = _.concat(lstLeads, newLeads)
      const other = []
      _.merge(other, lstLeads, newLeads)

      state['listLeads'] = other
      if (newLeads) {
        // debugger;
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
      state['detailsLead'] = {}
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
    // console.log('thailog action getlist payload', payload)

    const { session, record } = payload

    bodyFormData.append('_operation', 'listModuleRecords')
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
        }
        return dispatch(getDetailsLeadFailure())
      })
      .catch(err => {
        //handle error
        console.log('thailog error', err)
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
