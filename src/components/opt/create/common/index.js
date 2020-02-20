import _ from 'lodash'

export const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const websiteRegex = /[^a-zA-Z0-9]/g
export const onlyNumberRegex = /^[0-9]{1,255}$/g
export const phoneRegex = /^[0-9]{1,255}$/g

export const conditionalRequiredFields = {
  'personal': {
    'cf_gender': 'Giới tính',
    'cf_birthday': 'Ngày sinh',
    'cf_passport': 'Số CMT/MST',
    'cf_passport_date': 'Ngày cấp',
    'cf_passport_location': 'Nơi cấp',
    'cf_pot_contractid': 'Số hợp đồng',
    'cf_pot_goihd': 'Gói hợp đồng',
    'cf_pot_diachich': 'Địa chỉ',
    'cf_pot_startdate': 'Ngày bắt đầu',
    'cf_pot_enddate': 'Ngày kết thúc',
    'closedwon_date': 'Ngày ký hợp đồng',
    'cf_pot_khuyenmai': 'Khuyến mại',
    'cf_pot_sochinhanh': 'Số chi nhánh',
    'cf_pot_hinhthuctt': 'Hình thức thanh toán',
    'amount': 'Thành tiền'
  },
  'company': {
    'cf_passport': 'Số CMT/MST',
    'company_name': 'Tên công ty',
    'cf_pot_contractid': 'Số hợp đồng',
    'cf_pot_goihd': 'Gói hợp đồng',
    'cf_pot_diachich': 'Địa chỉ',
    'cf_pot_startdate': 'Ngày bắt đầu',
    'cf_pot_enddate': 'Ngày kết thúc',
    'closedwon_date': 'Ngày ký hợp đồng',
    'cf_pot_khuyenmai': 'Khuyến mại',
    'cf_pot_sochinhanh': 'Số chi nhánh',
    'cf_pot_hinhthuctt': 'Hình thức thanh toán',
    'amount': 'Thành tiền'
  }
}

export const checkConditionalRequiredFields = (data) => {
  let sales_stage = _.get(data, 'sales_stage.value')
  if (sales_stage) {
    if (sales_stage === 'Chờ Xét Duyệt' || sales_stage === 'ClosedWon') {
      let customer_type = _.get(data, 'customer_type.value')
      let fields = undefined
      let requiredFields = []
      if (customer_type) {
        switch (customer_type) {
          case 'Cá nhân':
            fields = _.get(conditionalRequiredFields, 'personal')
            break
          case 'Công ty':
            fields = _.get(conditionalRequiredFields, 'company')
            break
          default:
            break
        }
      }
      if (fields !== undefined) {
        // check additional required fields
        for (let prop in fields) {
          if (fields.hasOwnProperty(prop) && _.isEmpty(data[prop])) {
            requiredFields.push(fields[prop])
          }
        }
      }
      if (!_.isEmpty(requiredFields)) {
        alert('Vui lòng nhập các trường dữ liệu sau: \r\n' + requiredFields.join('\r\n'))
        // let toFocus = requiredIDs[0]
        // let input = document.querySelectorAll('input[name$="' + toFocus + '"]')[0]
        // if (input) input.focus()
        return 'BREAKPOINT'
      } else return 'CONTINUE'
    } else return 'CONTINUE'
  } else return 'CONTINUE'
}

export const focusParentDateInput = (e) => {
  let input = e.target.previousSibling
  if (input) {
    input.click() /* For mobile users */
    input.focus() /* For pc users */
  }
}

export const clearError = (name) => {
  let labelError = document.getElementById(name + '-error')
  if (labelError) labelError.remove()
}

export const addError = (name, content) => {
  if (!document.getElementById(name + '-error')) {
    let nameField = document.getElementById(name + '-wrapper')
    let error = document.createElement('label')
    error.setAttribute('class', 'expandable-form-label-error')
    error.setAttribute('id', name + '-error')
    let node = document.createTextNode(content)
    error.appendChild(node)
    nameField.appendChild(error)
  }
  return false
}

export const validateRequiredField = (value, name) => {
  /* value = value of field */
  /* name = name of field */
  if (!_.isEmpty(value)) return true
  else {
    addError(name, 'Vui lòng không để trống')
    return false
  }
}

export const validateMaxLength = (value, name, length = 255) => {
  if (value.length <= length) return true
  else {
    addError(name, 'Vui lòng nhập ít hơn 255 kí tự')
    return false
  }
}

export const validateOnlyNumbers = (value, name, length = 255) => {
  let regex = /^[0-9]{1,255}$/g
  if (value.length <= length && regex.test(value)) return true
  else {
    addError(name, 'Vui lòng chỉ nhập số')
    return false
  }
}

export const getSessionFromLocalStorage = () => {
  let userLoginData = localStorage.getItem('userLoggedInKV')
  userLoginData = JSON.parse(userLoginData).result.login
  return userLoginData.session
}
