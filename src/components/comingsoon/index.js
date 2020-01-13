import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withFooter from '../withFooter'

import './index.css'
import './firework.css'

class ComingSoon extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  countdownTimer = () => {
    const difference = +new Date("2020-01-25T00:00:00") - +new Date();
    let remaining = undefined

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
            <div class="count-down-item-value" style="color: #ECB253;">${parts['days']}</div>
            <div class="count-down-item-label" style="color: #ECB253;">days</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #ECB253;">${parts['hours']}</div>
            <div class="count-down-item-label" style="color: #ECB253;">hours</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #ECB253;">${parts['minutes']}</div>
            <div class="count-down-item-label" style="color: #ECB253;">minutes</div>
          </div>
          <div class="count-down-item">
            <div class="count-down-item-value" style="color: #ECB253;">${parts['seconds']}</div>
            <div class="count-down-item-label" style="color: #ECB253;">seconds</div>
          </div>
        </div>
      `
    }
    let timer = document.getElementById('count-down')
    if (timer && remaining) {
      timer.innerHTML = remaining
    }
    else {
      let backGroundContainer = document.getElementsByClassName('with-footer-container')[0]
      backGroundContainer.classList.add('times-up')
    }
  }

  componentWillMount() {
    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior= 'contain'
  }

  componentDidMount() {
    this.countdownTimer();
    let timeInterval = setInterval(this.countdownTimer, 1000)
    this.setState({timeInterval: timeInterval})
  }

  componentWillUnmount() {
    clearInterval(this.state.timeInterval)
    /* Prevent browser's default pull to refresh behavior*/
    document.body.style.overscrollBehavior= 'auto'
  }

  render(){
    return (
      <div className="wrapper">
        <div className="coming-soon-header">
          <img
            className="coming-soon-header-image"
            alt="Citigo"
            src={require('../../static/images/citigo.png')}
            style={{width: '115px'}}
          />
          {/*<div className="coming-soon-header-image">*/}
          {/*  &nbsp;*/}
          {/*</div>*/}
          {/*<img*/}
          {/*  className="coming-soon-header-image"*/}
          {/*  alt="CRM"*/}
          {/*  src={require('../../static/images/app-logo.png')}*/}
          {/*  style={{maxWidth: '70px'}}*/}
          {/*/>*/}
        </div>
        <div id="count-down" style={{marginTop: '10px', 'color': '#ffffff', fontFamily: 'Roboto', textAlign: 'center'}}/>
        <div className="pyro">
          <div className="before"/>
          <div className="after"/>
        </div>
      </div>
    )
  }

}

export default compose(
  withFooter(),
  withAuth(),
)(ComingSoon)
