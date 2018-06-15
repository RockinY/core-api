// @flow
import type { DBThread } from '../../flowTypes'

export default ({ attachments }: DBThread) =>
  attachments &&
  attachments.map(attachment => {
    return {
      attachmentType: attachment.attachmentType,
      data: JSON.stringify(attachment.data)
    }
  })
