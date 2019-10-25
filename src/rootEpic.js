import { combineEpics } from 'redux-observable'
import _ from 'lodash'
import { userEpics } from './modules/userDuck'

export default combineEpics(..._.values(userEpics))
