import React, { Component } from 'react'
import Button from '../commonComponents/button'
import Select from 'react-select';
import './index.css'

/* import action creators */
import  {
  fetchDropdownData,
  requestSaveLead,
  reinitializeSaveLeadStatus
} from '../../modules/saveLeadDuck'

/* import selector */
import {
  getLeadSources,
  getLoadingStatus,
  getAssignableUsers,
  getIndustries,
  getRegion,
  getSaveLeadStatus,
  getLog
} from '../../modules/saveLeadDuck'
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'
import withLayout from '../withLayout'
import withAuth from '../withAuth'
import { connect } from 'react-redux'
import { getUserLoggedIn } from '../../modules/loginDuck'
import { toast } from 'react-toastify'

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchDropdownData,
      requestSaveLead,
      reinitializeSaveLeadStatus
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
  region: getRegion(state),
  saveLeadStatus: getSaveLeadStatus(state),
  log: getLog(state)
})

class AddNewCustomer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assignedUser: this.props.userLoggedIn.userid,
      leadstatus: 'New',
      lastname: '',
      phone: '',
      mobile: '',
      website: '',
      description: '',
      leadsource: undefined,
      cf_lead_khu_vuc: undefined,
      assigned_user_id: this.props.userLoggedIn.userid,
      industry: undefined
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onSelectChange(name, value) {
    let obj = {};
    obj[name] = value.value;
    this.setState(obj);
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    let data = this.state
    let session = this.props.userLoggedIn.session
    if(!session){
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.props.actions.requestSaveLead({session, data})
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
          <button type="button" className="btn-add-new-lead" onClick={this.handleSubmit}>
            Lưu
          </button>
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
            name="lastname"
            type="text"
            className="input-input-common-component"
            defaultValue=""
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Tên gian hàng
          </label>
          <input
            name="website"
            type="text"
            className="input-input-common-component"
            defaultValue=""
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Số điện thoại<span className="require-input-common-component"> (*)</span>
          </label>
          <input
            name="mobile"
            type="text"
            className="input-input-common-component"
            defaultValue=""
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Số điện thoại khác
          </label>
          <input
            name="phone"
            type="text"
            className="input-input-common-component"
            defaultValue=""
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Ngành hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            placeholder="Ngành hàng"
            options={this.props.industries}
            onChange={this.onSelectChange.bind(this, 'industry')}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Khu vực<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            placeholder="Khu vực"
            options={this.props.region}
            onChange={this.onSelectChange.bind(this, 'cf_lead_khu_vuc')}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Nguồn khách hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            placeholder="Nguồn khách hàng"
            options={this.props.leadSource}
            onChange={this.onSelectChange.bind(this, 'leadsource')}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Người xử lý<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            placeholder="Người xử lý"
            defaultValue={defaultSelectedUser}
            options={this.props.assignableUsers}
            onChange={this.onSelectChange.bind(this, 'assigned_user_id')}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Mô tả chung
          </label>
          <textarea
            name="description"
            className="input-input-common-component"
            rows="5"
            onChange={this.handleChange}
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
      if (this.props.saveLeadStatus === "success"){
        toast.success("Success!")
        this.props.actions.reinitializeSaveLeadStatus({})
        return (
          <div className="container-addnewcust">
            {this.renderButton()}
          </div>
        )
      }
      else if (this.props.saveLeadStatus === "failed") {
        toast.error("Failed!")
        toast.error(this.props.log) // remove when going production
        this.props.actions.reinitializeSaveLeadStatus({})
        return (
          <div className="container-addnewcust">
            {this.renderButton()}
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
}

export default compose(
  withLayout(),
  withAuth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewCustomer)