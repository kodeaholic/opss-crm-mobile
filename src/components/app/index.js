import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../home'
import Dashboard from '../dashboard'
// import Home from '../home'
import About from '../about'
import Header from '../header'
import Footer from '../footer'


const App = () => (
  <div className="app-wrapper">
    <Header />
    <main>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/about-us" component={About} />
    </main>
    <Footer />
  </div>
)

export default App
