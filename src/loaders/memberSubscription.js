// @flow
import DataLoader from 'dataloader'
import { getMemberSubscriptionsByUserIds } from '../models/memberSubscription'

export const __createMemberSubscriptionLoader = new DataLoader(userIds => {
  // $FlowFixMe
  return getMemberSubscriptionsByUserIds(userIds)
})

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}