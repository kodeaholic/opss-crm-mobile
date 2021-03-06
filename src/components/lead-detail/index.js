/* default import */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'

/* react-redux */
import { bindActionCreators } from 'redux'
import compose from 'recompose/compose'

/* app */
import withAuth from '../withAuth'
import withLayout from '../withLayout'

/* predefined actions and selectors for mapStateToProps and mapDispatchToProps */
import { getUserLoggedIn } from '../../modules/loginDuck'
import {
  fetchLeadRecord,
  getCurrentOption,
  getLeadData,
  getLoadingStatus,
  requestSaveLead,
  getFormSubmitResponseStatus,
  showFormAddLead,
  getViewPermission,
  requestConvertLead,
  getPhoneExists,
  getErrorMsg,
  getCities,
  getMapCityState
} from '../../modules/leadDuck'
import { getSessionStatus } from '../../modules/loginDuck'

/* import child views */
import LeadView from './view/view'
import LeadForm from './view/form'
import LeadConvertForm from './view/convert'

const mapStateToProps = (state, ownProps) => ({
  expired: getSessionStatus(state),
  currentUser: getUserLoggedIn(state),
  leadData: getLeadData(state),
  option: getCurrentOption(state),
  loading: getLoadingStatus(state),
  formSubmitResponseStatus: getFormSubmitResponseStatus(state),
  viewPermission: getViewPermission(state),
  phoneExists: getPhoneExists(state),
  errorMsg: getErrorMsg(state),
  cities: getCities(state),
  mapCityState: getMapCityState(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchLeadRecord,
      requestSaveLead,
      showFormAddLead,
      requestConvertLead
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
    else if (pathName.indexOf('create') !== -1) option = 'create'
    else if (pathName.indexOf('convert') !== -1) option = 'convert'
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
      session: undefined,
      isAdmin: false
    }
  }

  componentWillMount() {
    const { currentUser } = this.props
    let session = undefined
    let isAdmin = false
    let userId = undefined
    let lastName = undefined
    if (currentUser) {
      session = currentUser.session
      isAdmin = currentUser.is_admin
      userId = currentUser.userid
      lastName = currentUser.lastname
    }
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      if (userLoginData) {
        userLoginData = JSON.parse(userLoginData).result.login
        session = userLoginData.session
        isAdmin = userLoginData.is_admin
        userId = userLoginData.userid
        lastName = userLoginData.lastname
      }
    }
    this.setState({ session: session, isAdmin: isAdmin })
    let record = this.state.recordId
    // console.log('WillMount: current session - ' + session)
    // console.log('WillMount: current option - ' + this.state.viewOrCreateOrUpdate)
    // console.log('WillMount: record - ' + record)
    let option = this.state.viewOrCreateOrUpdate
    switch (this.state.viewOrCreateOrUpdate) {
      case 'view':
        this.props.actions.fetchLeadRecord({ session, record, option })
        break
      case 'create':
        let defaultAssignedUser = {
          label: lastName,
          value: '19x' + userId
        }
        this.props.actions.showFormAddLead({ session, option, defaultAssignedUser })
        break
      case 'edit':
        this.props.actions.fetchLeadRecord({ session, record, option })
        break
      case 'convert':
        this.props.actions.fetchLeadRecord({ session, record, option })
        break
      default:
        break
    }
  }

  render() {
    /* For navigation back purpose */
    let pathBack = this.props.location.search
    pathBack = pathBack.substring(pathBack.indexOf('pathBack=')+9)
    let userLoginData = localStorage.getItem('userLoggedInKV')
    if (!userLoginData) {
      return (
        <Redirect to={'/login'}/>
      )
    }
    userLoginData = JSON.parse(userLoginData).result.login
    let currentUserId = userLoginData.userid
    /* check if view, create, or update */
    if (this.props.expired) {
      localStorage.removeItem('userLoggedInKV')
      toast.error('Session expired', {
        autoClose: 1500,
        draggable: false
      })
      return (
        <Redirect to={'/login'}/>
      )
    }
    if (this.props.loading) {
      return (
        <div className="wrapper-lead">
          <div className="loading-data">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"
               style={{ position: 'fixed', top: 'calc(50vh - 50.25px)' }}/>
          </div>
        </div>
      )
    } else {
      if (this.props.formSubmitResponseStatus === 'success' && (this.props.location.pathname.indexOf('view') === -1)) {
        localStorage.setItem('searchResultsChanged', "changed")
        toast.success('Success', {
          autoClose: 2000,
          draggable: false
        })
        if (this.props.location.pathname.indexOf('edit') !== -1 || this.props.location.pathname.indexOf('create') !== -1) {
          return pathBack ? (<Redirect to={'/' + pathBack  }/>) : (<Redirect to={'/lead-view/' + this.props.leadData.record} />)
        } else if (this.props.location.pathname.indexOf('convert') !== -1) {
          // return pathBack ? (<Redirect to={'/' + pathBack  }/>) : (<Redirect to={'/contact-view/' + this.props.leadData.record} />)
          return <Redirect to={'/contact-view/' + this.props.leadData.record} />
        }
      }
      if (this.props.formSubmitResponseStatus === 'failed' && (this.props.location.pathname.indexOf('view') === -1)) {
        if (this.props.errorMsg !== undefined) {
          let msg = this.props.errorMsg
          toast.error(msg, {
            autoClose: 2000,
            draggable: false
          })
        }
        else {
          toast.error('Failed', {
            autoClose: 2000,
            draggable: false
          })
        }
      }
      if (this.props.option === 'view') {
        if (this.props.viewPermission !== undefined && this.props.viewPermission.code === 'ACCESS_DENIED') {
          document.getElementById('wrapper-footer').style.display = 'none'
          return (<div style={{
            height: '50px',
            position: 'fixed',
            top: '50px',
            width: '100%',
            textAlign: 'center',
            verticalAlign: 'middle',
            paddingTop: '10px',
            color: '#000000'
          }}>
            <p style={{fontFamily: 'Roboto'}}>Bạn không có quyền xem (permission denied)</p>
          </div>)
        }
        return (
          <LeadView data={this.props.leadData}/>
        )
      } else if (this.props.option === 'edit' || this.props.option === 'create') {
        let allowed = false
        if (!this.state.isAdmin && this.props.location.pathname.indexOf('create') !== -1) allowed = true
        else if (this.state.isAdmin) {
          allowed = true
        }
        let cities = this.props.cities
        let mapCityState = this.props.mapCityState
        return (
          <LeadForm data={this.props.leadData} session={this.state.session} option={this.props.option}
                    submit={this.props.actions.requestSaveLead} allowedToEditPhone={allowed}
                    allowedToEditLead={this.props.leadData.allowed_to_edit_lead}
                    cities={cities}
                    mapCityState={mapCityState}
          />
        )
      } else if (this.props.option === 'convert' && this.props.leadData.phoneExists === false) {
        return (
          <LeadConvertForm data={this.props.leadData} session={this.state.session}
                           submit={this.props.actions.requestConvertLead}
                           currentUserId={currentUserId}/>
        )
      } else if (this.props.option === 'convert' && this.props.leadData.phoneExists === true) {
        return (<div style={{
          height: '50px',
          position: 'fixed',
          top: '50px',
          width: '100%',
          textAlign: 'center',
          verticalAlign: 'middle',
          paddingTop: '10px',
          color: '#000000'
        }}>
          <p style={{fontFamily: 'Roboto'}}>Lead có số điện thoại này đã được chuyển đổi</p>
        </div>)
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
