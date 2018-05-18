import { getNotifications } from '../models/notification'
import createLoader from './createLoader'

export const __createNotificationLoader = createLoader(notifications => {
  return getNotifications(notifications)
})

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
