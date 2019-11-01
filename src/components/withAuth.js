import React, { Component } from 'react'

const withAuth = () => WrappedComponent => {

  // TODO: try login to get expired token
  return class HOC extends Component {
    render() {
      if (!localStorage.getItem('userLoggedInKV')) {
        this.props.history.push('/login')
      }
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withAuth
