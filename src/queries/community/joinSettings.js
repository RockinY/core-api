// @flow
import type { DBCommunity, GraphQLContext } from '../../flowTypes'

export default async (
  { id }: DBCommunity,
  _: any,
  { loaders }: GraphQLContext
) => {
  return loaders.communitySettings.load(id).then(settings => {
    return settings.joinSettings
  })
}
