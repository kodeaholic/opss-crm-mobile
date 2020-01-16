import React, { Component } from 'react'
// import Input from '../../commonComponents/input'

import './view.css'
import _ from 'lodash'
import DetailView from '../../commonComponents/detail-view'

class ContactView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'DETAILS'
    }
  }

  render() {
    if(_.isEmpty(this.props.data, true)) {
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
    } else {
      return (
        <DetailView data={{data: this.props.data, setype: 'opportunity'}}/>
      )
    }
  }
}

export default ContactView
