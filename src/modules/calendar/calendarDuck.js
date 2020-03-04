import axios from 'axios'
import _ from 'lodash'
import { expireSession } from '../loginDuck'

export const types = {
  REQUEST_FETCH_CALENDAR: 'CALENDAR/REQUEST_FETCH_CALENDAR',
  FETCH_CALENDAR_SUCCESS: 'CALENDAR/FETCH_CALENDAR_SUCCESS',
  FETCH_CALENDAR_FAILED: 'CALENDAR/FETCH_CALENDAR_FAILED',
}

// Selector
export const getFetchedData = state => _.get(state, 'calendar.items') || []
export const getStatusOfFetchingRequest = state => _.get(state, 'calendar.isFetching') || false
export const getUsers = state => _.get(state, 'calendar.users') || []
export const getTaskDays = state => _.get(state, 'calendar.taskDays') || []
export const getEventDays = state => _.get(state, 'calendar.eventDays') || []
export const getScheduledDays = state => _.get(state, 'calendar.scheduledDays') || []
export const getCurrentCalendarType = state => _.get(state, 'calendar.type') || calendarType.DAY
export const calendarType = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH'
}
// Reducer
const initialState = {
  items: [],
  isFetching: false,
  users: [],
  taskDays: [],
  eventDays: [],
  scheduledDays: [],
  type: calendarType.DAY
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_FETCH_CALENDAR:
      let type = _.get(action, 'payload.type')
      state['isFetching'] = true
      state['type'] = type
      return state
    case types.FETCH_CALENDAR_SUCCESS: {
      state['isFetching'] = false
      state['items'] = _.get(action, 'payload.result.items')
      state['users'] = _.get(action, 'payload.result.users')
      state['taskDays'] = _.get(action, 'payload.result.taskDays')
      state['eventDays'] = _.get(action, 'payload.result.eventDays')
      state['scheduledDays'] = _.get(action, 'payload.result.days')
      return state
    }
    case types.FETCH_CALENDAR_FAILED: {
      state['isFetching'] = false
      return state
    }
    default:
      return state
  }
}

// Action Creators
export const fetchCalendar = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_FETCH_CALENDAR, payload })
    const bodyFormData = new FormData()

    const { session, type} = payload
    bodyFormData.append('_operation', 'fetchCalendar')
    bodyFormData.append('_session', session)
    bodyFormData.append('type', type)
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
          return dispatch(fetchCalendarSuccess({result}))
        } else {
          const { error } = response.data
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
        }
        return dispatch(fetchCalendarFailed())
      })
      .catch(err => {
        return dispatch(fetchCalendarFailed(err))
      })
  }
}

/* action definition */
export const fetchCalendarSuccess = payload => ({
  type: types.FETCH_CALENDAR_SUCCESS,
  payload
})

export const fetchCalendarFailed = error => ({
  type: types.FETCH_CALENDAR_FAILED,
  error
})
