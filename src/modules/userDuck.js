import faker from 'faker/locale/vi'
import _ from 'lodash'

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
    case types.SUCCESS_GET_LIST_LEAD: {
      return action.payload
    }
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

    // const request = axios({
    //     method: 'GET',
    //     url: `${BASE_URL}/offers`,
    //     headers: []
    //   });

    //   return request.then(
    //     response => dispatch(fetchOffersSuccess(response)),
    //     err => dispatch(fetchOffersError(err))
    //   );

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
