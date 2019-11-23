/* default import */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {toast} from 'react-toastify'
import { Redirect } from 'react-router-dom'

/* react-redux */
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'

/* app */
import withAuth from '../withAuth'
import withLayout from '../withLayout'

/* predefined actions and selectors for mapStateToProps and mapDispatchToProps */
import { getUserLoggedIn } from '../../modules/loginDuck'
import { fetchLeadRecord, getCurrentOption, getLeadData, getLoadingStatus, requestSaveLead, getFormSubmitResponseStatus } from '../../modules/leadDuck'
import { getSessionStatus } from '../../modules/sessionDuck'

/* import child views */
import LeadView from './view/view'
import LeadForm from './view/form'
const mapStateToProps = (state, ownProps) => ({
  expired: getSessionStatus(state),
  currentUser: getUserLoggedIn(state),
  leadData: getLeadData(state),
  option: getCurrentOption(state),
  loading: getLoadingStatus(state),
  formSubmitResponseStatus: getFormSubmitResponseStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchLeadRecord,
      requestSaveLead
    },
    dispatch
  )
})

class LeadComponent extends Component {
  constructor(props) {
    super(props)
    let option = undefined
    let pathName = props.location.pathname
    if (pathName.indexOf('view') !== -1) option = 'view'
    else if (pathName.indexOf('edit') !== -1) option = 'edit'
    else option = 'create'
    let array = pathName.split('/')
    this.state = {
      leadData: {
        lastname: undefined,
        leadstatus: undefined,
        website: undefined,
        phone: undefined,
        mobile: undefined,
        industry: undefined,
        cf_lead_khu_vuc: undefined,
        leadsource: undefined,
        assigned_user_id: undefined,
        description: undefined,
        record: array.length > 2 ? array[2] : undefined
      },
      viewOrCreateOrUpdate: option, // default,
      recordId: array.length > 2 ? array[2] : undefined,
      session: undefined
    }
  }

  componentWillMount() {
    const {currentUser} = this.props
    let session = undefined
    if (currentUser) session = currentUser.session
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.setState({session: session})
    let record = this.state.recordId
    console.log("WillMount: current session - " + session)
    console.log("WillMount: current option - " + this.state.viewOrCreateOrUpdate)
    console.log("WillMount: record: " + record)
    let option = this.state.viewOrCreateOrUpdate
    switch (this.state.viewOrCreateOrUpdate) {
      case 'view':
        this.props.actions.fetchLeadRecord({session, record, option})
        break;
      case 'create':
        break;
      case 'edit':
        this.props.actions.fetchLeadRecord({session, record, option})
        break;
      default:
        break;
    }
  }

  render() {
    /* check if view, create, or update */
    if(this.props.expired) {
      localStorage.removeItem('userLoggedInKV')
      return <Redirect to={'/login'} />
    }
    if(this.props.loading) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{position: 'fixed', top: 'calc(50vh - 50.25px)'}}></i>
          </div>
        </div>
      )
    }
    else {
      if (this.props.formSubmitResponseStatus && (this.props.location.pathname.indexOf('view') === -1)) {
        toast.success("Success", {
          autoClose: 2000,
          draggable: false,
        })
        return <Redirect to={'/lead-view/' + this.props.leadData.record} />
      }
      if (this.props.option === 'view') {
        return (
          <LeadView data={this.props.leadData}/>
        )
      }
      else if (this.props.option === 'edit' || this.props.option === 'create') {
        return (
          <LeadForm data={this.props.leadData} session={this.state.session} option={this.props.option} submit={this.props.actions.requestSaveLead}/>
        )
      }
    }
    return (
      <div>Default</div>
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
)(LeadComponent)
