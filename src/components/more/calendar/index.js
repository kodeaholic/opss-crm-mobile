import React, { Component } from 'react'

import './index.css'
import compose from 'recompose/compose'
import withLayout from '../../withLayout'
import withAuth from '../../withAuth'
import Calendar from 'react-calendar'
import { getSessionFromLocalStorage, dateToString, getWeekDayFromTimeString } from '../../common'
/* Redux */
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getFetchedData,
  getStatusOfFetchingRequest,
  getUsers,
  getEventDays,
  getTaskDays,
  getScheduledDays,
  fetchCalendar,
  getCurrentCalendarType,
  calendarType
} from '../../../modules/calendar/calendarDuck'

const mapStateToProps = state => ({
  isFetching: getStatusOfFetchingRequest(state),
  items: getFetchedData(state),
  users: getUsers(state),
  eventDays: getEventDays(state),
  taskDays: getTaskDays(state),
  scheduledDays: getScheduledDays(state),
  currentCalendarType: getCurrentCalendarType(state)
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchCalendar
    },
    dispatch
  )
})

class CalendarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    let session = getSessionFromLocalStorage()
    this.props.actions.fetchCalendar({ session: session, type: calendarType.DAY })
  }

  onCalendarTypeSelected = (e) => {
    let selectedDiv = e.target
    if (selectedDiv) {
      selectedDiv.classList.add('active')
      let type = selectedDiv.getAttribute('data-calendar-type')
      let session = getSessionFromLocalStorage()
      this.props.actions.fetchCalendar({ session: session, type: type })
    }
  }

  renderHeader = () => {
    let type = this.props.currentCalendarType
    let day = type === calendarType.DAY ? ' active' : ''
    let week = type === calendarType.WEEK ? ' active' : ''
    let month = type === calendarType.MONTH ? ' active' : ''
    return (
      <div className="calendar-header">
        <div className="calendar-title">
          Lịch làm việc
        </div>
        <div className="calendar-type-selection">
          <div className={'calendar-option' + day} onClick={this.onCalendarTypeSelected} id={'dayOption'}
               data-calendar-type={calendarType.DAY}>
            Ngày
          </div>
          <div className={'calendar-option' + week} onClick={this.onCalendarTypeSelected} id={'weekOption'}
               data-calendar-type={calendarType.WEEK}>
            Tuần
          </div>
          <div className={'calendar-option' + month} onClick={this.onCalendarTypeSelected} id={'monthOption'}
               data-calendar-type={calendarType.MONTH}>
            Tháng
          </div>

        </div>
      </div>
    )
  }

  areEqualDays = (a, b) => {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  }

  renderVisualCalendar = () => {
    let today = new Date()
    const scheduledDays = this.props.scheduledDays
    return (
      <Calendar
        className="my-calendar"
        view="month"
        calendarType='US'
        value={today}
        showNeighboringMonth={false}
        selectRange={false}
        showDoubleView={false}
        tileClassName={
          (date) => {
            const toCheck = date.date
            const view = date.view
            return view === 'month' && toCheck.getDate() === today.getDate() && toCheck.getMonth() === today.getMonth() && toCheck.getFullYear() === today.getFullYear() ? 'today-date' : ''
          }
        }
        tileContent={(date) => {
          let toCheck = date.date
          return scheduledDays.includes(dateToString(toCheck)) ? (<div className="task-indicator"/>) : ('')
        }}
      />
    )
  }
  renderCalenderBody = () => {
    let currentCalendarType = this.props.currentCalendarType
    let items = this.props.items
    return (
      <div className="calendar-body">
        {currentCalendarType === calendarType.MONTH && this.renderVisualCalendar()}
        <TaskGroup items={items} type={currentCalendarType} label="Label"/>
      </div>
    )
  }

  render() {
    let isFetching = this.props.isFetching
    if (isFetching) {
      return (
        <div className="loading">Loading&#8230;</div>
      )
    } else {
      let items = this.props.items
      if (items.length > 0) {
        return (
          <>
            {this.renderHeader()}
            {this.renderCalenderBody()}
          </>
        )
      } else {
        return (
          <>
            {this.renderHeader()}
            <div className="calendar-body">
              <div style={{ textAlign: 'center', marginTop: '15px', fontFamily: 'Roboto', fontSize: '14px' }}>Empty
              </div>
            </div>
          </>
        )
      }
    }
  }
}

function Tasks(props) {
  const items = props.items
  const type = props.type
  const days = props.scheduledDays
  return items.map((item) =>
    <Task item={item} type={type} key={item.id}/>
  )
}

function TaskGroup(props){
  const items = props.items
  const label = props.label
  const type = props.type
  const result = []
  result.push(<div className="task-group-label">
    {label}
  </div>)
  result.push(items.map((item) =>
    <Task item={item} type={type} key={item.id}/>
  ))
  return result
}

function Task (props) {
  const item = props.item
  const type = props.type
  return (
    <div className="task">
      <div className="task-card">
        <div className="task-avatar">
          <div className="task-avatar-wrapper">
            <span className={'avatar-vertical-helper'}/>
            <img
              alt={''}
              src={require('../../../static/icons/lead.png')}
              className="task-avatar-img"
            />
          </div>
        </div>
        <div className="task-content">
          <div className="task-title">
            {item.status}
            <span className="task-assigned-user">{item.fullname}</span>
          </div>
          <div className="task-text-bold">
            0976551122 | Cô Thảo
          </div>
          <div className="task-type">
            {item.activitytype === 'Task' ? item.cf_task_loaicongviec : item.activitytype}
          </div>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withAuth(),
  withLayout(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CalendarComponent)
