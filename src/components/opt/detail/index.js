import React, { Component } from 'react'
import withAuth from '../../withAuth'
import withLayout from '../../withLayout'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getSessionFromLocalStorage } from '../create/common'
import {
  getOpportunityData,
  getLoadingStatus,
  fetchOpportunityRecord
} from '../../../modules/opportunityDuck'
import { getSessionStatus, getUserLoggedIn } from '../../../modules/loginDuck'
import ExpandableFormComponent from '../create/expandable-form'

import './index.css'
import Select from 'react-select'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import OptPhanMemViewComponent from './opt-phanmem'
const mapStateToProps = (state) => ({
  expired: getSessionStatus(state),
  currentUser: getUserLoggedIn(state),
  potentialData: getOpportunityData(state),
  loading: getLoadingStatus(state),
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchOpportunityRecord,
    },
    dispatch
  )
})

class PotentialDetailComponent extends Component {

  componentWillMount() {
    let { currentUser } = this.props
    let session = null
    if (currentUser) session = currentUser.session
    if (_.isEmpty(session)) {
      session = getSessionFromLocalStorage()
    }
    this.setState({ session: session })
    let pathname = this.props.location.pathname
    let record = pathname.split('/')[2]
    this.props.actions.fetchOpportunityRecord({ session, record })
  }

  render() {
    /* For navigation back purpose */
    let pathBack = this.props.location.search
    pathBack = pathBack.substring(pathBack.indexOf('pathBack=') + 9)
    /* Session expired handler */
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
      let potentialData = this.props.potentialData
      switch (potentialData.potentialname) {
        case 'Hợp đồng phần mềm':
          return (<OptPhanMemViewComponent potentialData={potentialData}/>)
        default:
          return (<div/>)
      }
    }
  }
}

export default compose(
  withAuth(),
  withLayout(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PotentialDetailComponent)
