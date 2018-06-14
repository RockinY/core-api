// @flow
import type { DBChannel, GraphQLContext } from '../../flowTypes'

export default async (
  { id }: DBChannel,
  _: any,
  { loaders }: GraphQLContext
) => {
  return loaders.channelSettings.load(id).then(settings => {
    return settings.joinSettings
  })
}
