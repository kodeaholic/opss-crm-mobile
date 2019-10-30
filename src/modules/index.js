import { combineReducers } from 'redux'
import counter from './counter'
import  userDuck from './userDuck'
import  loginDuck from './loginDuck'
import  leadsDuck from './leadsDuck'

export default combineReducers({
  counter,
  user: userDuck,
  login: loginDuck,
  leads: leadsDuck
})
