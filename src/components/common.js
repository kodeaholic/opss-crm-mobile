export const getSessionFromLocalStorage = () => {
  let userLoginData = localStorage.getItem('userLoggedInKV')
  userLoginData = JSON.parse(userLoginData).result.login
  return userLoginData.session
}

export const dateToString = (dateObj, format = 'Y-m-d') => {
  if (format === 'Y-m-d') {
    let month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
    let date = ('0' + dateObj.getDate()).slice(-2)
    let year = dateObj.getFullYear()
    return year + '-' + month + '-' + date
  }
  else {
    return dateObj.toString
  }
}
