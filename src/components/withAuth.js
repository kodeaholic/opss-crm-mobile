import React, { Component } from 'react'

const withAuth = () => WrappedComponent => {
  return class HOC extends Component {
    render() {
      if (!localStorage.getItem('user')) {
        this.props.history.push('/login')
      }
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withAuth
