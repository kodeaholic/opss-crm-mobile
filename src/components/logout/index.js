import React from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { requestLogout } from '../../modules/loginDuck'
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { requestLogout },
    dispatch
  )
})
class LogoutComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    this.props.actions.requestLogout({undefined})
  }

  render() {
    localStorage.removeItem('userLoggedInKV')
    localStorage.removeItem('session')
    return <Redirect to={'/login'} />
  }
}
export default connect(
  null,
  mapDispatchToProps
)(LogoutComponent)