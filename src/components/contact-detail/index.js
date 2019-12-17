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
  fetchContactRecord,
  getCurrentOption,
  getContactData,
  getLoadingStatus,
  requestSaveContact,
  getFormSubmitResponseStatus, getCities, getMapCityState
} from '../../modules/contactDuck'
import { getSessionStatus } from '../../modules/loginDuck'

/* import child views */
import ContactView from './view/view'
import ContactForm from './view/form'

const mapStateToProps = (state, ownProps) => ({
  expired: getSessionStatus(state),
  currentUser: getUserLoggedIn(state),
  contactData: getContactData(state),
  option: getCurrentOption(state),
  loading: getLoadingStatus(state),
  formSubmitResponseStatus: getFormSubmitResponseStatus(state),
  cities: getCities(state),
  mapCityState: getMapCityState(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchContactRecord,
      requestSaveContact
    },
    dispatch
  )
})

class ContactComponent extends Component {
  constructor(props) {
    super(props)
    let option = undefined
    let pathName = props.location.pathname
    if (pathName.indexOf('view') !== -1) option = 'view'
    else option = 'edit'
    let array = pathName.split('/')
    this.state = {
      contactData: {
        record: array.length > 2 ? array[2] : undefined
      },
      viewOrEdit: option, // default,
      recordId: array.length > 2 ? array[2] : undefined,
      session: undefined
    }
  }

  componentWillMount() {
    const { currentUser } = this.props
    let session = undefined
    if (currentUser) session = currentUser.session
    if (!session) {
      let userLoginData = localStorage.getItem('userLoggedInKV')
      userLoginData = JSON.parse(userLoginData).result.login
      session = userLoginData.session
    }
    this.setState({ session: session })
    let record = this.state.recordId
    let option = this.state.viewOrEdit
    switch (option) {
      case 'view':
        this.props.actions.fetchContactRecord({ session, record, option: option })
        break
      case 'edit':
        this.props.actions.fetchContactRecord({ session, record, option: option })
        break
      default:
        break
    }
  }

  render() {
    /* For navigation back purpose */
    let pathBack = this.props.location.search
    pathBack = pathBack.substring(pathBack.indexOf('pathBack=')+9)

    /* check if view or edit */
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
      if (this.props.formSubmitResponseStatus && (this.props.location.pathname.indexOf('view') === -1)) {
        toast.success('Success', {
          autoClose: 2000,
          draggable: false
        })
        return pathBack ? (<Redirect to={'/' + pathBack  }/>) : (<Redirect to={'/contact-view/' + this.props.contactData.record} />)
      }
      if (this.props.option === 'view') {
        return (
          <ContactView data={this.props.contactData}/>
        )
      } else {
        let cities = this.props.cities
        let mapCityState = this.props.mapCityState
        return (
          <ContactForm data={this.props.contactData} session={this.state.session} option={this.props.option}
                       submit={this.props.actions.requestSaveContact}
                       cities={cities}
                       mapCityState={mapCityState}
          />
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
)(ContactComponent)
