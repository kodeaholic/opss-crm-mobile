import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './sessionDuck'

export const types = {
  REQUEST_GET_SEARCH_RESULT: 'SEARCH/REQUEST_GET_SEARCH_RESULT',
  SUCCESS_GET_SEARCH_RESULT: 'SEARCH/SUCCESS_GET_SEARCH_RESULT',
  FAILURE_GET_SEARCH_RESULT: 'SEARCH/FAILURE_GET_SEARCH_RESULT',
}

// Selector
export const getSRData = state => _.get(state, 'search.listSearchResult') || []
export const getSRLoading = state => _.get(state, 'search.isLoading') || false
export const getSRPageIndex = state => _.get(state, 'search.pageIndex') || 0
export const getSRHasMoreData = state =>
  _.get(state, 'leads.hasMoreData') || false
export const getKeyword = (state, ownProps) => ownProps.match.params.keyword || null

// Reducer
const initialState = {
  listSearchResult: [],
  pageIndex: 1,
  isLoading: false,
  hasMoreData: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_GET_SEARCH_RESULT:
      state['isLoading'] = true
      return state
    case types.SUCCESS_GET_SEARCH_RESULT: {
      state['isLoading'] = false
      const lstLeads = _.get(state, 'listSearchResult') || []
      const newLeads = _.get(action, 'payload.result.records') || []
      const refresh = _.get(action, 'payload.refresh') || undefined
      let list = []
      if (refresh === undefined) {
        list = _.concat(list, lstLeads)
        list = _.concat(list, newLeads)
      } else list = newLeads
      state['listSearchResult'] = list
      if (newLeads) {
        if (newLeads.length >= 30) {
          state['pageIndex'] = state.pageIndex + 1
          state['hasMoreData'] = true
        } else {
        }
      }
      return state
    }
    case types.FAILURE_GET_SEARCH_RESULT: {
      state['isLoading'] = false
      return state
    }

    default:
      return state
  }
}

// Action Creators
export const getSearchResult = payload => {
  return function action(dispatch) {
    dispatch({type: types.REQUEST_GET_SEARCH_RESULT, payload})
    const bodyFormData = new FormData()

    const {session, pageIndex, refresh, keyword} = payload
    bodyFormData.append('_operation', 'search')
    bodyFormData.append('_session', session)
    bodyFormData.append('searchKey', keyword)
    if (pageIndex) bodyFormData.append('page', pageIndex)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: {headers: {'Content-Type': 'multipart/form-data'}}
    })

    return request
      .then(response => {
        //handle success
        const {result, success} = response.data
        if (success) {
          return dispatch(getSearchResultSuccess({result, refresh}))
        } else {
          const {error} = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(getSearchResultFailure())
      })
      .catch(err => {
        return dispatch(getSearchResultFailure(err))
      })
  }
}

/* action definition */
export const getSearchResultSuccess = payload => ({
  type: types.SUCCESS_GET_SEARCH_RESULT,
  payload
})

export const getSearchResultFailure = error => ({
  type: types.FAILURE_GET_SEARCH_RESULT,
  error
})