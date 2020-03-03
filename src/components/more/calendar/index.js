import React, {Component} from 'react'

import './index.css'
import compose from 'recompose/compose'
import withLayout from '../../withLayout'
class CalendarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onCalendarTypeSelected = (e) => {
    // const options = ['dayOption', 'weekOption', 'monthOption']
    /* Inactive current option */
    let currentOptionDiv = document.getElementsByClassName('calendar-option active')[0]
    if (currentOptionDiv) currentOptionDiv.classList.remove('active')
    let selectedDiv = e.target
    if (selectedDiv) selectedDiv.classList.add('active')
  }

  renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="calendar-title">
          Lịch làm việc
        </div>
        <div className="calendar-type-selection">
          <div className="calendar-option active" onClick={this.onCalendarTypeSelected} id={"dayOption"}>
            Ngày
          </div>
          <div className="calendar-option" onClick={this.onCalendarTypeSelected} id={"weekOption"}>
            Tuần
          </div>
          <div className="calendar-option" onClick={this.onCalendarTypeSelected} id={"monthOption"}>
            Tháng
          </div>

        </div>
      </div>
    )
  }

  renderVisualCalendar = () => {

  }
  renderCalenderBody = () => {
    return (
      <div className="calendar-body">
        {this.renderVisualCalendar()}
        {this.renderTask()}
        {this.renderTask()}
      </div>
    )
  }

  renderTask = () => {
    return (
      <div className="task">
        <div className="task-time">
          10:00 - 12:00
        </div>
        <div className="task-card">
          <div className="task-avatar">
            <div className="task-avatar-wrapper">
              <span className={"avatar-vertical-helper"}/>
              <img
                alt={""}
                src={require('../../../static/icons/lead.png')}
                className="task-avatar-img"
              />
            </div>
          </div>
          <div className="task-content">
            <div className="task-title">
              Chưa gặp
              <span className="task-assigned-user">Vu Minh Duc - OPSS</span>
            </div>
            <div className="task-text-bold">
              0976551122 | Cô Thảo
            </div>
            <div className="task-type">
              Hỗ trợ nhập liệu
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderCalenderBody()}
      </>
    )
  }
}

export default compose(

  withLayout()
)(CalendarComponent)
