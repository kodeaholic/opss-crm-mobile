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

export const fakeCalendarData = {
  "success": true,
  "result": {
    "items": [
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609562",
        "start": "2020-03-01 10:57",
        "end": "2020-03-01 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609563",
        "start": "2020-03-01 10:57",
        "end": "2020-03-01 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609564",
        "start": "2020-03-01 10:57",
        "end": "2020-03-01 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "Demo phần mềm",
        "status": "Chưa làm",
        "activitytype": "Task",
        "id": "11426840",
        "start": "2020-03-03 00:30",
        "end": "2020-03-03 00:35",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "Demo phần mềm",
        "status": "Chưa làm",
        "activitytype": "Task",
        "id": "11426834",
        "start": "2020-03-03 23:30",
        "end": "2020-03-03 23:35",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609624",
        "start": "2020-03-07 10:57",
        "end": "2020-03-07 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609625",
        "start": "2020-03-07 10:57",
        "end": "2020-03-07 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609627",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609628",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609630",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609633",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609634",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609636",
        "start": "2020-03-09 10:57",
        "end": "2020-03-09 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609639",
        "start": "2020-03-10 10:57",
        "end": "2020-03-10 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609646",
        "start": "2020-03-11 10:57",
        "end": "2020-03-11 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609647",
        "start": "2020-03-11 10:57",
        "end": "2020-03-11 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609648",
        "start": "2020-03-12 10:57",
        "end": "2020-03-12 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609652",
        "start": "2020-03-13 10:57",
        "end": "2020-03-13 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609653",
        "start": "2020-03-13 10:57",
        "end": "2020-03-13 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609654",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609656",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609657",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609660",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609661",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Hủy",
        "activitytype": "Task",
        "id": "8609663",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Hủy",
        "activitytype": "Task",
        "id": "8609666",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609667",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609668",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609669",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609671",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609673",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609676",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609677",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609679",
        "start": "2020-03-14 10:57",
        "end": "2020-03-14 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "7385901",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385902",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "7385903",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385904",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385905",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385906",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385907",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385908",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385910",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385911",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385912",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385913",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385915",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385917",
        "start": "2020-03-14 15:45",
        "end": "2020-03-14 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609681",
        "start": "2020-03-15 10:57",
        "end": "2020-03-15 11:07",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8100737",
        "start": "2020-03-15 15:22",
        "end": "2020-03-15 15:32",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "7385920",
        "start": "2020-03-15 15:45",
        "end": "2020-03-15 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385921",
        "start": "2020-03-15 15:45",
        "end": "2020-03-15 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "7385924",
        "start": "2020-03-15 15:45",
        "end": "2020-03-15 15:55",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609735",
        "start": "2020-03-20 10:58",
        "end": "2020-03-20 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609737",
        "start": "2020-03-20 10:58",
        "end": "2020-03-20 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Hủy",
        "activitytype": "Task",
        "id": "8609738",
        "start": "2020-03-20 10:58",
        "end": "2020-03-20 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609739",
        "start": "2020-03-20 10:58",
        "end": "2020-03-20 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609740",
        "start": "2020-03-20 10:58",
        "end": "2020-03-20 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609741",
        "start": "2020-03-21 10:58",
        "end": "2020-03-21 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609743",
        "start": "2020-03-21 10:58",
        "end": "2020-03-21 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609746",
        "start": "2020-03-22 10:58",
        "end": "2020-03-22 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609748",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609749",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609750",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609751",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609752",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609753",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8609754",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8609755",
        "start": "2020-03-24 10:58",
        "end": "2020-03-24 11:08",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8611951",
        "start": "2020-03-29 11:12",
        "end": "2020-03-29 11:22",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Hủy",
        "activitytype": "Task",
        "id": "8098588",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098589",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098591",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098593",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098594",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098597",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098598",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098600",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098602",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098603",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098604",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098605",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098606",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098608",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098609",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đã làm",
        "activitytype": "Task",
        "id": "8098610",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098611",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098612",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "cf_task_loaicongviec": "CSKH Ngưng sử dụng",
        "status": "Đang làm",
        "activitytype": "Task",
        "id": "8098614",
        "start": "2020-03-31 15:07",
        "end": "2020-03-31 15:17",
        "module": "Calendar"
      },
      {
        "id": "11426833",
        "activitytype": "Công việc khác",
        "status": "Chưa gặp",
        "start": "2020-03-03 23:00",
        "end": "2020-03-03 23:05",
        "fullname": "Nguyễn Tùng Lâm - Tái ký và DV",
        "module": "Events"
      }
    ],
    "users": [
      {
        "label": "Nguyễn Tùng Lâm - Tái ký và DV",
        "value": "4158"
      }
    ],
    "taskDays": [
      "2020-03-01",
      "2020-03-03",
      "2020-03-07",
      "2020-03-09",
      "2020-03-10",
      "2020-03-11",
      "2020-03-12",
      "2020-03-13",
      "2020-03-14",
      "2020-03-15",
      "2020-03-20",
      "2020-03-21",
      "2020-03-22",
      "2020-03-24",
      "2020-03-29",
      "2020-03-31"
    ],
    "eventDays": [
      "2020-03-03"
    ],
    "days": [
      "2020-03-01",
      "2020-03-03",
      "2020-03-07",
      "2020-03-09",
      "2020-03-10",
      "2020-03-11",
      "2020-03-12",
      "2020-03-13",
      "2020-03-14",
      "2020-03-15",
      "2020-03-20",
      "2020-03-21",
      "2020-03-22",
      "2020-03-24",
      "2020-03-29",
      "2020-03-31"
    ]
  }
}
