import faker from 'faker/locale/vi'
import _ from 'lodash'
import axios from 'axios'

export const types = {
  REQUEST_GET_LIST_LEAD: 'LEAD/REQUEST_GET_LIST_LEAD',
  SUCCESS_GET_LIST_LEAD: 'LEAD/SUCCESS_GET_LIST_LEAD',
  FAILURE_GET_LIST_LEAD: 'LEAD/FAILURE_GET_LIST_LEAD'
}

// Selector

export const getUserData = state => _.get(state, 'user') || {}
export const getUserDataByID = (state, ownProps) => {
  const custID = _.get(ownProps, 'match.params.custID') || ''
  const usersInfor = getUserData(state)
  return custID ? _.find(usersInfor, ['id', custID]) : {}
}

// Reducer
const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    // case types.SUCCESS_GET_LIST_LEAD: {
    //   return action.payload
    // }
    default:
      return state
  }
}

const generator = (schema, min = 10, max) => {
  max = max || min
  return Array.from({ length: faker.random.number({ min, max }) }).map(() =>
    Object.keys(schema).reduce((entity, key) => {
      entity[key] = faker.fake(schema[key])
      return entity
    }, {})
  )
}

// Action Creators
export const getListLead = payload => {
  return function action(dispatch) {
    dispatch({ type: types.REQUEST_GET_LIST_LEAD, payload })

    const bodyFormData = new FormData()

    bodyFormData.append('_operation', 'login')
    bodyFormData.append('username', 'tuyenvv')
    bodyFormData.append('password', 1)

    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    // .then(function (response) {
    //     //handle success
    //     console.log(response);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    // });

    // const request = axios({
    //   method: 'GET',
    //   url: `http://kvcrm.kvpos.com:9062/modules/Mobile/api.php`,
    //   headers: []
    // })

    // const params = new URLSearchParams()
    // params.append('_operation', 'login')
    // params.append('username', 'tuyenvv')
    // params.append('password', '1')
    // axios.post('http://kvcrm.kvpos.com:9062/modules/Mobile/api.php', params)

    // return
    request.then(
      res => console.log('thailog res', res),
      err => console.log('thailog err', err)
    )

    const clientsSchema = {
      id: '{{random.number}}',
      name: '{{company.companyName}}',
      address: '{{address.streetAddress}}',
      phone: '{{phone.phoneNumber}}',
      email: '{{internet.email}}',
      date: '{{date.future}}',
      transactionType: '{{finance.transactionType}}'
    }
    const data = generator(clientsSchema, 10, 30)

    return dispatch(getListLeadSuccess(data))
  }
}

export const getListLeadSuccess = payload => ({
  type: types.SUCCESS_GET_LIST_LEAD,
  payload
})

export const getListLeadFail = error => ({
  type: types.FAILURE_GET_LIST_LEAD,
  error
})
