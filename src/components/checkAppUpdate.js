import React, { Component } from 'react'
const checkAppUpdate = () => WrappedComponent => {

  // TODO: try login to get expired token
  return class HOC extends Component {

    showSnackBarUpdate = () => {
      // Get the snackbar DIV
      let snackbar = document.getElementById("snackbar");

      // Add the "show" class to DIV
      snackbar.className = "show";
    }

    render() {
      if (window['isUpdateAvailable'])
      window['isUpdateAvailable']
        .then(isAvailable => {
          if (isAvailable) {
            this.showSnackBarUpdate()
          }
        });
      return <WrappedComponent {...this.props}/>
    }
  }
}

export default checkAppUpdate
