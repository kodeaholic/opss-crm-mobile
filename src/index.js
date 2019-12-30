import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import App from './components/app'
import './index.css'
import "typeface-roboto"
const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  target
)
// if ('serviceWorker' in navigator) {
//   console.log("Will the service worker register? 👍")
//   navigator.serviceWorker.register('service-worker.js')
//     .then(function(reg){
//       console.log("Yes, it did. 👍")
//     }).catch(function(err) {
//     console.log("No it didn't. This happened:", err)
//   })
// }

window.isUpdateAvailable = new Promise(function(resolve, reject) {
  // lazy way of disabling service workers while developing
  if ('serviceWorker' in navigator && ['localhost', '127', 'ngrok'].indexOf(window.location.hostname) === -1) {
    // register service worker file
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // new update available
                  resolve(true)
                } else {
                  // no update available
                  resolve(false)
                }
                break
            }
          }
        }
      })
      .catch(err => console.error('[SW ERROR]', err))
  }
})
