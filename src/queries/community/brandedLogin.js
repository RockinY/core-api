import { DBCommunity, GraphQLContext } from '../../flowTypes'

export default async (
  { id }: DBCommunity,
  _: any,
  { loaders }: GraphQLContext
) => {
  return loaders.communitySettings.load(id).then(settings => {
    if (!settings) {
      return { isEnabled: null, message: null }
    }
    return settings.brandedLogin
  })
}