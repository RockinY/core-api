// @flow
import type { DBUser } from '../../flowTypes'

export default ({ profilePhoto }: DBUser) => {
  // if the image is being served from the S3 imgix source, return that url
  return profilePhoto
}
