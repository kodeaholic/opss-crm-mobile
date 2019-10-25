import _ from 'lodash'
// Selector

export const getPathName = state => extractPathName(state) || {}

const extractPathName = state => {
  const path = _.get(state, 'router.location.pathname').substring(1)
  var res = path.split('/')
  return res[0]
}
