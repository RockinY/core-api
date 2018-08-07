// @flow
import editUser from './editUser'
import toggleNotificationSettings from './toggleNotificationSettings'
import updateUserEmail from './updateUserEmail'
import deleteCurrentUser from './deleteCurrentUser'
import subscribeWebPush from './subscribeWebPush'
import unsubscribeWebPush from './unsubscribeWebPush'

export type WebPushSubscription = {
  keys: {
    p256dh: string,
    auth: string,
  },
  endpoint: string,
};

module.exports = {
  Mutation: {
    editUser,
    toggleNotificationSettings,
    subscribeWebPush,
    unsubscribeWebPush,
    updateUserEmail,
    deleteCurrentUser
  }
}
