import React, {Component} from 'react'

import './index.css'
import compose from 'recompose/compose'
import withLayout from '../../withLayout'
class CalendarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        Lich lam viec
      </div>
    )
  }
}

export default compose(

  withLayout()
)(CalendarComponent)
