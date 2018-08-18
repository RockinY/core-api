// @flow
import dayjs from 'dayjs'
import type { GraphQLContext, DBUser } from '../../flowTypes'
import { getMemberSubscriptionsByuserId } from '../../models/memberSubscription'

export default async ({ id }: DBUser) => {
  const userSubscriptions = await getMemberSubscriptionsByuserId(id)
  const latestSubscription = userSubscriptions[0]
  if (!latestSubscription || dayjs(latestSubscription.endAt).isBefore(dayjs())) {
    return false
  }

  return true
}