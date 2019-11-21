import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../home'
import Dashboard from '../dashboard'

import Lead from '../lead'
import Opportunity from '../opportunity'
import Contact from '../contact'
import Ticket from '../ticket'
import AddNewCustomer from '../save-lead'
import Search from '../search'
import CustomerDetails from '../customer-details'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

import Login from '../login'
import ScrollToTop from './ScrollToTop'
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <div className="app-wrapper">
        <ScrollToTop />
        <ToastContainer autoClose={2000} position="top-center" hideProgressBar />
        <Route exact path="/" component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/lead" component={Lead} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/opportunity" component={Opportunity} />
        <Route exact path="/ticket" component={Ticket} />
        <Route exact path="/add-new-customer" component={AddNewCustomer} />
        <Route exact path="/edit" component={AddNewCustomer} />
        <Route exact path="/search/:keyword" component={Search} />
        <Route
          exact
          path="/customer-details/:custID"
          component={CustomerDetails}
        />
      </div>
    )
  }
}

export default App
