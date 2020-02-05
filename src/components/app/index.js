import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import compose from 'recompose/compose'
import Home from '../home'
import Lead from '../lead'
import Contact from '../contact'
import Search from '../search'
import LeadComponent from '../lead-detail'
import ContactComponent from '../contact-detail'
import OpportunityComponent from '../opportunity-detail'
import ComingSoonComponent from '../comingsoon'
import ComingSoonNoFooter from '../comingsoon/nofooter/comingsoon-nofooter'
import MoreComponent from '../more'
import SearchBoxComponent from '../search-box'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from '../login'
import LogoutComponent from '../logout'
import ScrollToTop from './ScrollToTop'
import AddToHomeScreen from '../a2hs/a2hs'
import MetaTags from 'react-meta-tags'

/* Firebase */
// import { messaging } from '../../init-fcm.js'
import axios from 'axios'
if ('Notification' in window) {
  console.log('Notification API supported')
  var messaging = require('../../init-fcm').messaging
} else {
  // API not supported
  console.log('Notification API not supported')
}
const subscribeToFcmTopic = (token) => {
  const bodyFormData = new FormData()
  let userLoginData = localStorage.getItem('userLoggedInKV')
  let session = null
  if (userLoginData) {
    userLoginData = JSON.parse(userLoginData).result.login
    session = userLoginData.session
  }

  bodyFormData.append('_operation', 'subscribeToFcmTopic')
  bodyFormData.append('_session', session)
  bodyFormData.append('token', token)

  const request = axios({
    method: 'POST',
    url: process.env.REACT_APP_API_URL_KVCRM,
    data: bodyFormData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })

  request
    .then(response => {
      const { success } = response.data
      if (success) {
        console.log('Successful subscribed client to crm_mobile_update topic')
      } else {
        let error = response.data.error
        if (error.code === 1501) {
          console.log('CRM Mobile login required')
        }
        console.log(error)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      await import('scroll-behavior-polyfill')
    }
    if (messaging) try {
      messaging.requestPermission()
        .then(async function() {
          const token = await messaging.getToken().then((currentToken) => {
              subscribeToFcmTopic(currentToken)
              return currentToken
            }
          )
          console.log('FCM token: ' + token)
        })
        .catch(function(err) {
          console.log('Unable to get permission to notify.', err)
        })
      messaging.onMessage((payload) => {

        /* Show snackbar */
        console.log('messaging.onMessage is fired')
        let snackbar = document.getElementById('snackbar')

        // Add the "show" class to DIV
        snackbar.className = 'show'
      })
      messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
          console.log('Token refreshed.')
          subscribeToFcmTopic(refreshedToken)
        }).catch((err) => {
          console.log('Unable to retrieve refreshed token ', err)
        })
      })
    } catch (e) {
      console.log(e.message)
    }
    navigator.serviceWorker.addEventListener('message', (message) => {
      console.log('navigator.serviceWorker event message is fired')
      let snackbar = document.getElementById('snackbar')

      // Add the "show" class to DIV
      snackbar.className = 'show'
    })
  }

  updateApp = () => {
    window.location.reload(true)
  }

  render() {
    return (
      <div className="app-wrapper">
        <MetaTags>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
        </MetaTags>
        <ScrollToTop/>
        <ToastContainer autoClose={2000} position="top-center" hideProgressBar/>
        <Route exact path="/logout" component={LogoutComponent}/>
        <Route exact path="/" render={() => (
          <Redirect to="/lead"/>
        )}/>
        <Route path="/login" exact component={Login}/>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/lead" component={Lead}/>
        <Route exact path="/contact" component={Contact}/>
        <Route exact path="/search/:keyword" component={Search}/>
        <Route
          exact
          path="/lead-view/:id"
          component={LeadComponent}
        />
        <Route
          exact
          path="/lead-edit/:id"
          component={LeadComponent}
        />
        <Route
          exact
          path="/lead-convert/:id"
          component={LeadComponent}
        />
        <Route
          exact
          path="/lead-create"
          component={LeadComponent}
        />
        <Route
          exact
          path="/contact-view/:id"
          component={ContactComponent}
        />
        <Route
          exact
          path="/contact-edit/:id"
          component={ContactComponent}
        />
        <Route
          exact
          path="/opportunity-view/:id"
          component={OpportunityComponent}
        />

        <Route
          exact
          path="/more"
          component={MoreComponent}
        />
        <Route
          exact
          path="/dashboard"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/opportunity"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/home"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/ticket"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/calendar"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/notifications"
          component={ComingSoonComponent}
        />
        <Route
          exact
          path="/coming-soon-no-footer"
          component={ComingSoonNoFooter}
        />
        <Route
          exact
          path="/search-box"
          component={SearchBoxComponent}
        />
        <Route
          exact
          path="/add-to-home-screen"
          component={AddToHomeScreen}
        />
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <div id="snackbar">
          😘😘😘 CRM Mobile đã có version mới. Bấm <button id="app-update-btn"
                                                           onClick={this.updateApp}>update</button> để cập nhật ngay
          😘😘😘
        </div>
      </div>
    )
  }
}

export default compose(
  // checkAppUpdate()
)(App)
