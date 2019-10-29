import axios from 'axios'
import _ from 'lodash'
import { toast } from 'react-toastify'

export const types = {
  REQUEST_LOGIN: 'LOGIN/REQUEST_LOGIN',
  SUCCESS_LOGIN: 'LOGIN/SUCCESS_LOGIN',
  FAILURE_LOGIN: 'LOGIN/FAILURE_LOGIN',
  REQUEST_FORGET_PASSWORD: 'LOGIN/REQUEST_FORGET_PASSWORD',
  SUCCESS_FORGET_PASSWORD: 'LOGIN/SUCCESS_FORGET_PASSWORD',
  FAILURE_FORGET_PASSWORD: 'LOGIN/FAILURE_FORGET_PASSWORD'
}

// Selector
export const getUserLoggedIn = state => state.login.userLogged
export const getLoading = state => state.login.isLoading
export const getMessageError = state => state.login.messageErrorLogin

// Reducer
const initialState = {
  isLoading: false,
  userLogged: {},
  messageErrorLogin: ''
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
    case types.FAILURE_LOGIN: {
      state['isLoading'] = false
      state['messageErrorLogin'] = action.error
      toast.error(action.error)
      return state
    }
    case types.SUCCESS_FORGET_PASSWORD: {
      // state['isLoading'] = false
      // state['userLogged'] = action.payload
      return state
    }
    case types.FAILURE_FORGET_PASSWORD: {
      toast.error('Email không hợp lệ!')
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
        const responseSuccess = _.get(res, 'data.success') || false
        const responseErr = _.get(res, 'data.error') || false
        if (!res.data || !responseSuccess || responseErr) {
          return dispatch(loginFailure('Tên đăng nhập hoặc mật khẩu chưa đúng'))
        }
        localStorage.setItem('user', JSON.stringify(res.data))
        return dispatch(loginSuccess(res.data))
      },
      err => dispatch(loginFailure(err.message))
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

// Action Creators
export const requestSendForgetPass = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_FORGET_PASSWORD, payload })
    const bodyFormData = new FormData()
    const { username, email } = payload

    bodyFormData.append('_operation', 'forgotPassword')
    bodyFormData.append('username', username)
    bodyFormData.append('email', email)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    return request.then(
      res => {
        console.log('thailog success res', res)
        const responseSuccess = _.get(res, 'data.success') || false
        if (!responseSuccess) {
          return dispatch(loginFailure('Email không hợp lệ!'))
        }

        return dispatch(loginSuccess(res.data))
      },
      err => dispatch(loginFailure(err.message))
    )
  }
}

export const sendForgetPassSuccess = payload => ({
  type: types.SUCCESS_FORGET_PASSWORD,
  payload
})

export const sendForgetPassFailure = error => ({
  type: types.FAILURE_FORGET_PASSWORD,
  error
})
