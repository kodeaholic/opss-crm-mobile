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
import checkMobileDevice from '../checkMobileDevice'
import checkAppUpdate from '../checkAppUpdate'
import MetaTags from 'react-meta-tags'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      await import('scroll-behavior-polyfill')
    }
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
          😘😘😘 CRM Mobile đã có version mới. Bấm <button id="app-update-btn">update</button> để cập nhật ngay 😘😘😘 hoặc <button id="hide-update-btn">Để sau</button>
        </div>
      </div>
    )
  }
}

export default compose(
  checkAppUpdate()
)(App)
