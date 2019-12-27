import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
const checkMobileDevice = () => WrappedComponent => {

  // TODO: try login to get expired token
  return class HOC extends Component {

    render() {
      /*
      * Check if app is started form stand-alone mode or not
      */
      if (window.matchMedia('(display-mode: standalone)').matches) {
        if (window.location.href.indexOf('/add-to-home-screen') !== -1)
          return <Redirect to='/lead' />
      }
      else if (window.navigator.standalone === true) {
        if (window.location.href.indexOf('/add-to-home-screen') !== -1)
          return <Redirect to='/lead' />
      }
      else {
        // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        if ('ontouchstart' in window) {
          if (window.location.href.indexOf('/add-to-home-screen') === -1)
          return <Redirect to='/add-to-home-screen' />
        }
        else {
          console.log('display-mode is normal web')
        }
      }
      return <WrappedComponent {...this.props} />
    }
  }
}

export default checkMobileDevice
