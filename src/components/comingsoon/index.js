import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

class ComingSoon extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  countdownTimer = () => {
    const difference = +new Date("2020-01-01") - +new Date();
    let remaining = "Time's up!";

    if (difference > 0) {
      const parts = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };

      remaining = Object.keys(parts)
        .map(part => {
          if (!parts[part]) return;
          return `${parts[part]} ${part}`;
        })
        .join(" ");
    }

    document.getElementById("countdown").innerHTML = remaining;
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
      <div className="wrapper" style={{textAlign: "center", marginTop: '30px'}}>
        <h6 className="rainbow">Tính năng đang phát triển</h6>
        <div id="countdown" style={{marginTop: '20px'}}/>
      </div>
    )
  }

}

export default compose(
  withLayout(),
  withAuth(),
)(ComingSoon)
