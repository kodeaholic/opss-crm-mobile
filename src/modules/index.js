import { combineReducers } from 'redux'
import counter from './counter'
import  userDuck from './userDuck'
import  loginDuck from './loginDuck'
import  leadsDuck from './leadsDuck'
import addLeadDuck from './addLeadDuck'

export default combineReducers({
  counter,
  user: userDuck,
  login: loginDuck,
  leads: leadsDuck,
  addLead: addLeadDuck
})
