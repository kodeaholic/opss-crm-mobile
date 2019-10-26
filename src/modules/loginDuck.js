import axios from 'axios'

export const types = {
  REQUEST_LOGIN: 'LOGIN/REQUEST_LOGIN',
  SUCCESS_LOGIN: 'LOGIN/SUCCESS_LOGIN',
  FAILURE_LOGIN: 'LOGIN/FAILURE_LOGIN'
}

// Selector

// Reducer
const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SUCCESS_LOGIN: {
      return action.payload
    }
    default:
      return state
  }
}

// Action Creators
export const requestLogin = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_LOGIN, payload })
    console.log('thailog payload', payload)
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
