// @flow
import type { GraphQLContext } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions'
import { getThreads, getThreadsInTimeframe } from '../../models/thread'
import { getMessage, getMessageCount } from '../../models/message';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) {
    return null
  }

  const threads = await getThreadsInTimeframe('weekly')

  const messageCountPromises = threads.map(async ({ id, ...thread }) => ({
    id,
    messageCount: await getMessageCount(id)
  }))

  const threadsWithMessageCounts = await Promise.all(messageCountPromises)

  const topThreads = threadsWithMessageCounts
    .filter(t => t.messageCount > 0)
    .sort((a, b) => {
      const bc = parseInt(b.messageCount, 10)
      const ac = parseInt(a.messageCount, 10)
      return bc <= ac ? -1 : 1
    })
    .slice(0, 20)
    .map(t => t.id)

  return await getThreads([...topThreads])
}