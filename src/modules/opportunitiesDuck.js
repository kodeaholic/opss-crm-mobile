import axios from 'axios'
import _ from 'lodash'
import { expireSession } from './loginDuck'

export const types = {
  REQUEST_GET_LIST_POTENTIAL: 'POTENTIAL/REQUEST_GET_LIST_POTENTIAL',
  SUCCESS_GET_LIST_POTENTIAL: 'POTENTIAL/SUCCESS_GET_LIST_POTENTIAL',
  FAILURE_GET_LIST_POTENTIAL: 'POTENTIAL/FAILURE_GET_LIST_POTENTIAL',
  REQUEST_GET_LIST_POTENTIAL_ELASTIC: 'POTENTIAL/REQUEST_GET_LIST_POTENTIAL_ELASTIC',
  SUCCESS_GET_LIST_POTENTIAL_ELASTIC: 'POTENTIAL/SUCCESS_GET_LIST_POTENTIAL_ELASTIC',
  FAILURE_GET_LIST_POTENTIAL_ELASTIC: 'POTENTIAL/FAILURE_GET_LIST_POTENTIAL_ELASTIC'
}

// Selector
export const getPotentials = state => _.get(state, 'potentials.listPotentials') || []
export const getFetchingStatus = state => _.get(state, 'potentials.isLoading') || false
export const getPotentialsPageIndex = state => _.get(state, 'potentials.pageIndex') || 0
export const getPotentialsHasMoreData = state =>
  _.get(state, 'potentials.hasMoreData') || false
export const getFilterStatus = state => _.get(state, 'potentials.filterStatus') || {
  label: 'Tình trạng',
  value: 'All'
}
export const getStatusOptions = state => _.get(state, 'potentials.status') || []
export const getUsers = state => _.get(state, 'potentials.users') || []
export const getFilterUser = state => _.get(state, 'potentials.filterUser') || {
  label: 'Người xử lý',
  value: 'All'
}
// Reducer
const initialState = {
  listPotentials: [],
  pageIndex: 1,
  isLoading: false,
  hasMoreData: false,
  detailsLead: {},
  isLoadingDetail: false,
  filterStatus: {
    label: 'Tình trạng',
    value: 'All'
  },
  status: [],
  users: [],
  filterUser: {
    label: 'Người xử lý',
    value: 'All'
  }
}

function arrayUnique(array) {
  let a = array.concat()
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i].id === a[j].id)
        a.splice(j--, 1)
    }
  }
  return a
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_LIST_POTENTIAL:
      let isLoading = _.get(action, 'payload.isLoading')
      if (isLoading !== undefined) state['isLoading'] = isLoading
      let filterStatus = _.get(action, 'payload.filterStatus')
      if (filterStatus) state['filterStatus'] = filterStatus
      let filterUser = _.get(action, 'payload.filterUser')
      if (filterUser) state['filterUser'] = filterUser
      return state
    case types.SUCCESS_GET_LIST_POTENTIAL: {
      state['isLoading'] = false

      const listPotentials = _.get(state, 'listPotentials') || []
      const newPotentials = _.get(action, 'payload.result.records') || []
      const refresh = _.get(action, 'payload.refresh') || undefined
      let list = []
      if (refresh === undefined) {
        // loadmore
        list = _.concat(list, listPotentials)
        list = _.concat(list, newPotentials)
        if (newPotentials && newPotentials.length >= 20) {
          state['hasMoreData'] = true
          state['pageIndex'] = state.pageIndex + 1
        } else {
          state['hasMoreData'] = false
        }
      } else {
        // refresh: append old list to the end of new list
        let filterChanged = _.get(action, 'payload.filterChanged')
        if (newPotentials && newPotentials.length > 0 && filterChanged === undefined) {
          let temp = []
          temp = _.concat(temp, newPotentials)
          temp = _.concat(temp, listPotentials)
          list = _.concat([], temp)
          list = arrayUnique(list)
          state['hasMoreData'] = newPotentials.length >= 20
        } else if (newPotentials && newPotentials.length > 0 && filterChanged === true) {
          list = _.concat([], newPotentials)
          state['hasMoreData'] = newPotentials.length >= 20
        } else {
          if (filterChanged === undefined) list = state['listContacts']
          else {
            list = []
          }
        }
      }
      state['listPotentials'] = list
      let status = _.get(action, 'payload.result.status') || []
      status.unshift({ label: 'Tình trạng', value: 'All' })
      state['status'] = status
      let users = _.get(action, 'payload.result.users') || []
      users.unshift({ label: 'Người xử lý', value: 'All' })
      state['users'] = users
      return state
    }
    case types.FAILURE_GET_LIST_POTENTIAL: {
      state['isLoading'] = false
      return state
    }

    default:
      return state
  }
}

// Action Creators
export const fetchPotentials = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_POTENTIAL, payload })
    const bodyFormData = new FormData()

    const { session, pageIndex, refresh, filterStatus, filterChanged, filterUser } = payload
    bodyFormData.append('_operation', 'listModuleRecords')
    bodyFormData.append('_session', session)
    bodyFormData.append('module', 'Potentials')
    if (pageIndex) bodyFormData.append('page', pageIndex)
    let option = {}
    if (filterStatus) {
      option.sales_stage = filterStatus ? filterStatus.value : 'All'
    }
    if (filterUser) {
      option.smownerid = filterUser ? filterUser.value : 'All'
    }
    if (!_.isEmpty(option)) bodyFormData.append('option', JSON.stringify(option))

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
          return dispatch(fetchPotentialsSuccess({ result, refresh, filterChanged }))
        } else {
          const { error } = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(fetchPotentialsFailure())
      })
      .catch(err => {
        return dispatch(fetchPotentialsFailure(err))
      })
  }
}

/* action definition */
export const fetchPotentialsSuccess = payload => ({
  type: types.SUCCESS_GET_LIST_POTENTIAL,
  payload
})

export const fetchPotentialsFailure = error => ({
  type: types.FAILURE_GET_LIST_POTENTIAL,
  error
})
