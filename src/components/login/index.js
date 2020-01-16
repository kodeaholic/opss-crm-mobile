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
  getMessageError,
  requestSendForgetPass,
  changePopupStatus,
  getIsShowPopupResetPassword,
  getLoadingSendPassword, getSessionStatus
} from '../../modules/loginDuck'

import './login.css'

const group = ['citigo.com.vn', 'citigo.net', 'kiotviet.com', 'gmail.com']

const mapStateToProps = state => ({
  loggingIn: getLoading(state),
  userLogged: getUserLoggedIn(state),
  messageError: getMessageError(state),
  isShowPopupResetPassword: getIsShowPopupResetPassword(state),
  isLoadingSendForgetPassword: getLoadingSendPassword(state),
  sessionStatus: getSessionStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { requestLogin, requestSendForgetPass, changePopupStatus },
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
        password: password
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
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loggingIn, userLogged } = this.props
    const { username, password, submitted } = this.state
    if (!_.isEmpty(userLogged) && !this.props.sessionStatus) {
      return <Redirect to={'/lead'} />
    }
    return (
      <div className="login-container">
        {/*<div className="col-md-12 col-md-offset-12" style={{backgroundImage: 'url("/login-background_25.png")', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', width: '100%', height: '100%'}}>*/}
        {this.props.isShowPopupResetPassword ? this.renderPopup() : null}
        <div className="login-wrapper">
          <div className="login-header-logo-wrapper">
            <div className="login-header-logo">
              <img
                alt="load"
                src={require('../../static/images/app-logo.png')}
                className="responsive-image-logo"
              />
            </div>
          </div>
          <div className="login-header-app-name">
            crm mobile
          </div>
          <form className="form-login" onSubmit={(e) => {e.preventDefault()}}>
            <div className={submitted && !username ? 'form-login-input-wrapper has-error' : 'form-login-input-wrapper'}>
              <div className="input-icon">
                <i className="fa fa-user fa-2x" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="form-login-input"
                name="username"
                value={username}
                onChange={this.handleChange}
                placeholder="Tên đăng nhập"
              />
            </div>
            <div className={submitted && !password ? 'form-login-input-wrapper has-error' : 'form-login-input-wrapper'}>
              <div className="input-icon">
                <i className="fa fa-lock fa-2x" aria-hidden="true" />
              </div>
              <input
                type="password"
                className="form-login-input"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Mật khẩu"
              />
            </div>
            <div className="btn-forgot-password">
              <div onClick={() => this.handlePopupOpen()} style={{backgroundColor: 'transparent', border: 'none'}}>Quên mật khẩu?</div>
            </div>
            <button className="btn-login" onClick={this.handleSubmit}>
              {!loggingIn && "Đăng nhập"}
              {loggingIn && (
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
