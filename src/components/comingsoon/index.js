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

  render(){
    return (
      <div className="wrapper" style={{textAlign: "center", marginTop: '30px'}}>Tính năng sắp ra mắt trong thời gian sắp tới</div>
    )
  }

}

export default compose(
  withLayout(),
  withAuth(),
)(ComingSoon)
