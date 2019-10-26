import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../home'
import Dashboard from '../dashboard'

import Lead from '../lead'
import Opportunity from '../opportunity'
import Contact from '../contact'
import Ticket from '../ticket'
import AddNewCustomer from '../add-new-customer'
import CustomerDetails from '../customer-details'

import Login from '../login'
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <div className="app-wrapper">
        {/* <Header />
        <div className="main"> */}
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" exact component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/lead" component={Lead} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/opportunity" component={Opportunity} />
          <Route exact path="/ticket" component={Ticket} />
          <Route exact path="/add-new-customer" component={AddNewCustomer} />
          <Route
            exact
            path="/customer-details/:custID"
            component={CustomerDetails}
          />
        {/* </div>
        <Footer /> */}
      </div>
    )
  }
}

export default App
