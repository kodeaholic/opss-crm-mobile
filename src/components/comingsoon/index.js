import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withFooter from '../withFooter'

import './index.css'

class ComingSoon extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  countdownTimer = () => {
    const difference = +new Date("2020-01-01") - +new Date();
    let remaining = "Team OPSS xin chúc bạn một năm mới hạnh phúc!";

    if (difference > 0) {
      let parts = {
        days: ("0" + Math.floor(difference / (1000 * 60 * 60 * 24))).slice(-2),
        hours: ("0" + Math.floor((difference / (1000 * 60 * 60)) % 24)).slice(-2),
        minutes: ("0" + Math.floor((difference / 1000 / 60) % 60)).slice(-2),
        seconds: ("0" + Math.floor((difference / 1000) % 60)).slice(-2)
      };

      remaining =
        `
        <div class="count-down-wrapper">
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #D68528;">${parts['days']}</div>
            <div class="count-down-item-label" style="color: #D68528;">days</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #DF9639;">${parts['hours']}</div>
            <div class="count-down-item-label" style="color: #DF9639;">hours</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #E8A84A;">${parts['minutes']}</div>
            <div class="count-down-item-label" style="color: #E8A84A;">minutes</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #ECB253;">${parts['seconds']}</div>
            <div class="count-down-item-label" style="color: #ECB253;">seconds</div>
          </div>
        </div>
      `
    }
    let timer = document.getElementById('count-down')
    if (timer) {
      timer.innerHTML = remaining
    }
  }

  componentDidMount() {
    this.countdownTimer();
    let timeInterval = setInterval(this.countdownTimer, 1000)
    this.setState({timeInterval: timeInterval})
  }

  componentWillUnmount() {
    clearInterval(this.state.timeInterval)
  }

  render(){
    return (
      <div className="wrapper">
        <div className="coming-soon-header">
          <img
            className="coming-soon-header-image"
            alt="Citigo"
            src={require('../../static/images/citigo.png')}
            style={{maxWidth: '155px'}}
          />
          <div className="coming-soon-header-image">
            &nbsp;
          </div>
          <img
            className="coming-soon-header-image"
            alt="CRM"
            src={require('../../static/images/app-logo.png')}
            style={{maxWidth: '70px'}}
          />
        </div>
        <div id="count-down" style={{marginTop: '20px'}}/>
      </div>
    )
  }

}

export default compose(
  withFooter(),
  withAuth(),
)(ComingSoon)
