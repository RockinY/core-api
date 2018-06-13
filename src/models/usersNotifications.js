// @flow
import db from '../db'

export const markSingleNotificationSeen = (notificationId: string, userId: string): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(notificationId, { index: 'notificationId' })
    .filter({
      userId
    })
    .update(
      {
        isSeen: true
      },
      { returnChanges: true }
    )
    .run()
    .then(() => true)
    .catch(err => false)
}

export const markNotificationsSeen = (userId: string, notifications: Array<string>) => {
  return db
    .table('usersNotifications')
    .getAll(...notifications, { index: 'notificationId' })
    .update({
      isSeen: true
    })
    .run()
}

export const markAllNotificationsSeen = (userId: string): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({ isSeen: false })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications =>
      markNotificationsSeen(
        userId,
        notifications
          .filter(notification => !!notification)
          .map(notification => notification.id)
      )
    )
    .then(() => true)
    .catch(err => false)
}

export const markDirectMessageNotificationsSeen = (
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({ isSeen: false })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications =>
      markNotificationsSeen(
        userId,
        notifications
          .filter(notification => !!notification)
          .map(notification => notification.id)
      )
    )
    .then(() => true)
    .catch(err => false)
}

export const getUsersNotifications = (
  userId: string
): Promise<Array<string>> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .run()
}
