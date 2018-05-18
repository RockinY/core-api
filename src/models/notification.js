// @flow
import db from '../db'
import type { DBNotification } from '../flowTypes'

export const getNotification = (notificationId: string): Promise<DBNotification> => {
  return db
    .table('notifications')
    .get(notificationId)
    .run()
}

export const getNotifications = (notificationIds: string[]): Promise<Array<DBNotification>> => {
  return db
    .table('notifications')
    .getAll(...notificationIds)
    .run()
    .then(notifications => {
      return notifications.filter(notification => notification && !notification.deletedAt)
    })
}
