import React from 'react'
import { Redirect } from 'react-router'

export default class LogoutComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    localStorage.removeItem('userLoggedInKV')
    localStorage.removeItem('session')
    return <Redirect to={'/login'} />
  }
}