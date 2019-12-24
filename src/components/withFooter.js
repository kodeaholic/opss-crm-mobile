import React, { Component } from 'react'
import Footer from './footer'

const withFooter = () => WrappedComponent => {
  return class HOC extends Component {
    render() {
      return (
        <div className="with-footer-container">
          <WrappedComponent {...this.props} />
          <Footer />
        </div>
      )
    }
  }
}

export default withFooter
