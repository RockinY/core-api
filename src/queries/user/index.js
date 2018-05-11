// @flow
import user from './rootUser'
import currentUser from './rootCurrentUser'
import settings from './settings'

module.exports = {
  Query: {
    user,
    currentUser
  },
  User: {
    settings
  }
}
