import axios from 'axios'
import _ from 'lodash'
import {expireSession} from './loginDuck'

export const types = {
  SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID: 'OPPORTUNITY/FETCH',
  GET_OPPORTUNITY_SUCCESS: 'OPPORTUNITY/FETCH_SUCCESS',
  GET_OPPORTUNITY_FAILED: 'OPPORTUNITY/FETCH_FAILED',
  SEND_REQUEST_SAVE_RECORD: 'OPPORTUNITY/SAVE_RECORD',
  SAVE_RECORD_SUCCESS: 'OPPORTUNITY/SAVE_RECORD_SUCCESS',
  SAVE_RECORD_FAILED: 'OPPORTUNITY/SAVE_RECORD_FAILED',
  SHOW_FORM_ADD_OPPORTUNITY: 'SHOW_FORM_ADD_OPPORTUNITY',
}

/* Selectors */
export const getLoadingStatus = state => _.get(state, 'opportunity.loading') || false
export const getFormSubmittingStatus = state => _.get(state, 'opportunity.formSubmittingStatus') || false
export const getOpportunityData = state => _.get(state, 'opportunity.data') || {}
export const getFormSubmitResponseStatus = state => _.get(state, 'opportunity.formSubmitResponseStatus')
export const getCurrentOption = state => _.get(state, 'opportunity.option')

/* Initial state */
const initialState = {
  loading: false,
  data: {},
  formSubmitResponseStatus: false,
  formSubmittingStatus: false,
  option: undefined
}

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID:
      let option = _.get(action, 'payload.option') || undefined
      state['loading'] = true
      state['option'] = option
      return state
    case types.GET_OPPORTUNITY_SUCCESS:
      state['loading'] = false
      state['formSubmitResponseStatus'] = false
      let data = {}
      let result = _.get(action, 'payload')
      data.potentialname = result.potentialname
      data.sales_stage = result.sales_stage
      data.cf_pot_website = result.cf_pot_website
      data.cf_mobile = result.cf_mobile
      data.cf_pot_nganh_hang = result.cf_pot_nganh_hang
      data.cf_pot_khu_vuc = result.cf_pot_khu_vuc
      data.leadsource = result.leadsource
      data.assigned_user_id = result.assigned_user_id
      data.description = result.description
      data.record = result.id
      data.approval_status = result.approval_status
      data.lastname = result.lastname
      data.contact_id = result.contact_id
      data.customer_type = result.customer_type
      data.cf_gender = result.cf_gender
      data.cf_passport = result.cf_passport
      data.cf_birthday = result.cf_birthday
      data.cf_passport_date = result.cf_passport_date
      data.cf_passport_location = result.cf_passport_location
      data.isSaleKhuVuc = result.isSaleKhuVuc
      data.cf_pot_motachung = result.cf_pot_motachung
      data.cf_contact_street = result.cf_contact_street
      data.cf_email = result.cf_email
      data.cf_city = result.cf_city
      data.cf_state = result.cf_state
      data.cf_pot_lead_source_des = result.cf_pot_lead_source_des
      data.cf_pot_contractid = result.cf_pot_contractid
      data.represent = result.represent
      data.cf_pot_goihd = result.cf_pot_goihd
      data.cf_pot_thoihan = result.cf_pot_thoihan
      data.cf_pot_khuyenmai = result.cf_pot_khuyenmai
      data.closedwon_date = result.closedwon_date
      data.cf_pot_startdate = result.cf_pot_startdate
      data.cf_pot_enddate = result.cf_pot_enddate
      data.cf_pot_ma_voucer = result.cf_pot_ma_voucer
      data.cf_pot_hinhthuctt = result.cf_pot_hinhthuctt
      data.amount = result.amount
      data.cf_pot_sochinhanh = result.cf_pot_sochinhanh
      data.cf_pot_diachich = result.cf_pot_diachich
      data.cf_branch_address = result.cf_branch_address
      data.cf_pot_note = result.cf_pot_note
      data.cf_869 = result.cf_869
      data.cf_967 = result.cf_967
      data.cf_871 = result.cf_871
      data.cf_pot_tinhhinhkinhdoanh = result.cf_pot_tinhhinhkinhdoanh
      data.cf_pot_hinhthuccongcu = result.cf_pot_hinhthuccongcu
      data.cf_pot_tinhnang = result.cf_pot_tinhnang
      data.cf_pot_diemyeu = result.cf_pot_diemyeu
      data.cf_pot_khokhan = result.cf_pot_khokhan
      data.cf_pot_tinhchudong = result.cf_pot_tinhchudong
      data.cf_pot_ngancankh = result.cf_pot_ngancankh
      data.cf_pot_doithunao = result.cf_pot_doithunao
      state['data'] = data
      return state
    case types.GET_OPPORTUNITY_FAILED:
      state['loading'] = false
      return state
    case types.SEND_REQUEST_SAVE_RECORD:
      state['option'] = _.get(action, 'payload.option')
      state['loading'] = true
      state['formSubmittingStatus'] = true
      state['formSubmitResponseStatus'] = false
      return state
    case types.SAVE_RECORD_SUCCESS:
      state['loading'] = false
      state['formSubmittingStatus'] = false
      let newState = _.get(action, 'payload')
      newState = { ...state['data'], ...newState}
      state['formSubmitResponseStatus'] = true
      state['data'] = newState
      return state
    case types.SAVE_RECORD_FAILED:
      state['loading'] = true
      state['formSubmittingStatus'] = false
      state['formSubmitResponseStatus'] = false
      return state
    case types.SHOW_FORM_ADD_OPPORTUNITY:
      state = initialState
      state['option'] = _.get(action, 'payload.option')
      return state
    default:
      return state
  }
}


