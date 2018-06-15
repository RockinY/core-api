// @flow
import type { DBUser } from '../../flowTypes'

export default ({ githubProviderId, githubUsername }: DBUser) => {
  if (!githubProviderId || !githubUsername) return null
  return {
    id: githubProviderId,
    username: githubUsername
  }
}
