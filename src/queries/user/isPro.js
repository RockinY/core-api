// @flow
import dayjs from 'dayjs'
import type { GraphQLContext, DBUser } from '../../flowTypes'
import { getMemberSubscriptionsByuserId } from '../../models/memberSubscription'

export default async ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  const userSubscriptions = await loaders.memberSubscriptions.load(id)
  if (userSubscriptions.length === 0) {
    return false
  }

  const sortedUserSubscriptions = userSubscriptions.sort((a, b) => {
    return dayjs(b.endAt).isAfter(dayjs(a.endAt))
  })

  const latestSubscription = sortedUserSubscriptions[0]
  
  if (dayjs(latestSubscription.endAt).isBefore(dayjs())) {
    return false
  }

  return true
}