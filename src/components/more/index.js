import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'

import _ from 'lodash'
import compose from 'recompose/compose'
import withAuth from '../withAuth'
import withLayout from '../withLayout'

import './index.css'

import { connect } from 'react-redux'
import { getUserLoggedIn } from '../../modules/loginDuck'
import { requestLogout } from '../../modules/loginDuck'
import { bindActionCreators } from 'redux'

const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { requestLogout },
    dispatch
  )
})

class MoreComponent extends Component {
  constructor(props) {
    super(props)
    let userLoginData = localStorage.getItem('userLoggedInKV')
    userLoginData = JSON.parse(userLoginData).result.login
    let lastname = userLoginData.lastname
    this.state = {lastname: lastname}
  }

  // getUserName = () => {
  //   let {lastname} = this.props.userLoggedIn
  //   if (!_.isEmpty(lastname)) {
  //     let userLoginData = localStorage.getItem('userLoggedInKV')
  //     userLoginData = JSON.parse(userLoginData).result.login
  //     lastname = userLoginData.lastname
  //   }
  //   return lastname
  // }

  redirectToLogout = (e) => {
    e.preventDefault()
    window.location.href = 'logout'
    console.log(e.target.getAttribute("href"))
    return false
  }

  renderItemList = (name, path, iconClassName, iconColorCode) => {
    if (path.indexOf('logout') !== -1) {
      return (
        <a className="link-on-more-list" href="/logout" onClick={this.redirectToLogout}>
          <div className="wrapper-96vw-border">
            <div className="more-list-item">
              <div className="more-item-row"><i className="fa fa-sign-out" style={{color: "#00c2a7"}}/><label
                className="label-more-list-item">Logout</label></div>
            </div>
          </div>
        </a>
      )
    }
    return (
      <Link
        className="link-on-more-list"
        key={name}
        to={path}>
        <div className="wrapper-96vw-border">
          <div className="more-list-item">
            <div className="more-item-row">
              <i className={iconClassName} style={{color: iconColorCode}}/><label className="label-more-list-item">{name}</label>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  render() {
    return (
      <div style={{
        width: '100%',
        paddingBottom: '55px',
        paddingTop: '50px',
        height: '100%',
        backgroundColor: '#ffffff'
      }}>
        <div className="extended-header">
          <label className="title">{this.state.lastname}</label>
        </div>
        <div className="more-list">
          {this.renderItemList('Ticket', '/ticket', 'fa fa-ticket', '#ff5500')}
          {this.renderItemList('Calendar', '/more/calendar', 'fa fa-calendar', '#F1AD10')}
          {this.renderItemList('Logout', '/logout', 'fa fa-sign-out', '#00c2a7')}
        </div>
      </div>
    )
  }
}

export default compose(
  withLayout(),
  withAuth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MoreComponent)
