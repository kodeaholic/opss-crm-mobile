import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../home'
import Dashboard from '../dashboard'

import Lead from '../lead'
import Opportunity from '../opportunity'
import Contact from '../contact'
import Ticket from '../ticket'
import Search from '../search'
import LeadComponent from '../lead-detail'
import ContactComponent from '../contact-detail'
import OpportunityComponent from '../opportunity-detail'
import ComingSoonComponent from '../comingsoon'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from '../login'
import LogoutComponent from '../logout'
import ScrollToTop from './ScrollToTop'

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
        <ScrollToTop/>
        <ToastContainer autoClose={2000} position="top-center" hideProgressBar/>
        <Route exact path="/logout" component={LogoutComponent}/>
        <Route exact path="/" component={Lead}/>
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
          component={ComingSoonComponent}
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
      </div>
    )
  }
}

export default App
