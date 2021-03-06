import React, { Component } from 'react'

import './view.css'
import _ from 'lodash'
import DetailView from '../../commonComponents/detail-view'

class LeadView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'DETAILS'
    }
  }

  render() {
    if(_.isEmpty(this.props.data, true)) {
      return (<div className="lead-view-container"
                   style={{height: 'calc(100vh)', overflow: 'scroll', position: 'absolute', top: '0', width: '100%'}}><div className="loading-data">Permission Denied</div></div>)
    } else {
      return (
        <DetailView data={{data: this.props.data, setype: 'lead'}}/>
      )
    }
  }
}

export default LeadView