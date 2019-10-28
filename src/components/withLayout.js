import React, { Component } from 'react'
import Header from './header'
import Footer from './footer'

const withLayout = () => WrappedComponent => {
  return class HOC extends Component {
    render() {
      return (
        <div className="with-layout-container" >
          <Header />
          <WrappedComponent {...this.props} thai="111" />
          <Footer />
        </div>
      )
    }
  }
}

export default withLayout
