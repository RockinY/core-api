// @flow
import thread from './rootThread'

import attachments from './attachments'
import channel from './channel'
import community from './community'
import participants from './participants'
import isAuthor from './isAuthor'
import receiveNotifications from './receiveNotifications'
import messageConnection from './messageConnection'
import author from './author'
import messageCount from './messageCount'
import currentUserLastSeen from './currentUserLastSeen'
import content from './content'
import reactions from './reactions'

module.exports = {
  Query: {
    thread
  },
  Thread: {
    attachments,
    channel,
    community,
    participants,
    isAuthor,
    receiveNotifications,
    messageConnection,
    author,
    messageCount,
    currentUserLastSeen,
    content,
    reactions
  }
}
