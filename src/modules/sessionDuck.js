import _ from 'lodash'

export const types = {
  EXPIRE_SESSION: 'EXPIRE_SESSION',
  ACTIVATE_SESSION: 'ACTIVATE_SESSION'
}

// Selector
export const getSessionStatus = state => _.get(state, 'session.expired') || false

// Reducer
const initialState = {
  expired: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.EXPIRE_SESSION:
      state['expired'] = true
      localStorage.setItem('session', "expired")
      return state
    case types.ACTIVATE_SESSION:
      state['expired'] = false
      localStorage.setItem('session', "active")
      return state
    default:
      return state
  }
}

// Action Creators
export const expireSession = payload => {
  return function action(dispatch) {
    dispatch({ type: types.EXPIRE_SESSION, payload })
  }
}

export const activateSession = payload => {
  return function action(dispatch) {
    dispatch({ type: types.ACTIVATE_SESSION, payload })
  }
}