// @flow
import editUser from './editUser'
import toggleNotificationSettings from './toggleNotificationSettings';
import updateUserEmail from './updateUserEmail';
import deleteCurrentUser from './deleteCurrentUser';

module.exports = {
  Mutation: {
    editUser,
    toggleNotificationSettings,
    updateUserEmail,
    deleteCurrentUser
  },
};
