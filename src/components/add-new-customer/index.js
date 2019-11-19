import React, { Component } from 'react'
import Button from '../commonComponents/button'
import Input from '../commonComponents/input'
import Select from 'react-select';
import './index.css'

/* import action creators */
import  {
  fetchDropdownData
} from '../../modules/addLeadDuck'

/* import selector */
import {
  getLeadSources,
  getLoadingStatus,
  getAssignableUsers,
  getIndustries,
  getRegion
} from '../../modules/addLeadDuck'
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'
import withLayout from '../withLayout'
import withAuth from '../withAuth'
import { connect } from 'react-redux'
import { getUserLoggedIn } from '../../modules/loginDuck'

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchDropdownData
    },
    dispatch
  )
})

const mapStateToProps = state => ({
  userLoggedIn: getUserLoggedIn(state),
  industries: getIndustries(state),
  leadSource: getLeadSources(state),
  assignableUsers: getAssignableUsers(state),
  isLoading: getLoadingStatus(state),
  region: getRegion(state)
})

class AddNewCustomer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const { userLoggedIn } = this.props
    let { session } = userLoggedIn || {}
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if(userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
      }
      else {
        this.props.history.push('/login')
      }
    }
    this.props.actions.fetchDropdownData({ session })
  }

  renderButton = () => {
    const pathToGoBack = '/lead'

    return (
      <div className="wrapper-button-addnewcustomer">
        <div className="addnewcustomer-button">
          <Button label="Hủy" path={pathToGoBack}></Button>
        </div>
        <div className="addnewcustomer-button">
          <Button label="Lưu" path={pathToGoBack}></Button>
        </div>
      </div>
    )
  }

  renderForm = () => {
    let {userid} = this.props.userLoggedIn
    let defaultSelectedUser = this.props.assignableUsers.find(function(item) {
      return item.value === userid
    })
    return (
      <div className="addnewcustomer-feild">
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Họ tên khách hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <input
            name="leadName"
            type="text"
            className="input-input-common-component"
            defaultValue=""
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Tên gian hàng
          </label>
          <input
            name="leadWebsite"
            type="text"
            className="input-input-common-component"
            defaultValue=""
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Số điện thoại<span className="require-input-common-component"> (*)</span>
          </label>
          <input
            name="leadPhone"
            type="text"
            className="input-input-common-component"
            defaultValue=""
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Số điện thoại khác
          </label>
          <input
            name="leadSecondaryPhone"
            type="text"
            className="input-input-common-component"
            defaultValue=""
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Ngành hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            options={this.props.industries}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Khu vực<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            options={this.props.region}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Nguồn khách hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            options={this.props.leadSource}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Người xử lý<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            value={defaultSelectedUser}
            options={this.props.assignableUsers}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Mô tả chung
          </label>
          <textarea
            name="leadGeneralDescription"
            className="input-input-common-component"
            rows="5"
          />
        </div>
      </div>
    )
  }

  render() {
    if (this.props.isLoading){
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="container-addnewcust">
          {this.renderButton()}
          {this.renderForm()}
        </div>
      )
    }
  }
}

export default compose(
  withLayout(),
  withAuth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewCustomer)