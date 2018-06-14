import type { DBChannel } from '../../flowTypes'

export default ({ archivedAt, ...rest }: DBChannel) => {
  if (archivedAt) {
    return true
  }
  return false
}