/* Action creators */
export const fetchOpportunityRecord = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_GET_OPPORTUNITY_DETAIL_BY_RECORD_ID, payload })
    const bodyFormData = new FormData()
    const { session, record } = payload

    bodyFormData.append('_operation', 'fetchRecord')
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
        const { success, result } = response.data
        if (success) {
          return dispatch(fetchOpportunitySuccess(result))
        }
        else {
          let error = response.data.error
          if (error.code === 1501) {
            return dispatch(expireSession())
          }
          return dispatch(fetchOpportunityFailed(error))
        }
      })
      .catch(err => {
        console.log(err)
        return dispatch(fetchOpportunitySuccess(err))
      })
  }
}

export const requestSaveOpportunity = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SEND_REQUEST_SAVE_RECORD, payload })
    let {session, data} = payload
    let formData = {...data} /* clone */

    const bodyFormData = new FormData()
    bodyFormData.append("_operation", 'saveRecord')
    bodyFormData.append("_session", session)
    bodyFormData.append("module", 'Potentials')
    if (data.record) bodyFormData.append("record", formData.record)
    let prop = undefined
    for (prop in formData) {
      if (formData.hasOwnProperty(prop) && formData[prop]['value']) {
        formData[prop] = formData[prop]['value']
      }
    }
    /* opt phan cung */
    let { productsOptPhanCung } = payload
    if (productsOptPhanCung) {
      formData["products"] = productsOptPhanCung
    }
    let values = JSON.stringify(formData)
    bodyFormData.append("values", values)
    const request = axios({
      method: 'POST',
      url: process.env.REACT_APP_API_URL_KVCRM,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
    return request
      .then(response => {
        const { success, result } = response.data
        if (success) {
          let record = _.get(result, 'record_id')
          if (record) data["record"] = record
          return dispatch(saveOpportunitySuccess(data))
        }
        else {
          console.log(response.data)
          return dispatch(saveOpportunityFailed(response.data))
        }
      })
      .catch(err => {
        //handle error
        return dispatch(saveOpportunityFailed(err))
      })

  }
}
export const showFormAddOpportunity = payload => {
  return function action(dispatch) {
    dispatch({ type: types.SHOW_FORM_ADD_OPPORTUNITY, payload })
  }
}



/* Action declaration */
export const fetchOpportunitySuccess = payload => ({
  type: types.GET_OPPORTUNITY_SUCCESS,
  payload
})

export const fetchOpportunityFailed = payload => ({
  type: types.GET_OPPORTUNITY_FAILED,
  payload
})

export const saveOpportunitySuccess = payload => ({
  type: types.SAVE_RECORD_SUCCESS,
  payload
})

export const saveOpportunityFailed = payload => ({
  type: types.SAVE_RECORD_FAILED,
  payload
})
