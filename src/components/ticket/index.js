import React, { Component } from 'react'
import withAuth from '../withAuth'
import withLayout from '../withLayout'
import compose from 'recompose/compose'
class Ticket extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <div style={{ paddingTop: 50 }}>Ticket page</div>
  }
}

export default compose (
  withAuth(),
  withLayout()
)(Ticket)