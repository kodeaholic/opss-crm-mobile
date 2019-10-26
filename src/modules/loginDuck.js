import axios from 'axios'
import _ from "lodash"

export const types = {
  REQUEST_LOGIN: 'LOGIN/REQUEST_LOGIN',
  SUCCESS_LOGIN: 'LOGIN/SUCCESS_LOGIN',
  FAILURE_LOGIN: 'LOGIN/FAILURE_LOGIN'
}

// Selector
export const getUserLoggedIn = state => state.login.userLogged

export const getLoading = state => state.login.isLoading

// Reducer
const initialState = {
  isLoading: false,
  userLogged: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_LOGIN: {
      state['isLoading'] = true
      return state
    }
    case types.SUCCESS_LOGIN: {
      state['isLoading'] = false
      state['userLogged'] = action.payload
      return state
    }
    default:
      return state
  }
}

// Action Creators
export const requestLogin = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_LOGIN, payload })
    const bodyFormData = new FormData()
    const { username, password } = payload

    bodyFormData.append('_operation', 'login')
    bodyFormData.append('username', username)
    bodyFormData.append('password', password)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    return request.then(
      res => {
        console.log('thailog success res', res)
        const responseSuccess = _.get(res, "data.success") || ""
        if(!res.data || responseSuccess !== "true") return dispatch(loginFailure("null data or failure login"))

        console.log('thailog success login', res)
        localStorage.setItem('user', JSON.stringify(res.data))
        return dispatch(loginSuccess(res.data))
      },
      err => dispatch(loginFailure(err))
    )
  }
}

export const loginSuccess = payload => ({
  type: types.SUCCESS_LOGIN,
  payload
})

export const loginFailure = error => ({
  type: types.FAILURE_LOGIN,
  error
})

export const actions = {
  loginFailure: error => ({
    type: types.FAILURE_LOGIN,
    error
  }),
  loginSuccess: payload => ({
    type: types.SUCCESS_LOGIN,
    payload
  })
}
