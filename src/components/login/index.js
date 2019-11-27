import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { activateSession} from '../../modules/sessionDuck'
import {
  requestLogin,
  getUserLoggedIn,
  getLoading,
  getMessageError,
  requestSendForgetPass,
  changePopupStatus,
  getIsShowPopupResetPassword,
  getLoadingSendPassword
} from '../../modules/loginDuck'

import './login.css'

const group = ['citigo.com.vn', 'citigo.net', 'kiotviet.com', 'gmail.com']

const mapStateToProps = state => ({
  loggingIn: getLoading(state),
  userLogged: getUserLoggedIn(state),
  messageError: getMessageError(state),
  isShowPopupResetPassword: getIsShowPopupResetPassword(state),
  isLoadingSendForgetPassword: getLoadingSendPassword(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { requestLogin, requestSendForgetPass, changePopupStatus, activateSession },
    dispatch
  )
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
    // var modal = document.getElementById('myModal')
    // modal.style.display = 'block'
    this.props.actions.changePopupStatus()
  }

  handlePopupClose = () => {
    // var modal = document.getElementById('myModal')
    // modal.style.display = 'none'
    this.props.actions.changePopupStatus()
  }

  handleSubmitForgetPass = () => {
    const { usernameReset, emailReset } = this.state
    this.setState({ submittedReset: true })
    if (usernameReset && emailReset) {
      if (!this.validateEmail(emailReset)) {
        return toast.error('Email không đúng định dạng')
      }
      const words = emailReset.split('@')
      if (group.indexOf(words[1]) < 0) {
        debugger
        return toast.error(
          'Email không hợp lệ! Email phải thuộc tổ chức của Citigo, bao gồm: citigo.com.vn, citigo.net, kiotviet.com'
        )
      }
      return this.props.actions.requestSendForgetPass({
        username: usernameReset.toLowerCase(),
        email: emailReset.toLowerCase()
      })
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
        password: password.toLowerCase()
      })
    } else {
      return toast.error('Tên đăng nhập hoặc mật khẩu chưa đúng')
    }
  }

  renderPopup() {
    const { usernameReset, emailReset, submittedReset } = this.state
    const { isLoadingSendForgetPassword } = this.props
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
                submittedReset && !usernameReset
                  ? ' has-error modal-body-popup-input'
                  : 'modal-body-popup-input'
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
                submittedReset && !emailReset
                  ? ' has-error modal-body-popup-input'
                  : 'modal-body-popup-input'
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
            {isLoadingSendForgetPassword && (
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loggingIn, userLogged } = this.props
    const { username, password, submitted } = this.state
    if (!_.isEmpty(userLogged)) {
      this.props.actions.activateSession({undefined})
      return <Redirect to={'/lead'} />
    }
    return (
      <div className="col-md-6 col-md-offset-3">
        {this.props.isShowPopupResetPassword ? this.renderPopup() : null}
        <div className="login-header-logo">
          <img
            alt="load"
            src={require('../../static/images/logo-kiotviet.png')}
            className="responsive-image-logo"
          />
        </div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className={submitted && !username ? ' has-error' : ''}>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div className={submitted && !password ? ' has-error' : ''}>
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
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
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
