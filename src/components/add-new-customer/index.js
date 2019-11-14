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

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
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
  isLoading: getLoadingStatus(state)
})

class AddNewCustomer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    let { userLoggedIn } = this.props
    let { session } = userLoggedIn
    if(!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
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
    const selectedOption = null
    return (
      <div className="addnewcustomer-feild">
        <Input label="Họ tên khách hàng" isRequire />
        <Input label="Tên gian hàng" />
        <Input label="Số điện thoại" isRequire />
        <Input label="Số điện thoại khác" />
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Ngành hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
          value={selectedOption}
          options={options}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Khu vực<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            value={selectedOption}
            options={options}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Nguồn khách hàng<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            value={selectedOption}
            options={options}
          />
        </div>
        <div className="wrapper-input-common-component">
          <label className="label-input-common-component">
            Người xử lý<span className="require-input-common-component"> (*)</span>
          </label>
          <Select
            value={selectedOption}
            options={options}
          />
        </div>
        <Input label="Số điện thoại khác" />
        <Input label="Mô tả chung" isMultiLine/>
      </div>
    )
  }

  render() {
    return (
      <div className="container-addnewcust">
        {this.renderButton()}
        {this.renderForm()}
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
)(AddNewCustomer)