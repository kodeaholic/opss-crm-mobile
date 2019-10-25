import { combineReducers } from 'redux'
import counter from './counter'
import  userDuck from './userDuck'

export default combineReducers({
  counter,
  user: userDuck
})
