import { combineReducers } from 'redux'
import counter from './counter'
import  userDuck from './userDuck'
import  loginDuck from './loginDuck'
import  leadsDuck from './leadsDuck'
import searchDuck from './searchDuck'
import sessionDuck from './sessionDuck'
import leadDuck from './leadDuck'

export default combineReducers({
  counter,
  user: userDuck,
  login: loginDuck,
  leads: leadsDuck,
  search: searchDuck,
  session: sessionDuck,
  lead: leadDuck
})
