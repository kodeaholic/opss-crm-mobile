import { combineReducers } from 'redux'
import counter from './counter'
import  userDuck from './userDuck'
import  loginDuck from './loginDuck'
import  leadsDuck from './leadsDuck'
import saveLeadDuck from './saveLeadDuck'
import searchDuck from './searchDuck'
import sessionDuck from './sessionDuck'

export default combineReducers({
  counter,
  user: userDuck,
  login: loginDuck,
  leads: leadsDuck,
  saveLead: saveLeadDuck,
    search: searchDuck,
  session: sessionDuck
})
