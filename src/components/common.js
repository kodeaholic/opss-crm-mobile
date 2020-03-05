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

export const getWeekDayFromTimeString = (timeString) => {
  let date = new Date(timeString)
  let month = ('0' + (date.getMonth() + 1)).slice(-2)
  let day = ('0' + date.getDate()).slice(-2)
  return date.toLocaleString("vi-VN", {weekday: 'long'}) + " " + day + "/" + month
}

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}