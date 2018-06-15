// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ channelId }: DBThread, _: any, { loaders }: GraphQLContext) =>
  loaders.channel.load(channelId)
