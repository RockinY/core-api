import oss from 'ali-oss'
import shortid from 'shortid'
import type { FileUpload, EntityTypes } from '../flowTypes'
import sanitize from 'sanitize-filename'
import Raven from './raven'
import _ from 'lodash'

const store = oss({
  accessKeyId: process.env.ALI_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
  bucket: process.env.ALI_OSS_BUCKET_NAME,
  region: process.env.ALI_OSS_BUCKET_REGION
})

export const uploadImage = async (
  file: FileUpload,
  entity: EntityTypes,
  id: string
): Promise<string> => {
  const result = await file
  const { filename, stream, mimetype } = result
  const sanitized = sanitize(filename)
  const validMediaTypes = ['image/gif', 'image/jpeg', 'image/png', 'video/mp4']

  return new Promise(resolve => {
    if (_.indexOf(validMediaTypes, _.toLower(mimetype)) < 0) {
      const unsupportedMediaTypeError = new Error(
        `Unsupported media type ${mimetype}`
      )
      Raven.captureException(unsupportedMediaTypeError)
      throw unsupportedMediaTypeError
    }

    const path = `${entity}/${id}/${shortid.generate()}-${sanitized}`
    return store.putStream(path, stream)
      .then(response => {
        if (!response.url) {
          throw new Error('Image upload failed.')
        }
        resolve(encodeURI(response.url))
      })
      .catch(err => {
        throw new Error(err)
      })
  })
}
