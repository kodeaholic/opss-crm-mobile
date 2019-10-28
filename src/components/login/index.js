import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'
import { toast } from 'react-toastify'

import {
  requestLogin,
  getUserLoggedIn,
  getLoading,
  getMessageError
} from '../../modules/loginDuck'

import './login.css'

const group = ['citigo.com.vn', 'citigo.net', 'kiotviet.com']

const mapStateToProps = state => ({
  loggingIn: getLoading(state),
  userLogged: getUserLoggedIn(state),
  messageError: getMessageError(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ requestLogin }, dispatch)
})

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      submitted: false,
      usernameReset: '',
      emailReset: '',
      submittedReset: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderPopup = this.renderPopup.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  handlePopupOpen = () => {
    var modal = document.getElementById('myModal')
    modal.style.display = 'block'
  }

  handlePopupClose = () => {
    var modal = document.getElementById('myModal')
    modal.style.display = 'none'
  }

  handleSubmitForgetPass = () => {
    const { usernameReset, emailReset } = this.state
    this.setState({ submittedReset: true })
    if (usernameReset && emailReset) {
      if (!this.validateEmail(emailReset))
        return toast.error('Email không đúng định dạng')
      const words = emailReset.split('@')
      console.log('thailog test email', group.indexOf(words))
      if (group.indexOf(words) < 0)
        return toast.error(
          'Email không hợp lệ! Email phải thuộc tổ chức của Citigo, bao gồm: citigo.com.vn, citigo.net, kiotviet.com'
        )
      // this.props.actions.requestLogin({ username, password })
    } else {
      return toast.error('Tên đăng nhập và email không được để trống')
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { username, password } = this.state
    if (username && password) {
      this.props.actions.requestLogin({
        username: username.toLowerCase(),
        password
      })
    } else {
      return toast.error('Tên đăng nhập hoặc mật khẩu chưa đúng')
    }
  }

  renderPopup() {
    const { usernameReset, emailReset, submittedReset } = this.state
    return (
      <div id="myModal" className="modal-popup">
        <div className="modal-content-popup">
          <div className="modal-header-popup">
            <span
              className="modal-close-popup"
              onClick={() => this.handlePopupClose()}>
              &times;
            </span>
            <span className="modal-header-title">Quên mật khẩu</span>
          </div>
          <div className="modal-body-popup">
            <div
              className={
                (submittedReset && !usernameReset ? ' has-error' : '')
              }>
              <label htmlFor="usernameReset">Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                name="usernameReset"
                value={usernameReset}
                onChange={this.handleChange}
              />
            </div>
            <div
              className={
                (submittedReset && !emailReset ? ' has-error' : '')
              }>
              <label htmlFor="emailReset">Email</label>
              <input
                type="text"
                className="form-control"
                name="emailReset"
                value={emailReset}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="modal-footer-popup">
            <button
              className="btn btn-primary"
              onClick={() => this.handleSubmitForgetPass()}>
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loggingIn, userLogged } = this.props
    const { username, password, submitted } = this.state
    if (!_.isEmpty(userLogged)) {
      return <Redirect to={'/'} />
    }
    return (
      <div className="col-md-6 col-md-offset-3">
        {this.renderPopup()}
        <div className="login-header-logo">
          <img
            alt="load"
            src={require('../../static/images/logo-kiotviet.png')}
            className="responsive-image-logo"
          />
        </div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div
            className={
              (submitted && !username ? ' has-error' : '')
            }>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div
            className={
               (submitted && !password ? ' has-error' : '')
            }>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          <div className="btn-login-forgetPass">
            <button className="btn btn-primary kv-btn-login">Đăng nhập</button>
            {loggingIn && (
              <img
                alt="load"
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
              />
            )}
            <label
              className="btn-link btn-forgetPass"
              onClick={() => this.handlePopupOpen()}>
              Quên mật khẩu?
            </label>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
