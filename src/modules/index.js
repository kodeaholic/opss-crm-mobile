import {combineReducers} from 'redux'
import counter from './counter'
import userDuck from './userDuck'
import loginDuck from './loginDuck'
import leadsDuck from './leadsDuck'
import searchDuck from './searchDuck'
// import sessionDuck from './sessionDuck'
import leadDuck from './leadDuck'
import contactDuck from './contactDuck'
import opportunityDuck from './opportunityDuck'
import contactsDuck from './contactsDuck'
import opportunitiesDuck from './opportunitiesDuck'
import calendarDuck from './calendar/calendarDuck'

export default combineReducers({
  counter,
  user: userDuck,
  login: loginDuck,
  leads: leadsDuck,
  search: searchDuck,
  // session: sessionDuck,
  lead: leadDuck,
  contact: contactDuck,
  opportunity: opportunityDuck,
  contacts: contactsDuck,
  potentials: opportunitiesDuck,
  calendar: calendarDuck
})
